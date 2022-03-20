from queue import Queue
from typing import Any
from irrigation_system.IrrigationSystem import IrrigationSystem
from config.io_config import pins
from Sensors import Sensors

queue = Queue()     # type: Queue[Any]
sensors = Sensors(pins)
irrigation = IrrigationSystem(queue, sensors)


def test_irrigation_test_function() -> None:
    assert irrigation.test_function() == "test"


def test_irrigation_singleton() -> None:
    assert irrigation == IrrigationSystem(queue, sensors)
