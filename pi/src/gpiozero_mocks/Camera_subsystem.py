"""
Camera_subsystem.py
=========================
Graphical tkinter simulation
of the camera monitoring subsystem.
"""

__author__ = "zakariyya"

from typing import Any
from enum import Enum
from time import sleep
from gpiozero.pins.mock import MockFactory

class CameraStates(Enum):
    IDLE = 1
    LISTEN_WEBSOCKET = 2
    VIEW_PLANT = 3
    STREAM = 4
    DAY_TIMER = 5


class CameraSubsystem():

    factory = MockFactory()
    EPSILON = 1e-3
    MAX_ANGLE = 180
    MIN_ANGLE = 90

    def __init__(self, servo: Any, socket: Any, angle: Any, livestream: Any, picPlants: Any, picTest: Any) -> None:
        self.servo = servo
        self.socket = socket
        self.angle = angle
        self.livestream = livestream
        self.picPlants = picPlants

        self.state = CameraStates.IDLE

    def getState(self) -> CameraStates:
        return self.state

    def setState_IDLE(self) -> None:
        self.state = CameraStates.IDLE

    def idle(self) -> None:
        print("[state] IDLE")
        sleep(2)
        if self.socket.value == 1:
            self.state = CameraStates.LISTEN_WEBSOCKET

    def listen_websocket(self) -> None:
        print("[state] LISTEN_WEBSOCKET")
        if self.angle.value > -1:
            self.state = CameraStates.VIEW_PLANT
            sleep(2)
        else:
            self.setState_IDLE()

    def view_plant(self) -> None:
        print('[state] VIEW_PLANT')
        self.servo.angle = self.angle.value * 180 - 90
        print("Turning Servo to", self.servo.angle)
        print("Turning Servo to", self.angle.value * 180 - 90)
        self.state = CameraStates.STREAM
        assert abs(self.servo.angle - (self.angle.value * 180 - 90)) < self.EPSILON
        self.livestream.toggle()

    def stream(self) -> None:
        print('[state] STREAM')
        sleep(2)
        self.livestream.toggle()
        if self.picPlants is False:
            self.state = CameraStates.IDLE
        else:
            self.state = CameraStates.DAY_TIMER

    def day_timer(self) -> None:
        print('[state] DAY_TIMER')
        self.picPlants.toggle()
        self.servo.angle = 90
        sleep(0.5)
        self.servo.angle = -90
        sleep(1)
        self.picPlants.toggle()
        self.state = CameraStates.IDLE

    def execute(self) -> None:
        StateOperation = {
            CameraStates.IDLE: self.idle,
            CameraStates.LISTEN_WEBSOCKET: self.listen_websocket,
            CameraStates.VIEW_PLANT: self.view_plant,
            CameraStates.STREAM: self.stream,
            CameraStates.DAY_TIMER: self.day_timer
        }

        StateOperation.get(self.state, self.setState_IDLE)()
