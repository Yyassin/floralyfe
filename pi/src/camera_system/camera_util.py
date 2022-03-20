from typing import Any, cast
import numpy as np
import time
import cv2 as cv
import pybase64

ENCODEQ_65 = [int(cv.IMWRITE_JPEG_QUALITY), 20]


def PI_capture(cam: "cv.Camera", dim: tuple[int, int, int] = (240, 320, 3)) -> tuple["cv.Image", bytes]:
    cam.resolution = (320, 240)
    cam.framerate = 24
    time.sleep(2)
    frame = np.empty(dim, dtype=np.uint8)
    cam.capture(frame, 'bgr')

    _, frame = cv.imencode('.jpg', frame, ENCODEQ_65)           # Encode from image to binary buffer

    # This works with ndarray[Any, dtype[unsignedinteger[_8Bit]]] but mypy is expecting bytes.
    return cast("cv.Image", frame), cast(bytes, (pybase64.b64encode(frame)))             # Then convert to base64 format


def WIN_capture(cam: Any) -> tuple["cv.Image", bytes]:
    _, frame = cam.read()                                       # Obtain the frame.
    _, frame = cv.imencode('.jpg', frame, ENCODEQ_65)           # Encode from image to binary buffer
    return cast("cv.Image", frame), cast(bytes, (pybase64.b64encode(frame)))             # Then vonvert to base64 format
