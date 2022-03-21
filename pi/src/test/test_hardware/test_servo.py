from servo import servoMotor

servo = servoMotor()


def test_turnToAngle(angle: int) -> None:
    servo.turnToAngle(angle)
    assert(servo.s.angle)
    print("Test Passed: turnToAngle:", angle)


if __name__ == '__main__':
    test_turnToAngle(90)
