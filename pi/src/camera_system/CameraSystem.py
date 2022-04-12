"""
CameraSystem.py
====================
Camera Monitoring Subsystem Controller API

Periodically takes pictures and transmits them to
create a live image feed. Controls servo to orient camera
and periodically takes pictures of each registered plant
to form a timelapse.
"""

__author__ = "yousef & zak"

from database import Plant
from typing import Any, Union, Dict
from queue import Queue
from flora_node.FloraNode import FloraNode
from Sensors import Sensors     # type: ignore
from ws import WSClient
import cv2 as cv
from camera_system.camera_util import image_buffer
from camera_system.camera_util import PI_capture, WIN_capture
from util.util import IS_RPI
import time
import threading
import schedule
import os

CAMERA_TOPIC = "camera-topic"
plantIns = Plant()


class CameraSystem(FloraNode):
    """
        Higher level camera monitoring subsystem API. Controls
        the RPi camera and servo to serve live image feed, orient
        the camera and create a plant timelapse.
    """

    def __init__(self: "CameraSystem", task_queue: "Queue[Any]", sensors: Sensors, ws: WSClient, name: Union[str, None] = None) -> None:
        """
            Initializes the Camera System.

            :param task_queue: Queue[Any], queue of tasks for worker thread to process.
            :param sensors: Sensors, the sensor interface.
            :param ws: WSClient, the WebSocket client.
            :param name: Union[str, None], this CameraSystem's name (used in logging).

            >>> camera = CameraSystem()
            >>> camera.run()
        """
        super().__init__(task_queue, sensors, ws, name)
        self.camera_on = True
        self.cam = self.sensors.camera

    def worker(self: "CameraSystem") -> None:
        """
            The Camera System's worker thread. Processes incoming tasks in
            the task queue to respond to client requests.
        """
        while True:
            # Block until a message is received.
            msg = self.task_queue.get()

            # Destructure the payload and topic.
            payload = msg["payload"]
            topic = payload["topic"]

            if (topic == "register-plant"):
                # A plant was registered, store in database.
                self.register_plant(payload)
            elif (topic == "camera-stream-on"):
                # Toggle the camera stream on.
                self.camera_on = True
            elif (topic == "camera-stream-off"):
                # Toggle the camera stream off.
                self.camera_on = False
            elif (topic == "servo-turn-angle"):
                # Turn the servo to a specific angle, only if not
                # taking timelapse photos.
                if self.camera_on:
                    self.sensors.turn_servo(payload["angle"])
                    self.logger.debug(f"Turning to {payload['angle']}")
            elif (topic == "servo-turn-plant"):
                # Turn to the plant with the specified id -- isn't used right now.
                if self.camera_on:
                    self.turn_to_plant(payload["plantID"])
            elif (topic == "take-pictures"):
                # Take timelapse photos of each registered plant.
                self.capture_each_plant()

            # self.logger.debug(f"{self.camera_on}")
            self.logger.debug(f"Got {msg}")

    def register_plant(self: "CameraSystem", plant_info: Dict[str, Any]) -> None:
        """
        Registers a plant with the specified information and persists
        it in the local database.

        :param plant_info: Dict[str, Any], the plant info.
        """
        self.logger.debug("Create plant")
        plant_info["optima"]["airHumidity"] = plant_info["optima"]["humidity"]
        del plant_info["optima"]["humidity"]

        # Make sure we're not overriding an existing plant.
        plants = Plant.select().where(Plant.plantID == plant_info["id"])
        if (len(list(plants)) > 0):
            return

        Plant.create(plantID=plant_info["id"],
                     optima=plant_info["optima"],
                     angle=plant_info["cameraAngle"],
                     registeredChannel=plant_info["channel"])

    def capture_each_plant(self: "CameraSystem") -> None:
        """
        Scheduled task that captures an image of
        each registered plant in the system.
        """
        # now = datetime.datetime.now().isoformat()

        initial_angle = self.sensors.servo.angle
        self.camera_on = False

        # Turn to each plant
        for plant in Plant.select():
            angle = plant.angle
            self.sensors.turn_servo(angle)
            time.sleep(5)

            self.logger.debug(f"Photo of {plant.plantID} @ {angle}")

            # After waiting, grab the plant image from the shared buffer.
            data = image_buffer[0]

            date = time.strftime("%Y-%b-%d_(%H%M%S)")

            # And save it to the timelapse directory.
            current_directory = os.getcwd()
            final_directory = os.path.join(current_directory, f'''timelapse/{plant.plantID}/''')
            if not os.path.exists(final_directory):
                os.makedirs(final_directory)

            cv.imwrite(f"{final_directory}{date}.png", data)

        # Turn the servo back to its original heading.
        self.sensors.turn_servo(initial_angle)
        self.camera_on = True

    def start_camera_stream(self: "CameraSystem") -> None:
        """
        Opens a video feed and sends an encoded frame
        over a WebSocket connection every second.
        The frame pertains to user with id userID (above).
        """
        while (True):
            # if not self.camera_on:
            #     time.sleep(1)
            #     continue

            data = PI_capture(self.cam) if IS_RPI else WIN_capture(self.cam)
            byte_data = data[1]                                              # Extract byte array
            msg = {                                                          # Create the socket message
                "payload": {
                    "encoded": byte_data.decode("ascii")
                }
            }

            # print(msg)
            # self.logger.debug("Sent Image Frame")

            self.send(msg, CAMERA_TOPIC)                          # Create json from msg dictionary and send it
            time.sleep(0.25)

            if 0xFF == ord('q'):
                break

    def turn_to_plant(self: "CameraSystem", plant_id: str) -> None:
        """
        Turns the camera and servo to the plant with the
        specified plant id.
        """
        plant = Plant.get(Plant.plantID == plant_id)
        self.sensors.set_selected_plant(plant_id, plant.registeredChannel)
        # self.sensors.turn_servo(plant.angle)
        print(f"Turned to {plant.angle}")

    def main(self: "CameraSystem") -> None:
        """
        Camera monitoring system main thread. Schedules
        the timelapse photo event.
        """
        while True:
            schedule.run_pending()
            time.sleep(1)

    def run(self: "CameraSystem") -> None:
        """
        Initializes and starts the camera monitoring system.
        """
        # Start the main and worker threads.
        super().run()

        # Start the live stream thread.
        self.camera_stream_thread = threading.Thread(target=self.start_camera_stream, daemon=True)
        self.camera_stream_thread.start()

        # Capture plant timelapse every three minutes.
        schedule.every(3).minutes.do(self.capture_each_plant)

    def test_function(self: "CameraSystem") -> str:
        """
            A test function to test testing.
            :returns: str, the test output "test".
        """
        self.logger.debug("Test function works")
        return "test"

    def cleanup(self: "CameraSystem") -> None:
        """
        Cleans up camera monitoring resources (camera connection).
        """
        cv.destroyAllWindows()
        self.cam.close() if IS_RPI else self.cam.release()
