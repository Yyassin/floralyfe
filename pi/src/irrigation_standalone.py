from irrigation_system.IrrigationSystem import IrrigationSystem


def main() -> None:
    irrigation = IrrigationSystem(None)    # type: ignore
    irrigation.test_function()


if __name__ == "__main__":
    main()
