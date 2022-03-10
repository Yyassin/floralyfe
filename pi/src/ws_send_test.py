from pprint import pprint
from ws import WSReceiver
from typing import Dict, Any
from util.Logger import Logger
import time

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
    "deviceID": "yousef-device",
    "payload": {
        "vital": test_vital
    }
}

logger = Logger("WS Sender")

if __name__ == "__main__":
    USER_ID = "yousef"                             # placeholder, subscribe to messages sent to "hello"
    SOCKET = "wss://floralyfecore.loca.lt"
    queues = {}                                    # type: Dict[Any, Any]

    ws_receiver = WSReceiver(queues, SOCKET, USER_ID, False)
    ws_receiver.run()

    time.sleep(2)
    logger.debug("Sending vital:")
    pprint(test_vital_msg)
    ws_receiver.send(test_vital_msg)
    input("Enter to exit.")
