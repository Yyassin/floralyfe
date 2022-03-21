import config.get_mock_pins as mock
from util.util import IS_RPI
from gpiozero import OutputDevice
from config.config import SW_TEST
from util.Logger import Logger

logger = Logger("io_config")

if IS_RPI and not SW_TEST:
    from sense_hat import SenseHat
    from picamera import PiCamera
    logger.warn("Loaded config in RPi mode.")

    sense = SenseHat()
    camera = PiCamera()
    servo = OutputDevice(13)
    pin27 = OutputDevice(27)
    pin20 = OutputDevice(20)
    pin9 = OutputDevice(9)
    pin11 = OutputDevice(11)
    pin12 = OutputDevice(12)
    gpios = [pin27, pin20, pin9, pin11, pin12, servo, camera]

    pins = {
        "sense_hat": sense,
        "servo": servo,
        "camera": camera,
        "water_level": pin27,
        "channel_1": {
            "moisture": pin20,
            "pump": pin9
        },
        "channel_2": {
            "moisture": pin11,
            "pump": pin12
        }
    }
    pass
else:
    logger.warn("Loaded config in Win / Test mode.")
    pins = mock.get_mock_pins()
    gpios = mock.gpios


def close_all() -> None:
    for pin in gpios:
        pin.close()
