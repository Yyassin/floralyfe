"""
VitalSystem.py
====================
Vital Monitoring Subsystem Controller API

Periodically reads and aggregrates all sensor data and
sends either sends a streamed vital or publishes a persisted vital
to the database.

Compares vital information to set plant thresholds - if they drop
below the thresholds, creates and sends a notification with
the critical vitals. Updates the SenseHat with an informative icon
according to the vital state.
"""

__author__ = "yousef"

import threading
import schedule
from enum import Enum
from time import sleep
from queue import Queue
from datetime import datetime
from config import config
from typing import Any, Dict, Union, cast
from flora_node.FloraNode import FloraNode
from Sensors import Sensors     # type: ignore
from camera_system.camera_util import image_buffer
from query.create_notification import create_notification
from query.vitals_query import create_vital
from query.send_email import send_email
from ws import WSClient
from database import Plant
from camera_system.opencv_filters import green_mask, luminescense


# States in the vital finite state machine.
class VitalStates(Enum):
    IDLE = 1
    MEASURE_VITALS = 2
    COMPARE_OPTIMA = 3
    SEND_NOTIFICATION = 4
    PUBLISH_VITAL = 5
    SET_SENSE_ICON = 6


# Supported SenseHat Icons.
class SenseIcon(Enum):
    CLEAR = "CLEAR"
    SUN = "HUMIDITY"
    MOISTURE = "MOISTURE"
    THERMOMETER = "TEMPERATURE"
    WATER_LEVEL = "WATER_LEVEL"
    HAPPY = "HAPPY"


# Color RGB definitions
Y = (255, 255, 0)           # Yellow
B = (0, 0, 255)             # Blue
R = (255, 0, 0)             # Red
K = (46, 26, 71)            # Purple ('Black' - doesn't work since 0,0,0 is clear)
C = (0, 0, 0)               # Clear/off

# ---- Icon Colour Matrices ---- #
HAPPY_ICON = [
    C, C, Y, Y, Y, Y, C, C,
    C, Y, Y, Y, Y, Y, Y, C,
    Y, Y, K, Y, Y, K, Y, Y,
    Y, Y, Y, Y, Y, Y, Y, Y,
    Y, K, Y, Y, Y, Y, Y, Y,
    Y, Y, K, K, K, K, Y, Y,
    C, Y, Y, Y, Y, Y, Y, C,
    C, C, Y, Y, Y, Y, C, C
]

SUN_ICON = [
    Y, Y, C, C, C, C, Y, C,
    C, Y, Y, C, C, Y, Y, C,
    C, C, Y, Y, Y, Y, C, C,
    Y, Y, Y, Y, Y, Y, Y, Y,
    C, C, Y, Y, Y, Y, C, C,
    C, Y, Y, Y, Y, Y, C, C,
    C, Y, C, Y, C, Y, Y, C,
    Y, Y, C, Y, C, C, Y, Y
]

MOISTURE_ICON = [
    C, C, C, B, B, C, C, C,
    C, C, C, B, B, C, C, C,
    C, C, B, B, B, B, C, C,
    C, C, B, B, B, B, C, C,
    C, B, B, B, B, B, B, C,
    C, B, B, B, B, B, B, C,
    C, B, B, B, B, B, B, C,
    C, C, B, B, B, B, C, C,
]

WATER_LEVEL_ICON = [
    C, C, C, C, C, C, C, C,
    C, C, C, C, C, C, C, C,
    C, C, B, C, C, B, C, C,
    C, B, B, C, B, B, B, C,
    B, B, B, B, B, B, B, B,
    B, B, B, B, B, B, B, B,
    B, B, B, B, B, B, B, B,
    B, B, B, B, B, B, B, B,
]

THERMOMETER_ICON = [
    C, C, C, K, K, C, C, C,
    C, C, K, C, C, K, C, C,
    C, C, K, R, R, K, C, C,
    C, C, K, R, R, K, C, C,
    C, K, R, R, R, R, K, C,
    C, K, R, R, R, R, K, C,
    C, K, R, R, R, R, K, C,
    C, C, K, K, K, K, C, C,
]


