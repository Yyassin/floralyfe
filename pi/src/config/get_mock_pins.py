from typing import Any, Dict
from gpiozero import Device
from gpiozero.pins.mock import MockFactory

BLACK = [0, 0, 0]


class SenseHat():
    def __init__(self: "SenseHat") -> None:
        self.PIXELS = 64
        self.matrix = [BLACK] * self.PIXELS

    def get_temperature(self: "SenseHat") -> float:
        return 35.15

    def get_humidity(self: "SenseHat") -> float:
        return 22.42

    def get_pixels(self: "SenseHat") -> list[list[int]]:
        return self.matrix

    def set_pixels(self: "SenseHat", pixels: list[list[int]]) -> None:
        self.matrix = pixels

    def clear(self: "SenseHat") -> None:
        self.matrix = [BLACK] * self.PIXELS


class PiCamera():
    def __init__(self: "PiCamera") -> None:
        self.is_closed = False
        self.open = True

    def capture(self: "PiCamera", frame: Any, colour_encoding: str) -> None:
        frame[:] = (255,) * 3

    def close(self: "PiCamera") -> None:
        self.is_closed = True

    def closed(self: "PiCamera") -> bool:
        return self.is_closed


gpios: list[Any] = []


class AnalogPin:
    def __init__(self: "AnalogPin", pin: int) -> None:
        self.value = 0.0
        self.pin = pin

    def close(self: "AnalogPin") -> None:
        pass


class DigitalPin:
    def __init__(self: "DigitalPin", pin: int) -> None:
        self.state = False
        self.pin = pin

    def on(self: "DigitalPin") -> None:
        self.state = True

    def off(self: "DigitalPin") -> None:
        self.state = False

    def close(self: "DigitalPin") -> None:
        pass


class Servo:
    def __init__(self: "Servo", pin: int) -> None:
        self.angle = 0.0
        self.pin = pin

    def set_angle(self: "Servo", angle: float) -> None:
        self.angle = angle

    def close(self: "Servo") -> None:
        pass


def get_mock_pins() -> Dict[str, Any]:
    global gpios
    Device.pin_factory = MockFactory()
    mock_factory = Device.pin_factory

    mock_pins = [13, 27, 20, 9, 11, 12]
    mock_gpios = []
    for pin in mock_pins:
        mock_gpios.append(mock_factory.pin(pin))

    sense = SenseHat()
    camera = PiCamera()
    servo = Servo(13)
    pin27 = AnalogPin(27)
    pin20 = AnalogPin(20)
    pin9 = DigitalPin(9)
    pin11 = AnalogPin(11)
    pin12 = DigitalPin(12)
    gpios = [pin27, pin20, pin9, pin11, pin12, servo, camera]

    pins = {
        "sense_hat": sense,
        "servo": servo,
        "camera": camera,
        "water_level": pin27,
        "channel_1": {
            "moisture": pin20,
            "pump": pin9
        },
        "channel_2": {
            "moisture": pin11,
            "pump": pin12
        }
    }
    return pins
