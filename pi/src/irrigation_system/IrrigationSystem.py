from time import sleep
from typing import Any
from queue import Empty, Queue
from flora_node.FloraNode import FloraNode


class IrrigationSystem(FloraNode):
    def __init__(self: "IrrigationSystem", task_queue: Queue[Any], name: str = None) -> None:
        super().__init__(task_queue, name)

    def worker(self) -> None:
        while True:
            try:
                self.logger.debug(f"@Override: Got {self.task_queue.get_nowait()}")
            except Empty:
                self.logger.debug("The task queue is empty.")
            sleep(1)

    def test_function(self) -> str:
        self.logger.debug("Test function works")
        return "test"
