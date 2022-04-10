from gpiozero import AngularServo

from gpiozero.pins.pigpio import PiGPIOFactory


class servoMotor:

    def __init__(self: "servoMotor") -> None:
        self.s = AngularServo(22, min_angle=0, max_angle=180, min_pulse_width=0.5 / 1000, max_pulse_width=2.5 / 1000, pin_factory=PiGPIOFactory())

    def initServo(self: "servoMotor") -> None:
        self.s.angle = 90

    def turnToAngle(self: "servoMotor", given_angle: int) -> None:
        # self.s.angle = self.s.max()
        self.s.angle = given_angle
