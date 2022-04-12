"""
validate_message.py
====================
Validates messages received from client over WebSockets
in end-to-end testing suite on client.
"""

__author__ = "yousef"

from typing import Any, Dict
from util.Logger import Logger

expected_subscribe = {
    "userID": "yousef"
}

expected_turn_camera = {
    "yaw": 1.1
}

expected_register_plants = {
    "yaw": 3.1,
    "plantID": "yousef-plant-id"
}

expected_sense_icon = {
    "icon": "MOISTURE_ICON"
}

expected_water_plants = {
    "wateringTimeout": 5.5
}

logger = Logger(">>>Validator")


def validate_message(message: Dict[str, Any]) -> None:
    """
    Validates the specified message against the expected
    ones defined below.

    :param message: Dict[str, Any], the json message to validate.
    """
    if not message.get("topic", False):
        assert message["status"] == 200
        assert message["message"] == "Successfully subscribed to yousef"
        logger.debug("Message validated, passed!")
        return

    if message["topic"] == "vitals-topic":
        assert message["payload"]["icon"] == expected_sense_icon["icon"]

    elif message["topic"] == "irrigation-topic":
        assert message["payload"]["wateringTimeout"] == expected_water_plants["wateringTimeout"]

    elif message["topic"] == "camera-topic":
        payload = message["payload"]

        if payload["topic"] == "turn":
            assert payload["yaw"] == expected_turn_camera["yaw"]
        else:
            assert payload["yaw"] == expected_register_plants["yaw"]
            assert payload["plantID"] == expected_register_plants["plantID"]

    logger.debug("Message validated, passed!")
