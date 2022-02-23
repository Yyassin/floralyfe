"""
    irrigation_standalone.py
    ========================
    Any standalone testing with the IrrigationSystem class
    should be performed here to satisfy the import structure and entrypoint
    (i.e keeping src as root so imports keep working).
"""

from irrigation_system.IrrigationSystem import IrrigationSystem


def main() -> None:
    irrigation = IrrigationSystem(None)    # type: ignore
    irrigation.test_function()


if __name__ == "__main__":
    main()
