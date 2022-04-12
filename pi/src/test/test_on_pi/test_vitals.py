"""
test_vitals.py
=========================
Excercises and validates all
functionality from the vital system.
"""

__author__ = "yousef"

from queue import Queue
from typing import Any, cast
from vital_system.VitalSystem import SenseIcon, VitalStates, VitalSystem
from util.Logger import Logger
from Sensors import Sensors     # type: ignore
from datetime import datetime
from dateutil import parser
from deepdiff import DeepDiff

queue = Queue()     # type: Queue[Any]
sensors = Sensors(False)
vitals = VitalSystem(queue, sensors, cast(Any, None), "", "")
logger = Logger("test_vitals")


def test_vitals_singleton() -> None:
    """Vitals :: Vitals is Singleton"""
    is_singleton = vitals == VitalSystem(queue, sensors, cast(Any, None), "", "")
    logger.debug(f"Testing vitals is singleton, got: {is_singleton}")
    assert is_singleton


def test_vitals_state_machine_happy_path() -> None:
    """Vitals :: Excercise State Machine Happy Path"""
    vitals.state = VitalStates.IDLE

    water_level = 96
    moisture = 97

    expected_vital = {
        "soilMoisture": moisture,
        "temperature": 35.15,
        "airHumidity": 22.42,
        "waterLevel": water_level,
        "light": 0.4980,
        "greenGrowth": 10.0610,
        "plantID": "yousef-plant",
        "createdAt": datetime.now()
    }

    assert vitals.state == VitalStates.IDLE

    vitals.execute()

    assert vitals.state == VitalStates.MEASURE_VITALS

    vitals.execute()

    actual_vital = vitals.vitals.copy()
    actual_vital["createdAt"] = parser.parse(actual_vital["createdAt"])

    diff = DeepDiff(actual_vital, expected_vital,
                    significant_digits=3, ignore_numeric_type_changes=True, truncate_datetime='minute')

    logger.debug(f"{vitals.vitals}")
    logger.debug(f"Diff between expected: {diff}")

    assert not diff
    assert vitals.state == VitalStates.COMPARE_OPTIMA

    vitals.execute()

    assert not vitals.optima

    assert vitals.state == VitalStates.PUBLISH_VITAL

    vitals.execute()

    assert vitals.state == VitalStates.SET_SENSE_ICON

    vitals.execute()

    # TODO: Actual Icon
    assert sensors.sense.get_pixels() == vitals.enum_to_icon[SenseIcon.HAPPY]
    sensors.sense.clear()

    assert vitals.state == VitalStates.IDLE


def test_vitals_state_machine_not_happy_path() -> None:
    """Vitals :: Excercise State Machine Un-Happy Path"""
    vitals.state = VitalStates.IDLE

    water_level = 0.1
    moisture = 0.2

    expected_vital = {
        "soilMoisture": moisture,
        "temperature": 35.15,
        "airHumidity": 22.42,
        "waterLevel": water_level,
        "light": 0.4980,
        "greenGrowth": 10.0610,
        "plantID": "yousef-plant",
        "createdAt": datetime.now()
    }

    expected_optima = {
        "soilMoisture": True,
        "temperature": True,
        "airHumidity": True,
        "waterLevel": True
    }

    assert vitals.state == VitalStates.IDLE

    vitals.execute()

    assert vitals.state == VitalStates.MEASURE_VITALS

    vitals.execute()

    actual_vital = vitals.vitals.copy()
    actual_vital["createdAt"] = parser.parse(actual_vital["createdAt"])

    diff = DeepDiff(actual_vital, expected_vital,
                    significant_digits=3, ignore_numeric_type_changes=True, truncate_datetime='minute')

    logger.debug(f"{vitals.vitals}")
    logger.debug(f"Diff between expected: {diff}")

    # Change temp and humidity to be critical
    vitals.vitals["temperature"] = 19
    vitals.vitals["airHumidity"] = 19

    assert not diff
    assert vitals.state == VitalStates.COMPARE_OPTIMA

    vitals.execute()

    diff = DeepDiff(vitals.optima, expected_optima)
    assert not diff

    assert vitals.state == VitalStates.SEND_NOTIFICATION

    vitals.execute()

    assert vitals.state == VitalStates.PUBLISH_VITAL

    vitals.execute()

    assert vitals.state == VitalStates.SET_SENSE_ICON

    vitals.execute()

    # TODO: Actual Icon
    assert sensors.sense.get_pixels() == vitals.enum_to_icon[SenseIcon.THERMOMETER]
    sensors.sense.clear()

    assert vitals.state == VitalStates.IDLE


def test_async_client_msg() -> None:
    """Vitals :: Response to Async Client Message"""
    vitals.state = VitalStates.IDLE

    vitals.task_queue.put({
        "payload": {
            "icon": "MOISTURE"
        }
    })

    vitals.process_queue()

    assert vitals.state == VitalStates.SET_SENSE_ICON
    vitals.execute()

    assert sensors.sense.get_pixels() == vitals.enum_to_icon[SenseIcon.MOISTURE]

    assert vitals.state == VitalStates.IDLE
