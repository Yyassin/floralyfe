from queue import Queue
from typing import Any
from irrigation_system.IrrigationSystem import IrrigationSystem


def test_camera_system() -> None:
    queue = Queue()     # type: Queue[Any]
    irrigation = IrrigationSystem(queue)

    assert irrigation.test_function() == "test"
