"""
test_monitoring_system.py
=========================
Excercises and validates all
functionality from the camera monitoring system
"""

__author__ = "zakariyya"

from test.test_database import main as data

from test.test_hardware.test_servo import main as servo

from test.test_hardware.test_camera import test_camera


def test_database() -> None:
    """Tests the database."""
    data()


def test_servo() -> None:
    """Tests the servo motor."""
    servo()


def test_pi_camera() -> None:
    """Tests the pi camera."""
    test_camera()


if __name__ == "__main__":
    test_database()
    test_servo()
    test_camera()
