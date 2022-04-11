"""
test_opencv_filters.py
=======================
Tests that opencv filters for estimating
green growth and perceived luminescense are working correctly.
"""

__author__ = "yousef"

from camera_system.opencv_filters import luminescense, cv_green_mask
import numpy as np

IMAGE_SIZE = 5
CHANNELS = 3
IMAGE_DIM = (IMAGE_SIZE, IMAGE_SIZE, CHANNELS)
MIDDLE_GREY = (118,) * CHANNELS
BLACK = (0,) * CHANNELS
WHITE = (255,) * CHANNELS

EPSILON = 1e-4

blank_image = np.zeros(IMAGE_DIM, np.uint8)


def test_luminescense_white() -> None:
    """OpenCVFilters :: 100% luminescense on white image"""
    blank_image[:] = WHITE
    lumi = luminescense(blank_image)
    assert abs(lumi - 1) < EPSILON                              # Should be around 1
    pass


def test_luminescense_middle_grey() -> None:
    """OpenCVFilters :: 50% luminescense on middle grey image"""
    blank_image[:] = MIDDLE_GREY
    lumi = luminescense(blank_image)
    assert abs(lumi - 0.4980) < EPSILON                          # Should be around 0.5
    pass


def test_luminescense_black() -> None:
    """OpenCVFilters :: 0% luminescense on black image"""
    blank_image[:] = BLACK
    lumi = luminescense(blank_image)
    assert abs(lumi - 0) < EPSILON                               # Should be around 0
    pass


def test_green_mask() -> None:
    """OpenCVFilters :: 10 units growth on bright_plant.jpg"""
    green_growth = cv_green_mask("./images/bright_plant.jpg")     # invoked from src
    print(green_growth)
    assert abs(green_growth - 0.039455) < EPSILON                  # empirical value ~ 3% green
    pass
