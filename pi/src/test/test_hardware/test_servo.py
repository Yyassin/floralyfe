"""
test_servo.py
=========================
Tests proper functionality of the servo motor.
"""

__author__ = "zakariyya"

from camera_system.servo import servoMotor

servo = servoMotor()


def test_turnToAngle() -> None:
    angle = 1
    servo.turnToAngle(angle)
    assert(servo.s.angle)
    print("Test Passed: turnToAngle:", angle)


def main() -> None:
    test_turnToAngle()
