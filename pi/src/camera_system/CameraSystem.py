"""
CameraSystem.py
====================
Camera Monitoring Subsystem Controller API
"""

__author__ = "yousef"

from database import Plant, Photos
from typing import Any, Union, Dict
from queue import Queue
from flora_node.FloraNode import FloraNode
from Sensors import Sensors
from ws import WSClient
import cv2 as cv
from camera_system.camera_util import PI_capture, WIN_capture
from util.util import IS_RPI
import time
import threading
import schedule
import datetime

if IS_RPI:
    from picamera import PiCamera

CAMERA_TOPIC = "camera-topic"
plantIns = Plant()


class CameraSystem(FloraNode):
    """
        Higher level camera monitoring subsystem API. Controls
        the RPi camera and servo to...
    """

    def __init__(self: "CameraSystem", task_queue: "Queue[Any]", sensors: Sensors, ws: WSClient, name: Union[str, None] = None) -> None:
        """
            Initializes the Camera System.

            :param task_queue: Queue[Any], queue of tasks for worker thread to process.
            :param name: Union[str, None], this CameraSystem's name (used in logging).

            >>> camera = CameraSystem()
            >>> camera.run()
        """
        super().__init__(task_queue, sensors, ws, name)
        self.camera_on = False
        self.cam = PiCamera() if IS_RPI else cv.VideoCapture(0)

    def worker(self: "CameraSystem") -> None:
        """
            The Camera System's worker thread. Processes incoming tasks in
            the task queue...
        """
        while True:
            msg = self.task_queue.get()
            payload = msg["payload"]
            topic = payload["topic"]

            if (topic == "register-plant"):
                self.register_plant(payload)
            elif (topic == "camera-stream-on"):
                self.camera_on = True
            elif (topic == "camera-stream-off"):
                self.camera_on = False
            elif (topic == "servo-turn-angle"):
                self.sensors.turn_servo(payload["angle"])
                self.logger.debug(f"Turning to {payload['angle']}")
            elif (topic == "servo-turn-plant"):
                self.turn_to_plant(payload["plantID"])

            self.logger.debug(f"{self.camera_on}")
            self.logger.debug(f"Got {msg}")

    def register_plant(self: "CameraSystem", plant_info: Dict[str, Any]) -> None:
        self.logger.debug("Create plant")
        Plant.create(plantID=plant_info["id"],
                     optima=plant_info["optima"],
                     angle=plant_info["angle"],
                     registeredChannel=plant_info["registeredChannel"])

    def capture_each_plant(self: "CameraSystem") -> None:
        now = datetime.datetime.now().isoformat()
        initial_camera_on = self.camera_on

        initial_angle = self.sensors.servo.angle
        self.camera_on = False

        for plant in Plant.select():
            angle = plant.angle
            self.sensors.turn_servo(angle)
            time.sleep(1)

            self.logger.debug(f"Photo of {plant.plantID} @ {angle}")

            # TODO: thread lock soon in PI capture probs
            pic = PI_capture(self.cam) if IS_RPI else WIN_capture(self.cam)
            byte_data = pic[1]
            Photos.create(photoID=now.__hash__(), picture=byte_data.decode("ascii"), plantID=plant.plantID, createdAt=now)

        self.sensors.turn_servo(initial_angle)
        self.camera_on = initial_camera_on

    def get_feed_timelapse(self: "CameraSystem", plantID: str) -> None:
        images = list(Photos.select().where(Photos.plantID == plantID))
        for image in images:
            print(image.picture)
        self.logger.debug(f"{images}")

    def start_camera_stream(self: "CameraSystem") -> None:
        """
        Opens a video feed and sends an encoded frame
        over a WebSocket connection every second.
        The frame pertains to user with id userID (above).
        """
        while (True):
            if not self.camera_on:
                time.sleep(1)
                continue

            data = PI_capture(self.cam) if IS_RPI else WIN_capture(self.cam)
            byte_data = data[1]                                              # Extract byte array
            msg = {                                                          # Create the socket message
                "payload": {
                    "encoded": byte_data.decode("ascii")
                }
            }

            # print(msg)
            self.logger.debug("Sent Image Frame")

            self.send(msg, CAMERA_TOPIC)                          # Create json from msg dictionary and send it
            time.sleep(1)

            if 0xFF == ord('q'):
                break

    def turn_to_plant(self: "CameraSystem", plant_id: str) -> None:
        plant = Plant.get(Plant.plantID == plant_id)
        self.sensors.turn_servo(plant.angle)
        print(f"Turned to {plant.angle}")

    def main(self: "CameraSystem") -> None:
        while True:
            schedule.run_pending()
            time.sleep(1)

    def run(self: "CameraSystem") -> None:
        super().run()
        self.camera_stream_thread = threading.Thread(target=self.start_camera_stream, daemon=True)
        self.camera_stream_thread.start()

        # schedule.every().minute.at(":15").do(self.capture_each_plant)
        self.get_feed_timelapse("plant-id")

    def test_function(self: "CameraSystem") -> str:
        """
            A test function to test testing.
            :returns: str, the test output "test".
        """
        self.logger.debug("Test function works")
        return "test"

    def cleanup(self: "CameraSystem") -> None:
        cv.destroyAllWindows()
        self.cam.release()               # Cleanup
