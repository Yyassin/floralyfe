"""
test_irrigation_software.py
=========================
Excercises and validates the Irrigation
state machine.
"""

__author__ = "abdalla"

from irrigation_system.Irrigation_Subsystem import IrregationSubsystem, IrregationStates
from gpiozero import LED
from tkgpio import TkCircuit

configuration = {
    "width": 500,
    "height": 400,
    "leds": [
        {"x": 100, "y": 40, "name": "Water Pump", "pin": 21},
        {"x": 300, "y": 40, "name": "Email sent", "pin": 22},
        {"x": 100, "y": 140, "name": "Moisture Sensor", "pin": 8},
        {"x": 300, "y": 140, "name": "Water Sensor", "pin": 9}
    ]
}

circuit = TkCircuit(configuration)


def test_irregation_software() -> None:
    moisture_sensor = LED(8)
    water_sensor = LED(9)
    pump = LED(21)
    notify = LED(22)

    irregation = IrregationSubsystem(moisture_sensor, water_sensor, pump, notify, 0.5)

    assert irregation.getState() == IrregationStates.IDLE

    irregation.execute()
    assert irregation.getState() == IrregationStates.CHECK_MOISTURE

    moisture_sensor.toggle()
    irregation.execute()
    assert irregation.getState() == IrregationStates.IDLE

    irregation.execute()
    assert irregation.getState() == IrregationStates.CHECK_MOISTURE

    moisture_sensor.toggle()
    irregation.execute()
    assert irregation.getState() == IrregationStates.CHECK_WATER_LEVEL

    water_sensor.toggle()
    irregation.execute()
    assert irregation.getState() == IrregationStates.WATER_PLANT

    irregation.execute()
    assert irregation.getState() == IrregationStates.WAIT

    irregation.execute()
    assert irregation.getState() == IrregationStates.CHECK_MOISTURE

    irregation.execute()
    assert irregation.getState() == IrregationStates.CHECK_WATER_LEVEL

    water_sensor.toggle()
    irregation.execute()
    assert irregation.getState() == IrregationStates.NOTIFY_USER

    irregation.execute()
    assert irregation.getState() == IrregationStates.IDLE

    print("Test Passed")


if __name__ == "__main__":
    test_irregation_software()
