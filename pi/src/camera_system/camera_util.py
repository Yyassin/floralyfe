"""
camera_util.py
====================
Camera Utility Functions for taking photos and
encoding.
"""

__author__ = "yousef"

from typing import Any, Tuple, cast, List
import numpy as np
import time
import cv2 as cv
import pybase64
import threading

ENCODEQ_65 = [int(cv.IMWRITE_JPEG_QUALITY), 65]     # PNG encoding quality
lock = threading.Lock()

# Shared image buffer so other nodes can acquire the most
# recently sent live image.
image_buffer: List[Any] = [None]


def PI_capture_frame(cam: "cv.Camera", dim: Tuple[int, int, int] = (240, 320, 3)) -> "np.ndarray[Any, np.dtype[np.uint8]]":
    """
    Captures an image with the specified camera of the specified
    dimension.

    :param cam: cv.Camera, the camera to capture the image with.
    :param dim: Tuple[int, int, int], the image dimension (height, width, colour_encoding = 3 for R, G, B)
    """
    cam.resolution = (320, 240)
    cam.framerate = 24
    time.sleep(2)
    frame = np.empty(dim, dtype=np.uint8)
    lock.acquire()
    try:
        cam.capture(frame, 'bgr')
    finally:
        lock.release()

    frame = cv.rotate(frame, cv.ROTATE_180)
    image_buffer[0] = frame

    return frame


def PI_capture(cam: "cv.Camera", dim: Tuple[int, int, int] = (240, 320, 3)) -> Tuple["cv.Image", bytes]:
    """
    Captures an image with the specified camera of the specified
    dimension and encodes it into base64.

    :param cam: cv.Camera, the camera to capture the image with.
    :param dim: Tuple[int, int, int], the image dimension (height, width, colour_encoding = 3 for R, G, B)
    """
    frame = PI_capture_frame(cam, dim)

    _, frame = cv.imencode('.jpg', frame, ENCODEQ_65)           # Encode from image to binary buffer

    # This works with ndarray[Any, dtype[unsignedinteger[_8Bit]]] but mypy is expecting bytes.
    return cast("cv.Image", frame), cast(bytes, (pybase64.b64encode(frame)))             # Then convert to base64 format


def WIN_capture(cam: Any) -> Tuple["cv.Image", bytes]:
    """
    Captures an image with the specified camera of the specified
    dimension and encodes it on windows (webcam).

    :param cam: cv.Camera, the camera to capture the image with.
    """
    _, frame = cam.read()                                       # Obtain the frame.
    _, frame = cv.imencode('.jpg', frame, ENCODEQ_65)           # Encode from image to binary buffer
    return cast("cv.Image", frame), cast(bytes, (pybase64.b64encode(frame)))             # Then vonvert to base64 format
