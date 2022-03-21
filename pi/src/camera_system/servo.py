from gpiozero import AngularServo

from gpiozero.pins.pigpio import PiGPIOFactory


class servoMotor:

    factory = PiGPIOFactory()

    MAX_ANGLE = 180
    MIN_ANGLE = 90
    s = AngularServo(17, MIN_ANGLE, MAX_ANGLE, pin_factory=factory)

    def initServo(self) -> None:
        self.s.angle = 90

    def turnToAngle(self, given_angle: int) -> None:
        self.s.angle = self.s.max()
        self.s.angle = given_angle
