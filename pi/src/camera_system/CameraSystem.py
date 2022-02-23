import threading
from time import sleep
from typing import Any
from queue import Empty, Queue


class CameraSystem:
    def __init__(self: "CameraSystem", task_queue: Queue[Any]) -> None:
        self.task_queue = task_queue
        # Socket listener
        self.worker_thread = threading.Thread(
            name="worker-thread",
            target=self.worker,
            daemon=True
        )
        self.main_thread = None             # Anything else this node does

    def worker(self) -> None:
        while True:
            try:
                print("CameraSystem: got", self.task_queue.get_nowait())
            except Empty:
                print("CameraSystem: The task queue is empty.")
            sleep(1)

    def run(self) -> None:
        self.worker_thread.start()

    def join(self) -> None:
        self.worker_thread.join()