class VitalSystem(FloraNode):
    """
        Higher level vital monitoring subsystem API. Reads sensor data
        to create and send vitals and notifications. Sets the SenseHat
        icon with infomative according icon.
    """

    def __init__(self: "VitalSystem", task_queue: "Queue[Any]",
                 sensors: Sensors, ws: "WSClient", deviceID: str, email: str, name: Union[str, None] = None) -> None:
        """
            Initializes the Vital System.

            :param task_queue: Queue[Any], queue of tasks for worker thread to process.
            :param sensors: Sensors, sensor interface.
            :param ws: WSClient, the websockt client.
            :param deviceID: str, this device's id.
            :param email: str, the logged in user's id.
            :param name: Union[str, None], this VitalSystem's name (used in logging).

            >>> vitals = VitalSystem()
            >>> vitals.run()
        """
        super().__init__(task_queue, sensors, ws, name)
        self.state = VitalStates.IDLE   # Initialized to idle.
        self.registering = True         # True if we're sending registration vitals (non-plant specific)
        self.deviceID = deviceID
        self.email = email
        self.vitals: Dict[str, Any] = {}            # Last measured vital.
        self.plant_optima: Dict[str, float] = {}    # Selected plant's optima thresholds.
        self.optima: Dict[str, bool] = {}           # Keeps track which optima are critical.

        # Maps critical optima to informative icon name.
        self.optima_to_icon_enum = {
            "temperature": SenseIcon.THERMOMETER,
            "waterLevel": SenseIcon.WATER_LEVEL,
            "soilMoisture": SenseIcon.MOISTURE,
            "humidity": SenseIcon.SUN
        }

        # Maps icon names to pixel matrices.
        self.enum_to_icon = {
            SenseIcon.THERMOMETER: THERMOMETER_ICON,
            SenseIcon.WATER_LEVEL: WATER_LEVEL_ICON,
            SenseIcon.MOISTURE: MOISTURE_ICON,
            SenseIcon.SUN: SUN_ICON,
            SenseIcon.HAPPY: HAPPY_ICON
        }

    def worker(self: "VitalSystem") -> None:
        """
            The Vital System's worker thread. Processes incoming tasks in
            the task queue.
        """
        while True:
            self.process_queue()

    def process_queue(self: "VitalSystem") -> None:
        """
        Processes all supported messages from the client.
        """
        # Block until we receive a message
        msg = self.task_queue.get()
        # self.logger.debug(f"Got {msg}")

        # Destructure into payload and topic
        client_msg = msg["payload"]
        topic = client_msg["topic"]

        if topic == "dashboard-topic":
            # We're on the dashboard now, send plant specific vitals.
            self.registering = False
        elif topic == "sensehat-icon-topic":
            # Set the SenseHat Icon to the specified one.
            self.set_sense_icon(client_msg)
        elif topic == "select-plant-topic":
            # Client selected a new plant, switch the one in Sensors accordingly.
            selected_plant_id = client_msg["plantID"]
            plant = Plant.get(Plant.plantID == selected_plant_id)
            self.sensors.set_selected_plant(selected_plant_id, plant.registeredChannel)

        # Toggle sensor values for testing -- not used anymore.
        elif topic == "toggle-water":
            self.sensors.set_water_mean(0.1 if self.sensors.water_mean > 0.5 else 0.95)
        elif topic == "toggle-channel-1":
            self.sensors.set_moisture_mean(0.15 if self.sensors.channel[1]["mean"] > 0.5 else 0.9, 1)
        elif topic == "toggle-channel-2":
            self.sensors.set_moisture_mean(0.0 if self.sensors.channel[2]["mean"] > 0.5 else 0.82, 2)
        elif topic == "increase-channel":
            self.sensors.set_moisture_mean(self.sensors.channel[2]["mean"] + 0.05, 2)

    def idle(self: "VitalSystem") -> None:
        """
        Keeps the node in the Idle state - busy wait. The
        only way to leave idle is a scheduled event.
        """
        self.logger.debug("IDLE")

    def get_vitals(self: "VitalSystem") -> Any:
        """
        Reads the vitals of the selected plant.
        """

        # Get last image captured.
        if (image_buffer[0] is None):
            self.state = VitalStates.IDLE
            return None

        # Get the selected plant's channel, ensure one is registered.
        try:
            plant = Plant.get(Plant.plantID == self.sensors.get_selected_plant_id())
        except Exception as e:
            self.logger.debug(f"No plants registered: {e}")
            self.state = VitalStates.IDLE
            return None

        channel = plant.registeredChannel

        # Read all vitals and generate a vital message.
        my_date = datetime.now()
        frame = image_buffer[0]
        self.vitals = {
            "soilMoisture": self.sensors.get_soil_moisture(channel),
            "temperature": self.sensors.get_temperature(),
            "airHumidity": self.sensors.get_humidity(),
            "waterLevel": self.sensors.get_water_level(),
            "light": luminescense(frame),
            "greenGrowth": green_mask(frame) * 100,
            "gpios": self.sensors.get_gpios(),
            "plantID": self.sensors.get_selected_plant_id(),
            "createdAt": my_date.isoformat(),
        }

        # Compare vitals against optima thresholds and
        # mark the vital as critical if at least one vital is not optimal.
        optima = eval(plant.optima)
        self.logger.debug(f"Comparing against optima: {optima}")

        below_threshold = False
        for optimal in optima:
            if float(self.vitals[optimal]) < float(optima[optimal]):
                below_threshold = True
                self.logger.debug(f"{optimal} is below the optimal value!")

        self.vitals["critical"] = below_threshold

        return self.vitals

    def start_vital_stream(self: "VitalSystem") -> None:
        """
            Peridiocally sends a live vital to the client.
            This should be triggered by an independent thread.
        """
        while (True):
            # Read the sensors and generate a vital. Register vitals have all channel info,
            # while regular vitals are specific to the selected plant.
            vital = self.get_register_vitals() if self.registering else self.get_vitals()
            self.logger.debug(f"registering ? {self.registering}")

            # Send the vital.
            msg = {
                "payload": {
                    "vital": vital
                }
            }
            topic = "register-vital-topic" if self.registering else "vitals-topic"
            self.send(msg, topic)
            sleep(5)

    def get_register_vitals(self: "VitalSystem") -> Any:
        """
        Reads the vitals of all sensors and generates a meta
        registering vital.
        """
        gpios = self.sensors.get_gpios()

        vitals = {
            "common": {
                "temperature": self.sensors.get_temperature(),
                "airHumidity": self.sensors.get_humidity(),
                "waterLevel": self.sensors.get_water_level(),
            },
            "channel1": {
                "moisture": {
                    "value": self.sensors.get_soil_moisture(1),
                    "gpio": gpios[0]
                },
                "waterPump": {
                    "gpio": gpios[2]
                }
            },
            "channel2": {
                "moisture": {
                    "value": self.sensors.get_soil_moisture(2),
                    "gpio": gpios[1]
                },
                "waterPump": {
                    "gpio": gpios[3]
                }
            }
        }

        return vitals

    def measure_vitals(self: "VitalSystem") -> None:
        """
        Follows idle in the primary vital notification state machine. Measures
        all sensor data and saves a vital.
        """
        self.logger.debug("MEASURE_VITALS")

        if self.get_vitals() is None:
            self.state = VitalStates.IDLE
            return

        self.logger.debug(f"Got vitals: {self.vitals}")
        self.state = VitalStates.COMPARE_OPTIMA

    def compare_optima(self: "VitalSystem") -> None:
        """
        Compares the last recorded vital with the associated plant's
        optima thresholds. Marks the vital as critical and sends a notification
        if any vitals are below their thresholds.
        """
        self.logger.debug("COMPARE_OPTIMA")

        # Get the stored plant optima
        try:
            plant = Plant.get(Plant.plantID == self.sensors.get_selected_plant_id())
            optima = eval(plant.optima)
            self.plant_optima = optima
            self.logger.debug(f"Comparing against optima: {optima}")
        except Exception as e:
            self.logger.debug(f"No plants registered: {e}")
            self.state = VitalStates.IDLE
            return None

        # Compare the optima with the recorded vital.
        below_threshold = False
        for optimal in optima:
            if float(self.vitals[optimal]) < float(optima[optimal]):
                self.optima[optimal] = True
                below_threshold = True
                self.logger.debug(f"{optimal} is below the optimal value!")

        # Send notification if a vital is critical, skip and publish the vital (to the db) otherwise.
        self.state = VitalStates.SEND_NOTIFICATION if below_threshold else VitalStates.PUBLISH_VITAL

    def get_opt_sentence(self: "VitalSystem", optimal: Any) -> str:
        """
        Formats a critical vital tag for notififcations for the specificied optimum.

        :param optimal: Any, the optimum to format a message for.
        """
        return f"<b> {optimal} </b>: (current: {self.vitals[optimal]}, optimal: {self.plant_optima[optimal]})"

    def send_notification(self: "VitalSystem") -> None:
        """
        Creates a notification and sends an email with information of critical
        vitals in the event that vitals fall below set thresholds.
        """
        self.logger.debug("SEND_NOTIFICATION")

        # Store all the vitals that are critical and generate a meta tag for each.
        below_optimal_types = [optimal for optimal in self.optima if self.optima[optimal]]
        below_optimal = [self.get_opt_sentence(optimal) for optimal in self.optima if self.optima[optimal]]

        # Format the tags into an email message.
        new_line = "\n"
        email_msg = f"""
            The following vitals for plant-{self.sensors.selected_plant_id} are below their set thresholds and need
            your attention
            {new_line}{new_line.join(below_optimal)}
        """

        # Send an email with the notification.
        send_email(
            self.email,
            f"Floralyfe: Vitals Critical (Plant-{self.sensors.selected_plant_id})",
            email_msg,
            f"{email_msg}",
            f"{config.API_SERVER}/notification/sendEmail"
        )

        # Create a notification for the priority critical vital (they are
        # listed in order of priority, so this is going to be the first one in the optimal list).
        type = str(self.optima_to_icon_enum[below_optimal_types[0]].value)
        create_notification({
            "label": type,
            "type": type,
            "plantID": self.sensors.get_selected_plant_id(),
            "deviceID": self.deviceID
        })

        self.state = VitalStates.PUBLISH_VITAL

    def publish_vital(self: "VitalSystem") -> None:
        """
        Formats the recorded vital and publishes it
        to the cloud database.
        """
        self.logger.debug("PUBLISH_VITAL")

        vital = self.vitals
        vital_msg = {
            "soilMoisture": vital["soilMoisture"],
            "airHumidity": vital["airHumidity"],
            "light": vital["light"],
            "temperature": vital["temperature"],
            "greenGrowth": vital["greenGrowth"],
            "plantID": self.sensors.get_selected_plant_id(),
            "deviceID": self.deviceID
        }

        create_vital(vital_msg)

        self.state = VitalStates.SET_SENSE_ICON

    def set_sense_icon(self: "VitalSystem", msg: Any = None) -> None:
        """
        Sets the sense icon with an informative icon according to the
        last recorded vital. Can be overridden by client to display
        a toggled icon - in which case, this will be in msg.

        :param msg: Any, None if triggered by state machine. Otherwise,
        contains icon to set the SenseHat to sent by client.
        """
        self.logger.debug("SET_SENSE_ICON")

        # If we have a message, set the icon to the one specified by the client.
        if msg:
            icon_enum = msg["icon"]
            self.logger.debug(f"Got client msg, setting sense icon: {icon_enum}")
            self.sensors.set_sense_mat(self.enum_to_icon[SenseIcon(icon_enum)])
            self.state = VitalStates.IDLE
            return

        # Otherwise, set the icon to the one attached to the priority critical vital.
        for optimal in self.optima:
            self.logger.debug(f"{self.optima[optimal]}")
            if self.optima[optimal]:
                icon_enum = self.optima_to_icon_enum[optimal]
                self.logger.debug(f"Setting sense icon: {icon_enum}")

                # Notify the client which icon is being set so
                # it can update the interface accordingly.
                msg = {
                    "payload": {
                        "icon": icon_enum.value
                    }
                }
                topic = "set-sense-topic"
                self.send(msg, topic)
                self.logger.warn(f"sent {msg}")

                # Set the SenseHat icon.
                self.sensors.set_sense_mat(self.enum_to_icon[icon_enum])

                self.state = VitalStates.IDLE
                return

        # If nothing is below thresholds, set the icon to happy.
        self.sensors.set_sense_mat(self.enum_to_icon[SenseIcon.HAPPY])
        self.logger.debug(f"Setting sense icon: {SenseIcon.HAPPY}")

        msg = {
            "payload": {
                "icon": SenseIcon.HAPPY.value
            }
        }
        topic = "set-sense-topic"
        self.send(msg, topic)
        self.logger.warn(f"sent {msg}")

        self.state = VitalStates.IDLE

    def execute(self: "VitalSystem") -> None:
        """
        Executes each cycle of the state machine.
        """
        stateOperation = {
            VitalStates.IDLE: self.idle,
            VitalStates.MEASURE_VITALS: self.measure_vitals,
            VitalStates.COMPARE_OPTIMA: self.compare_optima,
            VitalStates.SEND_NOTIFICATION: self.send_notification,
            VitalStates.PUBLISH_VITAL: self.publish_vital,
            VitalStates.SET_SENSE_ICON: self.set_sense_icon
        }
        stateOperation = cast(Dict[VitalStates, Any], stateOperation)

        def default() -> None:
            self.state = VitalStates.IDLE

        stateOperation.get(self.state, default)()   # type: ignore

    def start_state_machine(self: "VitalSystem") -> None:
        """
            Triggeres a cycle of the entire state machine by
            transitioning away from idle. This is scheduled periodically
            in main.
        """
        self.state = VitalStates.MEASURE_VITALS
        self.logger.debug("Measuring vitals")

    def main(self: "VitalSystem") -> None:
        """
        Vital system main thread, excercises the
        state machien and triggers the entire state machine
        cycle periodically.
        """
        while True:
            self.execute()
            schedule.run_pending()
            sleep(1)

    def run(self: "VitalSystem") -> None:
        """
        Starts the vital system threads.
        Starts the main thread for periodic vital measurments and notification publishing.
        The worker thread to respond to client messages.
        The vital stream thread to stream live vitals.
        """
        super().run()

        # Stream live vitals to the client
        self.vital_stream_thread = threading.Thread(target=self.start_vital_stream, daemon=True)
        self.vital_stream_thread.start()

        # Schedule a cycle of the main state machine to occur every minute.
        schedule.every().minute.at(":00").do(self.start_state_machine)
