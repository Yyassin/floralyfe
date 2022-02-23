from queue import Queue
from typing import Any
from irrigation_system.IrrigationSystem import IrrigationSystem

queue = Queue()     # type: Queue[Any]
irrigation = IrrigationSystem(queue)


def test_irrigation_test_function() -> None:
    assert irrigation.test_function() == "test"


def test_irrigation_singleton() -> None:
    assert irrigation == IrrigationSystem(queue)
