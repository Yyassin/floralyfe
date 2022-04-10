"""
main.py
========
Application main entrypoint. Initializes and starts nodes.
"""

__author__ = "yousef"

import sys
from typing import Any
from queue import Queue
import uuid
from Sensors import Sensors     # type: ignore
from camera_system import CameraSystem
from irrigation_system import IrrigationSystem
from query.user_query import login, update_user
from vital_system import VitalSystem
from ws import WSClient
import config.config as config
import time
from database import db, User, Photos, Plant, Device

MODELS = (User, Photos, Plant, Device)


def login_prompt() -> tuple[str, str, str]:
    users = list(User.select())
    print(users)

    command = ""

    if len(users) > 0:
        user = users[0]
        command = input(f"Found logged in user {user.email}. Would you like to reset? (Y/N)")

        if command == "N":
            return user.userID, user.deviceID, user.email

    user = None
    while user is None:
        email = input("Please enter your account email: ")
        password = input("Please enter your account password: ")
        query_response = login(email, password)

        user = query_response["users"]
        if user is None:
            print("Incorrect email or password, please try again.")

    print(f"Successful login, welcome {user['firstName']}")

    deviceID = user["deviceID"]
    if deviceID is None:
        deviceID = str(uuid.uuid4())

    print(deviceID)
    update_user({"id": user["id"], "deviceID": deviceID})
    db.drop_tables(MODELS)
    db.create_tables([User, Photos, Plant, Device])

    User.create(userID=user["id"], email=user["email"], password=user["password"], deviceID=deviceID)

    print("Successfully registered device. Refresh the client.")
    return user["id"], deviceID, user["email"]


def main() -> None:
    db.connect()
    db.create_tables([User, Photos, Plant, Device])
    subscription_id, device_id, email = login_prompt()

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
    sensors = Sensors(True)
    ws = WSClient(queues, config.WS_URL, subscription_id, device_id)                                         # WebSocket Receiver
    camera_system = CameraSystem.CameraSystem(camera_task_queue, sensors, ws)                    # Camera Monitoring Subsystem
    irrigation_system = IrrigationSystem.IrrigationSystem(irrigation_task_queue, sensors, ws, device_id)    # Irrigation Subsystem
    vital_system = VitalSystem.VitalSystem(vitals_task_queue, sensors, ws, device_id, email)                       # Irrigation Subsystem

    # Start the system nodes
    try:
        ws.run()
        time.sleep(5)
        camera_system.run()
        irrigation_system.run()
        vital_system.run()

        print("Press Ctrl+C to terminate...")
        input()                                                                              # Pause the main thread
    except (KeyboardInterrupt, SystemExit):
        print("Cleanup. Exiting..")
        # cleanup here
        sensors.cleanup()
        sys.exit()


if __name__ == "__main__":
    main()
