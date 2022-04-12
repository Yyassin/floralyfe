"""
main.py
========
Application main entrypoint. Initializes and
starts all system nodes.
"""

__author__ = "yousef"

import sys
import uuid
import time
from typing import Any, Tuple
from queue import Queue
from Sensors import Sensors  # type: ignore
from camera_system import CameraSystem
from irrigation_system import IrrigationSystem
from query.user_query import login, update_user
from vital_system import VitalSystem
from ws import WSClient
import config.config as config
from database import db, User, Photos, Plant, Device

# Database models
MODELS = (User, Photos, Plant, Device)


def login_prompt() -> Tuple[str, str, str]:
    """
    Prompts the user to login with a stored account or with a new one.
    If new, binds the user's devices to their cloud account.

    Returns a tuple with the user's id, this device's id and the user's email.
    """
    users = list(User.select())
    print(users)

    command = ""

    # Prompt the user if they'd like to login with an existing account stored on the device.
    if len(users) > 0:
        user = users[0]
        command = input(f"Found logged in user {user.email}. Would you like to reset? (Y/N)")

        if command == "N":
            return user.userID, user.deviceID, user.email

    # Otherwise, prompt them for login credentials and fetch their user.
    user = None
    while user is None:
        email = input("Please enter your account email: ")
        password = input("Please enter your account password: ")
        query_response = login(email, password)

        user = query_response["users"]
        if user is None:
            print("Incorrect email or password, please try again.")

    print(f"Successful login, welcome {user['firstName']}")

    # Make a new deviceID if there isn't one.
    deviceID = user["deviceID"]
    if deviceID is None:
        deviceID = str(uuid.uuid4())

    # Store the credentials in the database.
    print(deviceID)
    update_user({"id": user["id"], "deviceID": deviceID})
    db.drop_tables(MODELS)
    db.create_tables([User, Photos, Plant, Device])

    User.create(userID=user["id"], email=user["email"], password=user["password"], deviceID=deviceID)

    print("Successfully registered device. Refresh the client.")
    return user["id"], deviceID, user["email"]


def main() -> None:
    """
    Floralyfe RPi main entrypoint. Authenticates the user,
    initializes all system nodes and starts them.
    """

    # Setup the local database and login
    db.connect()
    db.create_tables([User, Photos, Plant, Device])
    subscription_id, device_id, email = login_prompt()

    # Creates shared worker (subscription) queues
    camera_task_queue = Queue()             # type: Queue[Any]
    irrigation_task_queue = Queue()         # type: Queue[Any]
    vitals_task_queue = Queue()             # type: Queue[Any]

    # Map each queue to the topic it's listening to
    queues = {
        "camera-topic": camera_task_queue,
        "irrigation-topic": irrigation_task_queue,
        "vitals-topic": vitals_task_queue
    }

    # Instantiate modules
    sensors = Sensors(True)
    ws = WSClient(queues, config.WS_URL, subscription_id, device_id)                                            # WebSocket Client
    camera_system = CameraSystem.CameraSystem(camera_task_queue, sensors, ws)                                   # Camera Monitoring Subsystem
    irrigation_system = IrrigationSystem.IrrigationSystem(irrigation_task_queue, sensors, ws, device_id)        # Irrigation Subsystem
    vital_system = VitalSystem.VitalSystem(vitals_task_queue, sensors, ws, device_id, email)                    # Vital Subsystem

    # Start the system nodes (threads)
    try:
        ws.run()
        time.sleep(5)                               # Wait a bit to ensure successful websocket connection.
        camera_system.run()
        irrigation_system.run()
        vital_system.run()

        print("Press Ctrl+C to terminate...")
        input()                                     # Pause the main thread (to persist all daemons)

    except (KeyboardInterrupt, SystemExit):
        print("Cleanup. Exiting..")
        sensors.cleanup()
        sys.exit()                                  # Daemon threads will terminate with main


if __name__ == "__main__":
    main()
