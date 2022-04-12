"""
get_mock_pins.py
=================
Defines mock interfaces
for primary hardware components.
"""


from typing import Any, List
# from gpiozero import Device
# from gpiozero.pins.mock import MockFactory

BLACK = [0, 0, 0]


class SenseHat():
    def __init__(self: "SenseHat") -> None:
        """Initializes mock sense hat"""
        self.PIXELS = 64
        self.matrix = [BLACK] * self.PIXELS

    def get_temperature(self: "SenseHat") -> float:
        """Returns temperature."""
        return 35.17

    def get_humidity(self: "SenseHat") -> float:
        """Returns humidity."""
        return 22.42

    def get_pixels(self: "SenseHat") -> List[List[int]]:
        """Returns pixel matrix rgb state"""
        return self.matrix

    def set_pixels(self: "SenseHat", pixels: List[List[int]]) -> None:
        """
        Sets the pixel matrix to the specified rgb matrix.

        :param pixels: List[List[int]], the matrix to set.
        """
        self.matrix = pixels

    def clear(self: "SenseHat") -> None:
        """Clears the sense hat matrix."""
        self.matrix = [BLACK] * self.PIXELS


class PiCamera():
    def __init__(self: "PiCamera") -> None:
        """Initializes a PiCamera."""
        self.is_closed = False
        self.open = True

    def capture(self: "PiCamera", frame: Any, colour_encoding: str) -> None:
        """Captures an image frame."""
        frame[:] = (255,) * 3

    def close(self: "PiCamera") -> None:
        """Closes the PiCamera."""
        self.is_closed = True

    def closed(self: "PiCamera") -> bool:
        """Returns true if the camera is closed. False otherwise."""
        return self.is_closed


class AngularServo:
    def __init__(self: "AngularServo", pin: int, min_angle: float, max_angle: float,
                 min_pulse_width: float, max_pulse_width: float, pin_factory: Any) -> None:
        """
        Initializes an Angular Servo.
        """
        self.angle = 0.0
        self.pin = pin

    def set_angle(self: "AngularServo", angle: float) -> None:
        """
        Sets the servo angle to the specified angle.

        :param angle: float, the angle to set the servo to.
        """
        self.angle = angle

    def close(self: "AngularServo") -> None:
        pass


# Used as GPIO control.
class LED:
    def __init__(self: "LED", pin: int) -> None:
        """Creates an LED."""
        self.state = False
        self.pin = pin

    def on(self: "LED") -> None:
        """Turns the LED on."""
        self.state = True

    def off(self: "LED") -> None:
        """Turns the LED off."""
        self.state = False

    def close(self: "LED") -> None:
        """Closes the LED."""
        pass
