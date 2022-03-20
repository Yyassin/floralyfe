from tkgpio import TkCircuit
from time import sleep
from Irregation_Subsytem import IrregationSubsystem

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
    ]
}

circuit = TkCircuit(configuration)


@circuit.run  # type: ignore
def main() -> None:
    irregation = IrregationSubsystem(8, 9, 21, 22, 0.5)

    while True:
        irregation.execute()
        sleep(0.1)


if __name__ == "__main__":
    main()
