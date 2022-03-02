"""
camera_test.py

A prototype script to send video frames from
machine over websocket pertaining to user "hello".
"""

# TODO: Install opencv on raspberry pi, stays commented otherwise.

__author__ = 'yousef'

import cv2 as cv
from camera_system.camera_util import PI_capture, WIN_capture
from util.util import IS_RPI
import websocket
import json
# import time
from typing import Any

if IS_RPI:
    from picamera import PiCamera


url = "ws://localhost:5000"     # The local websocket url


def on_message(ws: Any, message: str) -> None:
    print(message)


def on_error(ws: Any, error: str) -> None:
    print(error)


def on_close(ws: Any, close_status_code: int, close_msg: bytes) -> None:
    print(f"Closed connection. Status code: { str(close_status_code) }, Message: { str(close_msg) }")


CAMERA_TOPIC = "camera-topic"   # Topic for camera frame images, eventually should go into a topics file
userID = "hello1"                # User ID (TODO: this will go into a config / env file at one point)


def on_open(ws: Any) -> None:
    """
        Opens a video feed and sends an encoded frame
        over a WebSocket connection every second.
        The frame pertains to user with id userID (above).
    """
    cam = PiCamera() if IS_RPI else cv.VideoCapture(0)
    try:
        while (True):
            data = PI_capture(cam) if IS_RPI else WIN_capture(cam)

            msg = {                                                     # Create the socket message
                "topic": CAMERA_TOPIC,
                "userID": userID,
                "payload": {
                    "encoded": data.decode("ascii")
                }
            }

            # print(msg)
            print("sent")

            ws.send(json.dumps(msg, indent=4))          # Create json from msg dictionary and send it
            # time.sleep(0.1)

            if 0xFF == ord('q'):
                break

    except KeyboardInterrupt:
        pass

    # cam.release()               # Cleanup
    cv.destroyAllWindows()


def main() -> None:
    # websocket.enableTrace(True)
    ws = websocket.WebSocketApp(url,
                                on_message=on_message,
                                on_error=on_error,
                                on_close=on_close)
    ws.on_open = on_open
    ws.run_forever()


if __name__ == "__main__":
    main()
