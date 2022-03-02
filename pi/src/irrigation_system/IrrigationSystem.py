"""
IrrigationSystem.py
====================
Irrigation Subsystem Controller API
"""

__author__ = 'yousef'

from typing import Any, Union
from queue import Queue
from flora_node.FloraNode import FloraNode


class IrrigationSystem(FloraNode):
    """
        Higher level irrigation and moisture monitoring subsystem API.
        Monitors moisture sensors and controls water pumps to ...
    """

    def __init__(self: "IrrigationSystem", task_queue: "Queue[Any]", name: Union[str, None] = None) -> None:
        """
            Initializes the Irrigation System.

            :param task_queue: Queue[Any], queue of tasks for worker thread to process.
            :param name: Union[str, None], this IrrigationSystem's name (used in logging).

            >>> irrigation = IrrigationSystem()
            >>> irrigation.run()
        """
        super().__init__(task_queue, name)

    def worker(self: "IrrigationSystem") -> None:
        """
            The Irrigation System's worker thread. Processes incoming tasks in
            the task queue...
        """
        while True:
            self.logger.debug(f"@Override: Got {self.task_queue.get()}")

    def main(self: "IrrigationSystem") -> None:
        pass

    def test_function(self: "IrrigationSystem") -> str:
        """
            A test function to test testing.
            :returns: str, the test output "test".
        """
        self.logger.debug("Test function works")
        return "test"
