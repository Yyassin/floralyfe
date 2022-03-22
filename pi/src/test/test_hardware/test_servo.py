from camera_system.servo import servoMotor

servo = servoMotor()


def test_turnToAngle(angle: int) -> None:
    servo.turnToAngle(angle)
    assert(servo.s.angle)
    print("Test Passed: turnToAngle:", angle)


def main() -> None:
    test_turnToAngle(180)
