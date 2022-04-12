"""
test_ws_client.py
==================
Tests that the WebSocket client can receive
and route messages to the correct queue.
"""

__author__ = "yousef"

from ws import WSClient
from typing import Any
from queue import Queue
from deepdiff import DeepDiff
from util.Logger import Logger

logger = Logger("test_ws_receiver")


def test_ws_receiver() -> None:
    """Receiver :: Test Function - Receiver Processes Messages and Routes to Correct client"""
    camera_task_queue = Queue()             # type: Queue[Any]
    irrigation_task_queue = Queue()         # type: Queue[Any]
    vitals_task_queue = Queue()             # type: Queue[Any]

    queues = {
        "camera-topic": camera_task_queue,
        "irrigation-topic": irrigation_task_queue,
        "vitals-topic": vitals_task_queue
    }

    ws = WSClient(queues, "", "", "")

    message = {
        "topic": "random-topic",
        "payload": {
            "field": "things",
            "field2": 1
        }
    }

    ws.process_message(message)               # WebSocket Receiver
    logger.debug(f"Sent message {message}")
    logger.debug("Should be received by no clients")

    for topic, queue in queues.items():
        logger.debug(f"{topic} queue: {queue.queue}")
        assert queue.empty

    message = {
        "topic": "camera-topic",
        "payload": {
            "field": "things",
            "field2": 1
        }
    }

    ws.process_message(message)               # WebSocket Receiver
    logger.debug(f"Sent message {message}")
    logger.debug("Should be received by camera client")

    for topic, queue in queues.items():
        logger.debug(f"{topic} queue: {queue.queue}")

    assert len(queues["camera-topic"].queue) != 0

    diff = DeepDiff(queues["camera-topic"].get(), message)
    assert not diff
