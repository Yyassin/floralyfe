"""
test_sense.py
=========================
Tests proper functionality of the SenseHat.
"""

__author__ = "abdalla"

from Sensors import Sensors     # type: ignore
from vital_system.VitalSystem import HAPPY_ICON, SUN_ICON, MOISTURE_ICON, WATER_LEVEL_ICON, THERMOMETER_ICON
from util.Logger import Logger
from config.config import SW_TEST


logger = Logger("test_sense")
sensors = Sensors(True)
icons = [HAPPY_ICON, SUN_ICON, MOISTURE_ICON, WATER_LEVEL_ICON, THERMOMETER_ICON]


def test_sense_hat_temperature() -> None:
    """SenseHat :: Sense Hat Temperature"""
    temperature = sensors.get_temperature()
    logger.debug(f"Got sense hat temperature: {temperature}")

    assert isinstance(temperature, float)
    assert temperature >= 0
    sensors.cleanup()


def test_sense_hat_humidity() -> None:
    """SenseHat :: Sense Hat Humidity"""
    humidity = sensors.get_humidity()
    logger.debug(f"Got sense hat humidity: {humidity}")

    assert isinstance(humidity, float)
    assert humidity >= 0
    sensors.cleanup()


def test_sense_hat_matrix() -> None:
    """SenseHat :: Sense Hat Matrix"""
    BLACK = [0, 0, 0]

    for icon in icons:
        sensors.set_sense_mat(icon)
        logger.debug("Set sense hat pixels successfully.")
        input()
        # We can't assert these directly since the values
        # are shifted down arbitrarily: https://pythonhosted.org/sense-hat/api/
        if not SW_TEST:
            assert sensors.sense.get_pixels() != icon
        else:
            assert sensors.sense.get_pixels() == icon

    sensors.sense.clear()
    logger.debug("Cleared sense hat pixels successfully.")
    assert sensors.sense.get_pixels() == [BLACK] * 64
    sensors.cleanup()
