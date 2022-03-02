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


def test_luminescense_white():
    blank_image[:] = WHITE
    lumi = luminescense(blank_image)
    assert abs(lumi - 1) < EPSILON                              # Should be around 1
    pass


def test_luminescense_middle_grey():
    blank_image[:] = MIDDLE_GREY
    lumi = luminescense(blank_image)
    assert abs(lumi - 0.4980) < EPSILON                          # Should be around 0.5
    pass


def test_luminescense_black():
    blank_image[:] = BLACK
    lumi = luminescense(blank_image)
    assert abs(lumi - 0) < EPSILON                               # Should be around 0
    pass


def test_green_mask():
    green_growth = cv_green_mask("./images/bright_plant.jpg")     # invoked from src
    assert abs(green_growth - 10.0610) < EPSILON                  # empirical value
    pass
