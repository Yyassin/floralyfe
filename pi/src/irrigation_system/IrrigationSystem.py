"""
IrrigationSystem.py
====================
Irrigation Subsystem Controller API
"""

__author__ = 'Abdalla'

from time import sleep
from typing import Any, Union
from queue import Queue
from flora_node.FloraNode import FloraNode
from Sensors import Sensors


class IrrigationSystem(FloraNode):
    """
        Higher level irrigation and moisture monitoring subsystem API.
        Monitors moisture sensors and controls water pumps to ...
    """

    def __init__(self: "IrrigationSystem", task_queue: "Queue[Any]", sensors: Sensors, name: Union[str, None] = None) -> None:
        """
            Initializes the Irrigation System.

            :param task_queue: Queue[Any], queue of tasks for worker thread to process.
            :param name: Union[str, None], this IrrigationSystem's name (used in logging).

            >>> irrigation = IrrigationSystem()
            >>> irrigation.run()
        """
        super().__init__(task_queue, sensors, name)

    def worker(self: "IrrigationSystem") -> None:
        """
            The Irrigation System's worker thread. Processes incoming tasks in
            the task queue...
        """
        while True:
            msg = self.task_queue.get()
            self.logger.debug(f"Got {msg}")
            self.logger.warn(f"Activating water pump for {msg['payload']['wateringTimeout']} seconds")

    def main(self: "IrrigationSystem") -> None:
        self.logger.debug("Pump on")
        self.sensors.turn_on_pump()
        sleep(2)
        self.logger.debug("Pump off")
        self.sensors.turn_off_pump()

        self.logger.debug(str(self.sensors.get_soil_moisture()))
        self.logger.debug(str(self.sensors.get_water_level()))

    def test_function(self: "IrrigationSystem") -> str:
        """
            A test function to test testing.
            :returns: str, the test output "test".
        """
        self.logger.debug("Test function works")
        return "test"
