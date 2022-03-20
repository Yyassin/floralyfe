"""
CameraSystem.py
====================
Camera Monitoring Subsystem Controller API
"""

__author__ = "yousef"

from typing import Any, Dict, Callable, Union, cast
from time import sleep
from queue import Queue
from flora_node.FloraNode import FloraNode
from datetime import datetime
from Sensors import Sensors
from enum import Enum
import numpy as np

from camera_system.opencv_filters import cv_green_mask, luminescense


class VitalStates(Enum):
    IDLE = 1
    MEASURE_VITALS = 2
    COMPARE_OPTIMA = 3
    SEND_NOTIFICATION = 4
    PUBLISH_VITAL = 5
    SET_SENSE_ICON = 6


class SenseIcon(Enum):
    CLEAR = "CLEAR"
    SUN = "SUN"
    MOISTURE = "MOISTURE"
    THERMOMETER = "THERMOMETER"
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


# For testing
blank_image = np.zeros((512, 512, 3), np.uint8)
blank_image[:] = (118, 118, 118)


class VitalSystem(FloraNode):
    """
        Higher level camera monitoring subsystem API. Controls
        the RPi camera and servo to...
    """

    def __init__(self: "VitalSystem", task_queue: "Queue[Any]",
                 sensors: Sensors, name: Union[str, None] = None) -> None:
        """
            Initializes the Camera System.

            :param task_queue: Queue[Any], queue of tasks for worker thread to process.
            :param pins: Dict[str, Dict[str, Any]], channel tagged and labelled RPi gpio pins.
            :param name: Union[str, None], this CameraSystem's name (used in logging).

            >>> camera = CameraSystem()
            >>> camera.run()
        """
        super().__init__(task_queue, sensors, name)
        self.state = VitalStates.IDLE
        self.vitals: Dict[str, Any] = {}
        self.optima: Dict[str, bool] = {}
        self.client_msg: Any = None
        self.optima_to_icon_enum = {
            "temperature": SenseIcon.THERMOMETER,
            "waterLevel": SenseIcon.WATER_LEVEL,
            "soilMoisture": SenseIcon.MOISTURE,
            "humidity": SenseIcon.SUN
        }
        self.enum_to_icon = {
            SenseIcon.THERMOMETER: HAPPY_ICON,
            SenseIcon.WATER_LEVEL: HAPPY_ICON,
            SenseIcon.MOISTURE: HAPPY_ICON,
            SenseIcon.SUN: HAPPY_ICON,
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
        self.logger.debug(f"Got {msg}")
        self.logger.warn(f"Setting SenseHat to {msg['payload']['icon']}")

        self.client_msg = msg["payload"]
        self.state = VitalStates.SET_SENSE_ICON
        
    def idle(self: "VitalSystem") -> None:
        self.logger.debug("IDLE")

        sleep(0)

        self.state = VitalStates.MEASURE_VITALS

    def measure_vitals(self: "VitalSystem") -> None:
        self.logger.debug("MEASURE_VITALS")

        my_date = datetime.now()

        self.vitals = {
            "soilMoisture": self.sensors.get_soil_moisture(),
            "temperature": self.sensors.get_temperature(),
            "airHumidity": self.sensors.get_humidity(),
            "waterLevel": self.sensors.get_water_level(),
            "light": luminescense(blank_image),
            "greenGrowth": cv_green_mask("./images/bright_plant.jpg"),
            "plantID": "yousef-plant",
            "createdAt": my_date.isoformat()
        }

        self.logger.debug(f"Got vitals: {self.vitals}")
        self.state = VitalStates.COMPARE_OPTIMA

    def compare_optima(self: "VitalSystem") -> None:
        self.logger.debug("COMPARE_OPTIMA")

        # Get this from db eventually
        optima = {
            "soilMoisture": 0.3,
            "temperature": 20,
            "airHumidity": 20,
            "waterLevel": 0.2
        }

        below_threshold = False
        for optimal in optima:
            if float(self.vitals[optimal]) < float(optima[optimal]):
                self.optima[optimal] = True
                below_threshold = True
                self.logger.debug(f"{optimal} is below the optimal value!")

        self.state = VitalStates.SEND_NOTIFICATION if below_threshold else VitalStates.PUBLISH_VITAL

    def send_notification(self: "VitalSystem") -> None:
        self.logger.debug("SEND_NOTIFICATION")

        sleep(0)

        self.state = VitalStates.PUBLISH_VITAL

    def publish_vital(self: "VitalSystem") -> None:
        self.logger.debug("PUBLISH_VITAL")

        sleep(0)

        self.state = VitalStates.SET_SENSE_ICON

    def set_sense_icon(self: "VitalSystem") -> None:
        self.logger.debug("SET_SENSE_ICON")

        if self.client_msg:
            icon_enum = self.client_msg["icon"]
            self.logger.debug(f"Got client msg, setting sense icon: {icon_enum}")
            self.sensors.set_sense_mat(self.enum_to_icon[SenseIcon(icon_enum)])      # type: ignore
            self.client_msg = None
            self.state = VitalStates.IDLE
            return

        for optimal in self.optima:
            self.logger.debug(f"{self.optima[optimal]}")
            if self.optima[optimal]:
                icon_enum = self.optima_to_icon_enum[optimal]
                self.logger.debug(f"Setting sense icon: {icon_enum}")

                self.sensors.set_sense_mat(self.enum_to_icon[icon_enum])  # type: ignore

                self.state = VitalStates.IDLE
                return

        self.sensors.set_sense_mat(self.enum_to_icon[SenseIcon.HAPPY])  # type: ignore
        self.logger.debug(f"Setting sense icon: {SenseIcon.HAPPY}")
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

    def main(self: "VitalSystem") -> None:
        while True:
            self.execute()

    def test_function(self: "VitalSystem") -> str:
        assert(self.sensors is not None)

        """
            A test function to test testing.
            :returns: str, the test output "test".
        """
        self.logger.debug("Test function works")
        return "test"
