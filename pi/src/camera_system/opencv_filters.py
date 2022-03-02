import cv2 as cv
import numpy as np
from typing import cast

# Note: the lumi here is pretty good but doesn't correct *as much* as you'd hope for perceived lighting
# Fairchild's model does: https://stackoverflow.com/a/59602392
# But it's also a lot more computationally expensive (especially abToHue conditionals)


def cv_green_mask(filename: str) -> float:
    # source: https://stackoverflow.com/questions/47483951/how-to-define-a-threshold-value-to-detect-only-green-colour-objects-in-an-image
    img = cv.imread(filename)

    hsv = cv.cvtColor(img, cv.COLOR_BGR2HSV)

    mask = cv.inRange(hsv, (36, 25, 25), (70, 255, 255))

    imask = mask > 0
    green = np.zeros_like(img, np.uint8)
    green[imask] = img[imask]

    cv.imwrite("../images/bright_plant_mask.jpg", green)

    return cast(float, green.sum() / green.size)


def luminescense(image: "cv.Image") -> float:
    lab_image = cv.cvtColor(image, cv.COLOR_BGR2LAB)
    lstar = lab_image[:, :, 0].flatten()
    return cast(float, lstar.sum() / (255 * (lstar.size)))


def main() -> None:
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
