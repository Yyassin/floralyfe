"""
main.py
========
Application main entrypoint. Initializes and starts nodes.
"""

__author__ = "yousef"

import sys
from typing import Any
from queue import Queue
from Sensors import Sensors
# from util.util import IS_RPI
# if IS_RPI:
#     from sense_hat import SenseHat
#     from picamera import PiCamera
# from gpiozero import DigitalOutputDevice, GPIODevice, Servo

from camera_system import CameraSystem
from irrigation_system import IrrigationSystem
from vital_system import VitalSystem
from ws import WSReceiver
import config.config as config
import config.io_config as io


def main() -> None:
    TEST = True
    # Creates shared worker queues
    camera_task_queue = Queue()             # type: Queue[Any]
    irrigation_task_queue = Queue()         # type: Queue[Any]
    vitals_task_queue = Queue()             # type: Queue[Any]

    # Map each queue to the topic it's listening to
    # TODO: think about listening to multiple topics, multiple queues for one topic
    queues = {
        "camera-topic": camera_task_queue,
        "irrigation-topic": irrigation_task_queue,
        "vitals-topic": vitals_task_queue
    }

    # Instantiate modules
    sensors = Sensors(io.pins)
    camera_system = CameraSystem.CameraSystem(camera_task_queue, sensors)                    # Camera Monitoring Subsystem
    irrigation_system = IrrigationSystem.IrrigationSystem(irrigation_task_queue, sensors)    # Irrigation Subsystem
    vital_system = VitalSystem.VitalSystem(vitals_task_queue, sensors)                       # Irrigation Subsystem
    ws_receiver = WSReceiver(queues, config.WS_URL, config.USER_ID, TEST)                    # WebSocket Receiver

    # Start the system nodes
    try:
        camera_system.run()
        irrigation_system.run()
        vital_system.run()
        ws_receiver.run()

        print("Press Ctrl+C to terminate...")
        input()                                 # Pause the main thread
    except (KeyboardInterrupt, SystemExit):
        # cleanup here
        sys.exit()


if __name__ == "__main__":
    main()
