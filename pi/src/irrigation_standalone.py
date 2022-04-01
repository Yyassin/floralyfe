"""
    irrigation_standalone.py
    ========================
    Any standalone testing with the IrrigationSystem class
    should be performed here to satisfy the import structure and entrypoint
    (i.e keeping src as root so imports keep working).
"""

from irrigation_system.IrrigationSystem import IrrigationSystem
from Sensors import Sensors
import config.io_config as io
# from irrigation_system.Irrigation_simulation import main


def test_IrregationSystem() -> None:
    sensors = Sensors(io.pins)
    irrigation = IrrigationSystem(None, sensors)    # type: ignore
    irrigation.main()


# def test_simulation() -> None:
#    main()


if __name__ == "__main__":
    test_IrregationSystem()
