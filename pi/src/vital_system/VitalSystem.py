"""
CameraSystem.py
====================
Camera Monitoring Subsystem Controller API
"""

__author__ = "yousef"

from typing import Any, Union
from queue import Queue
from flora_node.FloraNode import FloraNode


class VitalSystem(FloraNode):
    """
        Higher level camera monitoring subsystem API. Controls
        the RPi camera and servo to...
    """

    def __init__(self: "VitalSystem", task_queue: "Queue[Any]", name: Union[str, None] = None) -> None:
        """
            Initializes the Camera System.

            :param task_queue: Queue[Any], queue of tasks for worker thread to process.
            :param name: Union[str, None], this CameraSystem's name (used in logging).

            >>> camera = CameraSystem()
            >>> camera.run()
        """
        super().__init__(task_queue, name)

    def worker(self: "VitalSystem") -> None:
        """
            The Camera System's worker thread. Processes incoming tasks in
            the task queue...
        """
        while True:
            msg = self.task_queue.get()
            self.logger.debug(f"Got {msg}")
            self.logger.warn(f"Setting SenseHat to {msg['payload']['icon']}")

    def main(self: "VitalSystem") -> None:
        pass

    def test_function(self: "VitalSystem") -> str:
        """
            A test function to test testing.
            :returns: str, the test output "test".
        """
        self.logger.debug("Test function works")
        return "test"
