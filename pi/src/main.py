"""
main.py
========
Application main entrypoint. Initializes and starts nodes.
"""

__author__ = "yousef"

import sys
from typing import Any
from queue import Queue
from camera_system import CameraSystem
from irrigation_system import IrrigationSystem
from ws import WSReceiver


def main() -> None:
    DEVICE_ID = "hello"                             # placeholder, subscribe to messages sent to "hello"
    SOCKET = "ws://localhost:5000"
    # Creates shared worker queues
    camera_task_queue = Queue()             # type: Queue[Any]
    irrigation_task_queue = Queue()         # type: Queue[Any]

    # Map each queue to the topic it's listening to
    # TODO: think about listening to multiple topics, multiple queues for one topic
    queues = {
        "camera-topic": camera_task_queue,
        "irrigation-topic": irrigation_task_queue
    }

    # Instantiate modules
    camera_system = CameraSystem.CameraSystem(camera_task_queue)                    # Camera Monitoring Subsystem
    irrigation_system = IrrigationSystem.IrrigationSystem(irrigation_task_queue)    # Irrigation Subsystem
    ws_receiver = WSReceiver(queues, SOCKET, DEVICE_ID)                                                # WebSocket Receiver

    # Start the system nodes
    try:
        camera_system.run()
        irrigation_system.run()
        ws_receiver.run()

        print("Press Ctrl+C to terminate...")
        input()                                 # Pause the main thread
    except (KeyboardInterrupt, SystemExit):
        # cleanup here
        sys.exit()


if __name__ == "__main__":
    main()
