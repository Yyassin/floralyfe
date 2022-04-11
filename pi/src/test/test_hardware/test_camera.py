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
from util.Logger import Logger

if IS_RPI:
    from picamera import PiCamera

logger = Logger("Camera Image Test")


def test_camera() -> None:
    """
        Opens a video feed and sends an encoded frame
        over a WebSocket connection every second.
        The frame pertains to user with id userID (above).
    """
    cam = PiCamera() if IS_RPI else cv.VideoCapture(0)

    data = PI_capture(cam) if IS_RPI else WIN_capture(cam)
    byte_data = data[1]
    encoded = byte_data.decode("ascii")                                             # Extract byte array

    # print(msg)
    logger.debug("Got base 64 image " + encoded)
    assert isinstance(encoded, str)
    # cam.release()               # Cleanup
    cv.destroyAllWindows()


if __name__ == "__main__":
    test_camera()
