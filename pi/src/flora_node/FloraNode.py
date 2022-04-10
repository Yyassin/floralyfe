"""
FloraNode.py
====================
Abstract Floralyfe Node Instance
"""

__author__ = "yousef"

from abc import abstractmethod
import threading
from time import sleep
from typing import Any, Union, Dict
from queue import Queue
from Sensors import Sensors     # type: ignore
from ws import WSClient
from util.Logger import Logger
from util.Singleton import Singleton


class FloraNode(Singleton):
    """
        Defines the general interface of a Floralyfe SubSystem Controller
        or Node instance.

        Each node has at least two threads: a worker and a main thread.
        The worker listens to external requests while the main thread
        executes the node's tasks.

        A FloraNode should not be instantiated directly.
    """

    def __init__(self: "FloraNode", task_queue: "Queue[Any]", sensors: Sensors, ws: "WSClient", name: Union[str, None] = None) -> None:
        """
            Initializes the Floralyfe Node.

            :param task_queue: Queue[Any], queue of tasks for worker thread to process.
            :param name: Union[str, None], this CameraSystem's name (used in logging).

            >>> In another class' __init__...
            >>> super().__init__(task_queue, name)
        """
        self.task_queue = task_queue
        self.sensors = sensors
        self.ws = ws
        #  If no name is provided, use the derived class' name
        self.name = name if name is not None else type(self).__name__
        self.logger = Logger(self.name)
        # Socket listener
        self.worker_thread = threading.Thread(
            name=f"{self.name}-worker-thread",
            target=self.worker,
            daemon=True
        )
        # Main Thread
        self.main_thread = threading.Thread(
            name=f"{self.name}-main-thread",
            target=self.main,
            daemon=True
        )

    @abstractmethod
    def worker(self: "FloraNode") -> None:
        """
            The node's worker thread. Processes incoming tasks in
            the task queue...
        """
        while True:
            self.logger.debug(f"Got {self.task_queue.get()}")

    @abstractmethod
    def main(self: "FloraNode") -> None:
        """
            The node's main thread. Processes primary
            tasks such as periodic or feedback loops.
        """
        while True:
            self.logger.debug("Running main.")
            sleep(1)

    def send(self: "FloraNode", msg: Dict[Any, Any], topic: str) -> None:
        self.ws.send(msg, topic)

    def run(self: "FloraNode") -> None:
        """
            Starts this node's threads.
        """
        self.worker_thread.start()
        self.main_thread.start()

    def join(self: "FloraNode") -> None:
        """
            Joins this node's threads.
        """
        self.worker_thread.join()
        self.main_thread.join()
