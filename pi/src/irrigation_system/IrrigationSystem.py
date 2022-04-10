"""
IrrigationSystem.py
====================
Irrigation Subsystem Controller API
"""

__author__ = 'abdalla'

# from time import sleep
from database import User, Plant
from typing import Any, Union
from queue import Queue
from flora_node.FloraNode import FloraNode
from Sensors import Sensors     # type: ignore
from ws import WSClient
import threading
from time import sleep
from irrigation_system.IrrigationSubsystem import IrrigationSubsystem
from query.create_notification import create_notification


class IrrigationSystem(FloraNode):
    """
        Higher level irrigation and moisture monitoring subsystem API.
        Monitors moisture sensors and controls water pumps to ...
    """

    def __init__(self: "IrrigationSystem", task_queue: "Queue[Any]", sensors: Sensors, ws: "WSClient", deviceID: str, name: Union[str, None] = None) -> None:
        """
            Initializes the Irrigation System.
            :param task_queue: Queue[Any], queue of tasks for worker thread to process.
            :param name: Union[str, None], this IrrigationSystem's name (used in logging).
            >>> irrigation = IrrigationSystem()
            >>> irrigation.run()
        """
        super().__init__(task_queue, sensors, ws, name)

        self.deviceID = deviceID

        self.plantsMonitors = []
        for i in range(2):
            self.plantsMonitors.append(IrrigationSubsystem(i, sensors, list(User.select())[0].email, self.deviceID, True))

    def worker(self: "IrrigationSystem") -> None:
        """
            The Irrigation System's worker thread. Processes incoming tasks in
            the task queue...
        """
        while True:
            self.process_queue()

    def process_queue(self: "IrrigationSystem") -> None:
        msg = self.task_queue.get()
        self.logger.debug(f"Got {msg}")

        client_msg = msg["payload"]
        topic = client_msg["topic"]

        if topic == "pump-override-topic":
            self.activate_pump()

    def activate_pump(self: "IrrigationSystem") -> None:
        if self.sensors.get_water_level() < 0.5:
            self.logger.debug("Insufficient water")
            return

        try:
            plant = Plant.get(Plant.plantID == self.sensors.get_selected_plant_id())
        except Exception as e:
            self.logger.debug(f"No plants registered: {e}")
            return None

        self.sensors.turn_on_pump(plant.registeredChannel)
        sleep(0.5)
        self.sensors.turn_off_pump(plant.registeredChannel)

        type = "WATER_EVENT"
        create_notification({
            "label": type,
            "type": type,
            "plantID": plant.plantID,
            "deviceID": self.deviceID
        })

    def run(self: "IrrigationSystem") -> None:
        super().run()
        for plantMonitor in self.plantsMonitors:
            plantThread = threading.Thread(target=plantMonitor.main, daemon=True)

            self.logger.debug("Started monitoring plant thread")
            plantThread.start()

    def main(self: "IrrigationSystem") -> None:
        pass

    def test_function(self: "IrrigationSystem") -> str:
        """
            A test function to test testing.
            :returns: str, the test output "test".
        """
        self.logger.debug("Test function works")
        return "test"
