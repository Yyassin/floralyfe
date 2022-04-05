"""
    camera_standalone.py
    ========================
    Any standalone testing with the CameraSystem class
    should be performed here to satisfy the import structure and entrypoint
    (i.e keeping src as root so imports keep working).
"""

from Sensors import Sensors
from vital_system import VitalSystem


def main() -> None:
    # Instantiate modules
    sensors = Sensors()
    vitals = VitalSystem.VitalSystem(None, sensors)    # type: ignore
    vitals.test_function()
    sensors.cleanup()


if __name__ == "__main__":
    main()
