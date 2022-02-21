"""
:brief: A prototype script to send video frames from
machine over websocket pertaining to user "hello".
"""

__author__ = 'yousef'

# doesn't have py.typed marker
import cv2 as cv            # type: ignore
import websockets   
from websockets.client import connect
import base64
import asyncio
import json
import time

url = "ws://localhost:4000"     # The local websocket url


def wsSend(url: str, msg: str) -> None:
    """
        Asynchronously connects to the WebSocket
        specified by url and sends the specified message.
        :param url: str, the WebSocket connection url.
        :param msg: str, the message to send.
    """
    async def send() -> None:
        async with connect(url) as websocket:    # Connect and send the message
            await websocket.send(msg)
            # print("sent")

            # We can wait for a response ack:
            # greeting = await websocket.recv()
            # print(f"< {greeting}")

    # Return a promise so that send() runs in the background
    asyncio.get_event_loop().run_until_complete(send())


CAMERA_TOPIC = "camera-topic"   # Topic for camera frame images, eventually should go into a topics file
userID = "hello"                # User ID (TODO: this will go into a config / env file at one point)


def main() -> None:
    """
        Opens a video feed and sends an encoded frame
        over a WebSocket connection every second.
        The frame pertains to user with id userID (above).
    """
    cam = cv.VideoCapture(0)
    try:
        while (True):
            ret, frame = cam.read()                         # Obtain the frame.
            # cv.imshow('frame', gray)

            res, frame = cv.imencode('.jpg', frame)         # Encode from image to binary buffer
            data = base64.b64encode(frame)                  # Then vonvert to base64 format

            msg = {                                         # Create the socket message
                "topic": CAMERA_TOPIC,
                "userID": userID,
                "payload": {
                    "encoded": data.decode("ascii")
                }
            }

            wsSend(url, json.dumps(msg, indent=4))          # Create json from msg dictionary and send it
            time.sleep(1)

            if 0xFF == ord('q'):
                break

    except KeyboardInterrupt:
        pass

    cam.release()               # Cleanup
    cv.destroyAllWindows()


if __name__ == "__main__":
    main()
