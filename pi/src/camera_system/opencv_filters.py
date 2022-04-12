"""
opencv_filters.py
====================
OpenCV image processing filters to estimate
plant green growth and perceived luminescense.
"""

__author__ = "yousef"

import cv2 as cv
import numpy as np
from typing import cast, Any

# Note: the lumi here is pretty good but doesn't correct *as much* as you'd hope for perceived lighting
# Fairchild's model does: https://stackoverflow.com/a/59602392
# But it's also a lot more computationally expensive (especially abToHue conditionals)


def cv_green_mask(filename: str) -> float:
    """
    Returns an estimate count (unitless) of the amount of
    green in the photo specified by the filename path.

    :param filename: str, filename path to the image to be analyzed.
    """
    # source: https://stackoverflow.com/questions/47483951/how-to-define-a-threshold-value-to-detect-only-green-colour-objects-in-an-image
    img = cast("cv.Image", cv.imread(filename))

    return green_mask(img)


def green_mask(image: "cv.Image") -> float:
    """
    Returns an estimate count (unitless) of the amount of
    green in the specified image.

    :param image: cv.Image, the image to analyze.
    """
    # Transform to HSV to apply mask
    hsv = cv.cvtColor(image, cv.COLOR_BGR2HSV)

    # Mask all pixels in green range
    mask = cv.inRange(hsv, (36, 25, 25), (70, 255, 255))

    imask = mask > 0
    green = cast(Any, np.zeros_like(image, np.uint8))
    green[imask] = image[imask]

    # cv.imwrite("../images/bright_plant_mask.jpg", green)

    # Return arbitrary count akin to percentage.
    return cast(float, green.sum() / (green.size * 255))


def luminescense(image: "cv.Image") -> float:
    """
    Estimates perceived luminescense in the specified
    image as a percentage.

    :param image: cv.Image, the image to analyze.
    """
    # Transform to L* for luminescense.
    lab_image = cv.cvtColor(image, cv.COLOR_BGR2LAB)

    # Extract the L* channel.
    lstar = lab_image[:, :, 0].flatten()

    # Normalize to percentage.
    return cast(float, lstar.sum() / (255 * (lstar.size)))


def main() -> None:
    """
    Main test script.
    """
    blank_image = np.zeros((512, 512, 3), np.uint8)
    blank_image[:] = (118, 118, 118)
    # cv.imshow('3 Channel Window', blank_image)
    # cv.waitKey(0)

    # print(lumi(blank_image))
    # print(luminescense(blank_image))

    print(luminescense(blank_image))


if __name__ == "__main__":
    # cv_green_mask("../images/bright_plant.jpg")
    main()
