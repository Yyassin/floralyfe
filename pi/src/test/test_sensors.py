from Sensors import Sensors
import config.io_config as io
from util.Logger import Logger
from config.config import SW_TEST
import numpy as np
import cv2 as cv


logger = Logger("test_sensors")

pins = io.pins
sensors = Sensors(pins)


def test_sensors_sense_hat_temperature() -> None:
    """Sensors :: Sense Hat Temperature"""
    temperature = sensors.get_temperature()
    logger.debug(f"Got mock sense hat temperature: {temperature}")
    assert temperature == 35.15


def test_sensors_sense_hat_humidity() -> None:
    """Sensors :: Sense Hat Humidity"""
    humidity = sensors.get_humidity()
    logger.debug(f"Got mock sense hat humidity: {humidity}")
    assert humidity == 22.42


def test_sensors_sense_hat_matrix() -> None:
    """Sensors :: Sense Hat Matrix"""
    RED = [255, 0, 0]
    sense_pixels = [RED] * 64
    for i in range(8):
        sense_pixels[i] = [255, 255, 255]

    sensors.set_sense_mat(sense_pixels)
    logger.debug("Set mock sense hat pixels successfully.")
    if SW_TEST:
        assert sensors.sense.get_pixels() == sense_pixels

    io.close_all()


def test_water_level() -> None:
    """Sensors :: Read water level"""
    water_level = pins["water_level"]
    water_level.value = 0.77

    assert sensors.get_water_level() == water_level.value
    logger.debug(f"Got mock water level {water_level.value}")
    io.close_all()


def test_moisture() -> None:
    """Sensors :: Read from channel moisture sensors"""
    moisture1 = pins["channel_1"]["moisture"]
    moisture2 = pins["channel_2"]["moisture"]
    moisture1.value = 0.5
    moisture2.value = 0.6

    assert sensors.channel == 1
    assert sensors.get_soil_moisture() == moisture1.value
    logger.debug(f"Got mock moisture level on channel 1: {moisture1.value}")

    sensors.set_channel(2)
    assert sensors.channel == 2
    assert sensors.get_soil_moisture() == moisture2.value
    logger.debug(f"Got mock moisture level on channel 2: {moisture2.value}")
    sensors.set_channel(1)
    io.close_all()


def test_sensors_pump() -> None:
    """Sensors :: Turn on/off channel water pumps"""
    pump1 = pins["channel_1"]["pump"]
    pump2 = pins["channel_2"]["pump"]

    assert sensors.channel == 1
    sensors.turn_on_pump()
    assert pump1.state
    logger.debug(f"Turned on mock channel1 pump: {pump1.state}")

    sensors.set_channel(2)
    sensors.turn_on_pump()
    assert pump2.state
    logger.debug(f"Turned on mock channel2 pump: {pump2.state}")
    sensors.set_channel(1)
    io.close_all()


def test_sensors_servo() -> None:
    """Sensors :: Turn Servo"""
    servo = pins["servo"]

    assert servo.angle == 0

    sensors.turn_servo(90)
    assert servo.angle == 90
    logger.debug(f"Turned servo degrees: {servo.angle}")


def test_pi_cam_capture() -> None:
    """Sensors :: PiCamera Capture"""
    ENCODEQ_65 = [int(cv.IMWRITE_JPEG_QUALITY), 20]

    dim = (24, 32, 3)
    frame = np.empty(dim, dtype=np.uint8)
    frame[:] = (255,) * 3
    _, frame = cv.imencode('.jpg', frame, ENCODEQ_65)

    cap = sensors.capture_image(dim)
    logger.debug("Captured mock pi cam image")

    assert np.array_equal(cap, frame)
