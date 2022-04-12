"""
Camera_simulation.py
=========================
Graphical tkinter simulation
of the camera monitoring subsystem.
"""

__author__ = "zakariyya"


from tkgpio import TkCircuit
from time import sleep
from Camera_subsystem import CameraSubsystem
from gpiozero import AngularServo, LED, LightSensor, Button

configuration = {
    "width": 500,
    "height": 400,
    "leds": [
        {"x": 100, "y": 40, "name": "Socket", "pin": 24},
        {"x": 300, "y": 40, "name": "LiveStream", "pin": 27}
    ],

    "servos": [
        {"x": 200, "y": 300, "name": "Servomotor", "pin": 17, "min_angle": 90, "max_angle": 180, "initial_angle": 20}
    ],

    "light_sensors": [
        {"x": 200, "y": 150, "name": "Angle Selector", "pin": 9},
    ],

    "buttons": [
        {"x": 50, "y": 40, "name": "Press to toggle Socket", "pin": 11},
    ]
}

circuit = TkCircuit(configuration)


@circuit.run  # type: ignore
def main() -> None:
    servo = AngularServo(17)
    socket = LED(24)
    angle = LightSensor(9)
    livestream = LED(27)
    picPlants = LED(6)
    picPlants = False

    camera = CameraSubsystem(servo, socket, angle, livestream, picPlants, picPlants)

    def button_pressed() -> None:
        print("button pressed!")
        socket.toggle()

    button = Button(11)
    button.when_pressed = button_pressed

    while True:
        camera.execute()
        sleep(0.1)


if __name__ == "__main__":
    main()
