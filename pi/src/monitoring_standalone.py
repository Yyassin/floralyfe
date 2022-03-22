from test.test_database import main as data

from test.test_hardware.test_servo import main as servo

from test.test_hardware.test_camera import test_camera


def test_database() -> None:
    data()


def test_servo() -> None:
    servo()


def test_pi_camera() -> None:
    test_camera()


if __name__ == "__main__":
    test_database()
    test_servo()
    test_camera()
