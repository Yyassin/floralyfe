"""
test_camera_subsystem.py
=========================
Graphical tkinter simulation
of the camera monitoring subsystem.
"""

__author__ = "zakariyya"

from time import sleep
from Camera_subsystem import CameraSubsystem, CameraStates
from gpiozero import AngularServo, LED
from tkgpio import TkCircuit

configuration = {
    "width": 500,
    "height": 400,
    "leds": [
        {"x": 100, "y": 40, "name": "Socket Listner", "pin": 24},
        {"x": 300, "y": 40, "name": "LiveStream", "pin": 27},
        {"x": 100, "y": 140, "name": "Angle", "pin": 22},
        {"x": 200, "y": 20, "name": "Day Pictures", "pin": 6}
    ],

    "servos": [
        {"x": 200, "y": 300, "name": "Servomotor", "pin": 17, "min_angle": 90, "max_angle": 180, "initial_angle": 20}
    ]
}

circuit = TkCircuit(configuration)


def test_camera_subsystem() -> None:
    servo = AngularServo(17)
    socket = LED(24)
    angle = LED(22)
    livestream = LED(27)
    picPlants = LED(6)
    picTest = True

    camera = CameraSubsystem(servo, socket, angle, livestream, picPlants, picTest)

    assert camera.getState() == CameraStates.IDLE

    socket.toggle()

    camera.execute()
    assert camera.getState() == CameraStates.LISTEN_WEBSOCKET
    print("Web Socket Sends")

    angle.toggle()
    camera.execute()
    print("Get Angle from User")
    assert CameraStates.VIEW_PLANT

    camera.execute()
    livestream.toggle()
    assert camera.getState() == CameraStates.STREAM
    print("Turn Servo")
    print("Begin Livestream")
    sleep(2)
    livestream.toggle()

    camera.execute()
    print("Close Livestream")
    picPlants.toggle()
    print("Begin Taking Pics of all plants")
    sleep(0.5)
    picPlants.toggle()
    assert camera.getState() == CameraStates.DAY_TIMER

    camera.execute()
    assert camera.getState() == CameraStates.IDLE

    print("test passed")


if __name__ == "__main__":
    test_camera_subsystem()
