from typing import Any, List
# from gpiozero import Device
# from gpiozero.pins.mock import MockFactory

BLACK = [0, 0, 0]


class SenseHat():
    def __init__(self: "SenseHat") -> None:
        self.PIXELS = 64
        self.matrix = [BLACK] * self.PIXELS

    def get_temperature(self: "SenseHat") -> float:
        return 35.17

    def get_humidity(self: "SenseHat") -> float:
        return 22.42

    def get_pixels(self: "SenseHat") -> List[List[int]]:
        return self.matrix

    def set_pixels(self: "SenseHat", pixels: List[List[int]]) -> None:
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


class AngularServo:
    def __init__(self: "AngularServo", pin: int, min_angle: float, max_angle: float,
                 min_pulse_width: float, max_pulse_width: float, pin_factory: Any) -> None:
        self.angle = 0.0
        self.pin = pin

    def set_angle(self: "AngularServo", angle: float) -> None:
        self.angle = angle

    def close(self: "AngularServo") -> None:
        pass


class LED:
    def __init__(self: "LED", pin: int) -> None:
        self.state = False
        self.pin = pin

    def on(self: "LED") -> None:
        self.state = True

    def off(self: "LED") -> None:
        self.state = False

    def close(self: "LED") -> None:
        pass
