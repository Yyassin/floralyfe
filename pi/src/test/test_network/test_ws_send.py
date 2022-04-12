"""
test_ws_send.py
=========================
Tests that the websocket client
can send a message over the websocket
(and that the client receives it).
"""

__author__ = "yousef"

from pprint import pprint
from ws import WSClient
from typing import Dict, Any
from util.Logger import Logger
import time
import pi.src.config.config as config

test_vital = {
    "soilMoisture": 14.2,
    "temperature": 22.3,
    "airHumidity": 33.2,
    "light": 0.33,
    "greenGrowth": 10.8,
    "plantID": "yousef-plant",
    "createdAt": "2022-03-10T07:35:05.538Z"
}

test_vital_msg = {
    "topic": "vitals-topic",
    "deviceID": config.DEVICE_ID,
    "payload": {
        "vital": test_vital
    }
}

logger = Logger("WS Sender")

if __name__ == "__main__":
    queues = {}                                    # type: Dict[Any, Any]

    ws_receiver = WSClient(queues, config.WS_URL, config.USER_ID, config.DEVICE_ID)
    ws_receiver.run()

    time.sleep(2)
    logger.debug("Sending vital:")
    pprint(test_vital_msg)
    ws_receiver.send(test_vital_msg, "")
    input("Enter to exit.")
