import threading
from time import sleep
from typing import Any
from queue import Empty, Queue
from util import Logger


class FloraNode:
    def __init__(self: "FloraNode", task_queue: Queue[Any], name: str = None) -> None:
        self.task_queue = task_queue
        self.name = name if name is not None else type(self).__name__
        self.logger = Logger.Logger(self.name)
        # Socket listener
        self.worker_thread = threading.Thread(
            name=f"{self.name}-worker-thread",
            target=self.worker,
            daemon=True
        )
        self.main_thread = None             # Anything else this node does

    def worker(self) -> None:
        while True:
            try:
                self.logger.debug(f"Got {self.task_queue.get_nowait()}")
            except Empty:
                self.logger.debug("The task queue is empty.")
            sleep(1)

    def run(self) -> None:
        self.worker_thread.start()

    def join(self) -> None:
        self.worker_thread.join()
