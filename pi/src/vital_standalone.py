"""
    camera_standalone.py
    ========================
    Any standalone testing with the CameraSystem class
    should be performed here to satisfy the import structure and entrypoint
    (i.e keeping src as root so imports keep working).
"""

from Sensors import Sensors
from vital_system import VitalSystem
import config.io_config as io


def main() -> None:
    # Instantiate modules
    sensors = Sensors(io.pins)
    vitals = VitalSystem.VitalSystem(None, sensors)    # type: ignore
    vitals.test_function()


if __name__ == "__main__":
    main()