"""
camera_test.py

A prototype script to send video frames from
machine over websocket pertaining to user "hello".
"""

# TODO: Install opencv on raspberry pi, stays commented otherwise.

__author__ = 'yousef'

import cv2 as cv
import websocket
from picamera import PiCamera
import numpy as np
import base64
import json
import time
from typing import Any, cast

url = "ws://8710-174-112-246-246.ngrok.io"     # The local websocket url


def on_message(ws: Any, message: str) -> None:
    print(message)


def on_error(ws: Any, error: str) -> None:
    print(error)


def on_close(ws: Any, close_status_code: int, close_msg: bytes) -> None:
    print(f"Closed connection. Status code: { str(close_status_code) }, Message: { str(close_msg) }")


CAMERA_TOPIC = "camera-topic"   # Topic for camera frame images, eventually should go into a topics file
userID = "hello"                # User ID (TODO: this will go into a config / env file at one point)


def on_open(ws: Any) -> None:
    """
        Opens a video feed and sends an encoded frame
        over a WebSocket connection every second.
        The frame pertains to user with id userID (above).
    """
    # cam = cv.VideoCapture(0)
    cam = PiCamera()
    try:
        while (True):
            # rawCapture = PiRGBArray(camera)                      # Obtain the frame.
            # cv.imshow('frame', gray)

            cam.resolution = (320, 240)
            cam.framerate = 24
            time.sleep(2)
            frame = np.empty((240, 320, 3), dtype=np.uint8)
            cam.capture(frame, 'bgr')

            _, frame = cv.imencode('.jpg', frame)         # Encode from image to binary buffer

            # This works with ndarray[Any, dtype[unsignedinteger[_8Bit]]] but mypy is expecting bytes.
            data = base64.b64encode(cast(bytes, frame))                  # Then convert to base64 format

            msg = {                                         # Create the socket message
                "topic": CAMERA_TOPIC,
                "userID": userID,
                "payload": {
                    "encoded": data.decode("ascii")
                }
            }

            print(msg)

            ws.send(json.dumps(msg, indent=4))          # Create json from msg dictionary and send it
            time.sleep(1)

            if 0xFF == ord('q'):
                break

    except KeyboardInterrupt:
        pass

    # cam.release()               # Cleanup
    cv.destroyAllWindows()


if __name__ == "__main__":
    # websocket.enableTrace(True)
    ws = websocket.WebSocketApp(url,
                                on_message=on_message,
                                on_error=on_error,
                                on_close=on_close)
    ws.on_open = on_open
    ws.run_forever()
