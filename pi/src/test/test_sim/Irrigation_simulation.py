"""
Irrigation_simulation.py
=========================
Graphical tkinter simulation
of the irrigation subsystem.
"""

__author__ = "abdalla"

from tkgpio import TkCircuit
from time import sleep
from irrigation_system.Irrigation_Subsystem import IrregationSubsystem
from gpiozero import LED, LightSensor, Button

configuration = {
    "width": 500,
    "height": 400,
    "leds": [
        {"x": 100, "y": 40, "name": "Water Pump", "pin": 21},
        {"x": 300, "y": 40, "name": "Email sent", "pin": 22}
    ],

    "light_sensors": [
        {"x": 100, "y": 140, "name": "Moisture Sensor", "pin": 8},
        {"x": 300, "y": 140, "name": "Water Sensor", "pin": 9}
    ],

    "buttons": [
        {"x": 400, "y": 40, "name": "Turn Pump", "pin": 11},
    ]
}

circuit = TkCircuit(configuration)


@circuit.run        # type: ignore
def main() -> None:
    moisture_sensor = LightSensor(8)
    water_sensor = LightSensor(9)
    pump = LED(21)
    notify = LED(22)

    irregation = IrregationSubsystem(moisture_sensor, water_sensor, pump, notify, 0.5, True)

    def button_pressed() -> None:
        irregation.Override_pump()

    button = Button(11)
    button.when_pressed = button_pressed

    while True:
        irregation.execute()
        sleep(0.1)


# if __name__ == "__main__":
#    main()
