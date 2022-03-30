from time import sleep
from camera_system.servo import servoMotor

servo = servoMotor()


def test_turnToAngle(turn_angle: int) -> None:
    servo.turnToAngle(turn_angle)
    assert(servo.s.angle)
    print("Test Passed: turnToAngle:", turn_angle)


def main() -> None:
    test_turnToAngle(90)
    sleep(1)
    test_turnToAngle(180)
