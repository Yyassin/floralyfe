"""
CameraSystem.py
====================
Camera Monitoring Subsystem Controller API
"""

__author__ = "yousef"

from config import config
from typing import Any, Dict, Callable, Union, cast
from time import sleep
from queue import Queue
from flora_node.FloraNode import FloraNode
from datetime import datetime
from Sensors import Sensors
from enum import Enum
from camera_system.camera_util import image_buffer
from query.create_notification import create_notification
from query.vitals_query import create_vital
from query.send_email import send_email
from ws import WSClient
from database import Plant
import threading
import schedule

from camera_system.opencv_filters import green_mask, luminescense


class VitalStates(Enum):
    IDLE = 1
    MEASURE_VITALS = 2
    COMPARE_OPTIMA = 3
    SEND_NOTIFICATION = 4
    PUBLISH_VITAL = 5
    SET_SENSE_ICON = 6


class SenseIcon(Enum):
    CLEAR = "CLEAR"
    SUN = "HUMIDITY"
    MOISTURE = "MOISTURE"
    THERMOMETER = "TEMPERATURE"
    WATER_LEVEL = "WATER_LEVEL"
    HAPPY = "HAPPY"


Y = (255, 255, 0)
B = (0, 0, 255)
R = (255, 0, 0)
K = (46, 26, 71)
C = (0, 0, 0)

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
        Higher level camera monitoring subsystem API. Controls
        the RPi camera and servo to...
    """

    def __init__(self: "VitalSystem", task_queue: "Queue[Any]",
                 sensors: Sensors, ws: "WSClient", deviceID: str, email: str, name: Union[str, None] = None) -> None:
        """
            Initializes the Camera System.

            :param task_queue: Queue[Any], queue of tasks for worker thread to process.
            :param pins: Dict[str, Dict[str, Any]], channel tagged and labelled RPi gpio pins.
            :param name: Union[str, None], this CameraSystem's name (used in logging).

            >>> camera = CameraSystem()
            >>> camera.run()
        """
        super().__init__(task_queue, sensors, ws, name)
        self.state = VitalStates.IDLE
        self.registering = True
        self.deviceID = deviceID
        self.email = email
        self.vitals: Dict[str, Any] = {}
        self.plant_optima = {}
        self.optima: Dict[str, bool] = {}
        self.optima_to_icon_enum = {
            "temperature": SenseIcon.THERMOMETER,
            "waterLevel": SenseIcon.WATER_LEVEL,
            "soilMoisture": SenseIcon.MOISTURE,
            "humidity": SenseIcon.SUN
        }
        self.enum_to_icon = {
            SenseIcon.THERMOMETER: THERMOMETER_ICON,
            SenseIcon.WATER_LEVEL: WATER_LEVEL_ICON,
            SenseIcon.MOISTURE: MOISTURE_ICON,
            SenseIcon.SUN: SUN_ICON,
            SenseIcon.HAPPY: HAPPY_ICON
        }

    def worker(self: "VitalSystem") -> None:
        """
            The Camera System's worker thread. Processes incoming tasks in
            the task queue...
        """
        while True:
            self.process_queue()

    def process_queue(self: "VitalSystem") -> None:
        msg = self.task_queue.get()
        # self.logger.debug(f"Got {msg}")

        client_msg = msg["payload"]
        topic = client_msg["topic"]

        if topic == "dashboard-topic":
            self.registering = False
        elif topic == "sensehat-icon-topic":
            self.set_sense_icon(client_msg)
        elif topic == "select-plant-topic":
            selected_plant_id = client_msg["plantID"]
            plant = Plant.get(Plant.plantID == selected_plant_id)
            self.sensors.set_selected_plant(selected_plant_id, plant.registeredChannel)
        elif topic == "toggle-water":
            self.sensors.set_water_mean(0.1 if self.sensors.water_mean > 0.5 else 0.95)
        elif topic == "toggle-channel-1":
            self.sensors.set_moisture_mean(0.15 if self.sensors.channel[1]["mean"] > 0.5 else 0.9, 1)   # type: ignore
        elif topic == "toggle-channel-2":
            self.sensors.set_moisture_mean(0.0 if self.sensors.channel[2]["mean"] > 0.5 else 0.82, 2)    # type: ignore
        elif topic == "increase-channel":
            self.sensors.set_moisture_mean(self.sensors.channel[2]["mean"] + 0.05, 2)    # type: ignore

    def idle(self: "VitalSystem") -> None:
        self.logger.debug("IDLE")

    def get_vitals(self: "VitalSystem") -> Any:
        if (image_buffer[0] is None):
            self.state = VitalStates.IDLE
            return None

        try:
            plant = Plant.get(Plant.plantID == self.sensors.get_selected_plant_id())
        except Exception as e:
            self.logger.debug(f"No plants registered: {e}")
            self.state = VitalStates.IDLE
            return None

        channel = plant.registeredChannel

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
        while (True):
            vital = self.get_register_vitals() if self.registering else self.get_vitals()
            self.logger.debug(f"registering ? {self.registering}")

            msg = {
                "payload": {
                    "vital": vital
                }
            }
            topic = "register-vital-topic" if self.registering else "vitals-topic"
            self.send(msg, topic)
            sleep(1)

    def get_register_vitals(self: "VitalSystem") -> Any:
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
        self.logger.debug("MEASURE_VITALS")

        if self.get_vitals() is None:
            self.state = VitalStates.IDLE
            return

        self.logger.debug(f"Got vitals: {self.vitals}")
        self.state = VitalStates.COMPARE_OPTIMA

    def compare_optima(self: "VitalSystem") -> None:
        self.logger.debug("COMPARE_OPTIMA")

        try:
            plant = Plant.get(Plant.plantID == self.sensors.get_selected_plant_id())
            optima = eval(plant.optima)
            self.plant_optima = optima
            self.logger.debug(f"Comparing against optima: {optima}")
        except Exception as e:
            self.logger.debug(f"No plants registered: {e}")
            self.state = VitalStates.IDLE
            return None

        below_threshold = False
        for optimal in optima:
            if float(self.vitals[optimal]) < float(optima[optimal]):
                self.optima[optimal] = True
                below_threshold = True
                self.logger.debug(f"{optimal} is below the optimal value!")

        self.state = VitalStates.SEND_NOTIFICATION if below_threshold else VitalStates.PUBLISH_VITAL

    def get_opt_sentence(self: "VitalSystem", optimal: Any) -> str:
        return f"<b> {optimal} </b>: (current: {self.vitals[optimal]}, optimal: {self.plant_optima[optimal]})"

    def send_notification(self: "VitalSystem") -> None:
        self.logger.debug("SEND_NOTIFICATION")

        below_optimal_types = [optimal for optimal in self.optima if self.optima[optimal]]
        below_optimal = [self.get_opt_sentence(optimal) for optimal in self.optima if self.optima[optimal]]
        new_line = "\n"
        email_msg = f"""
            The following vitals for plant-{self.sensors.selected_plant_id} are below their set thresholds and need
            your attention
            {new_line}{new_line.join(below_optimal)}
        """

        send_email(
            self.email,
            f"Floralyfe: Vitals Critical (Plant-{self.sensors.selected_plant_id})",
            email_msg,
            f"{email_msg}",
            f"{config.API_SERVER}/notification/sendEmail"
        )

        type = str(self.optima_to_icon_enum[below_optimal_types[0]].value)
        create_notification({
            "label": type,
            "type": type,
            "plantID": self.sensors.get_selected_plant_id(),
            "deviceID": self.deviceID
        })

        self.state = VitalStates.PUBLISH_VITAL

    def publish_vital(self: "VitalSystem") -> None:
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
        self.logger.debug("SET_SENSE_ICON")

        if msg:
            icon_enum = msg["icon"]
            self.logger.debug(f"Got client msg, setting sense icon: {icon_enum}")
            self.sensors.set_sense_mat(self.enum_to_icon[SenseIcon(icon_enum)])      # type: ignore
            self.state = VitalStates.IDLE
            return

        for optimal in self.optima:
            self.logger.debug(f"{self.optima[optimal]}")
            if self.optima[optimal]:
                icon_enum = self.optima_to_icon_enum[optimal]
                self.logger.debug(f"Setting sense icon: {icon_enum}")

                msg = {
                    "payload": {
                        "icon": icon_enum.value
                    }
                }
                topic = "set-sense-topic"
                self.send(msg, topic)
                self.logger.warn(f"sent {msg}")

                self.sensors.set_sense_mat(self.enum_to_icon[icon_enum])  # type: ignore

                self.state = VitalStates.IDLE
                return

        self.sensors.set_sense_mat(self.enum_to_icon[SenseIcon.HAPPY])  # type: ignore
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
        stateOperation = {
            VitalStates.IDLE: self.idle,
            VitalStates.MEASURE_VITALS: self.measure_vitals,
            VitalStates.COMPARE_OPTIMA: self.compare_optima,
            VitalStates.SEND_NOTIFICATION: self.send_notification,
            VitalStates.PUBLISH_VITAL: self.publish_vital,
            VitalStates.SET_SENSE_ICON: self.set_sense_icon
        }
        stateOperation = cast(Dict[VitalStates, Callable[..., Any]], stateOperation)

        def default() -> None:
            self.state = VitalStates.IDLE

        stateOperation.get(self.state, default)()

    def start_state_machine(self: "VitalSystem") -> None:
        self.state = VitalStates.MEASURE_VITALS
        self.logger.debug("Measuring vitals")

    def main(self: "VitalSystem") -> None:
        while True:
            self.execute()
            schedule.run_pending()
            sleep(1)

    def run(self: "VitalSystem") -> None:
        super().run()
        self.vital_stream_thread = threading.Thread(target=self.start_vital_stream, daemon=True)
        self.vital_stream_thread.start()

        schedule.every().minute.at(":00").do(self.start_state_machine)

    def test_function(self: "VitalSystem") -> str:
        assert(self.sensors is not None)

        """
            A test function to test testing.
            :returns: str, the test output "test".
        """
        self.logger.debug("Test function works")
        return "test"
