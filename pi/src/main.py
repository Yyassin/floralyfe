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
    SOCKET = "ws://6d0b-174-112-246-246.ngrok.io"
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

        assert ws_receiver.wss_thread is not None
        while ws_receiver.wss_thread.is_alive():        # Exits when socket fails. Probably not great, hacky.
            ws_receiver.wss_thread.join(1)              # We're looping so we can interrupt and exit main (join blocks)
    except (KeyboardInterrupt, SystemExit):
        # cleanup here
        sys.exit()


if __name__ == "__main__":
    main()
