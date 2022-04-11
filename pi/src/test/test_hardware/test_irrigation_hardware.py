"""
test_irrigation_hardware.py
=========================
Tests proper functionality of irrigation
system hardware.
"""

__author__ = "abdalla"

import busio
import digitalio
import board
import adafruit_mcp3xxx.mcp3008 as MCP
from adafruit_mcp3xxx.analog_in import AnalogIn
import RPi.GPIO as GPIO
from time import sleep
from gpiozero import AngularServo


def test_moisture_water() -> None:
    """Test Moisture Sensor in water"""
    spi = busio.SPI(clock=board.SCK, MISO=board.MISO, MOSI=board.MOSI)
    cs = digitalio.DigitalInOut(board.D22)
    mcp = MCP.MCP3008(spi, cs)

    chan0 = AnalogIn(mcp, MCP.P6)
    while True:
        print('Raw ADC Value: ', chan0.value)
        print('ADC Voltage: ' + str(chan0.voltage) + 'V')
        sleep(1)

    assert(chan0.voltage < 1)
    print("Test Passed")


def test_moisture_dry() -> None:
    """Test Moisture Sensor in dry condition"""
    spi = busio.SPI(clock=board.SCK, MISO=board.MISO, MOSI=board.MOSI)
    cs = digitalio.DigitalInOut(board.D22)
    mcp = MCP.MCP3008(spi, cs)

    chan0 = AnalogIn(mcp, MCP.P6)

    print('Raw ADC Value: ', chan0.value)
    print('ADC Voltage: ' + str(chan0.voltage) + 'V')

    assert(chan0.voltage > 1)
    print("Test Passed")


def test_waterLevel_water() -> None:
    """Test water level Sensor in water"""
    spi = busio.SPI(clock=board.SCK, MISO=board.MISO, MOSI=board.MOSI)
    cs = digitalio.DigitalInOut(board.D22)
    mcp = MCP.MCP3008(spi, cs)

    chan0 = AnalogIn(mcp, MCP.P1)

    print('Raw ADC Value: ', chan0.value)
    print('ADC Voltage: ' + str(chan0.voltage) + 'V')

    assert(chan0.voltage > 1)
    print("Test Passed")


def test_waterLevel_dry() -> None:
    """Test water level Sensor in dry condition"""
    spi = busio.SPI(clock=board.SCK, MISO=board.MISO, MOSI=board.MOSI)
    cs = digitalio.DigitalInOut(board.D22)
    mcp = MCP.MCP3008(spi, cs)

    chan0 = AnalogIn(mcp, MCP.P1)

    print('Raw ADC Value: ', chan0.value)
    print('ADC Voltage: ' + str(chan0.voltage) + 'V')

    assert(chan0.voltage < 1)
    print("Test Passed")

pin = 27
def test_transistor() -> None:
    """Test if the software can control a transistor"""
    GPIO.setmode(GPIO.BCM)
    GPIO.setwarnings(False)

    GPIO.setup(pin, GPIO.OUT, initial=GPIO.LOW)

    GPIO.output(pin, GPIO.HIGH)
    sleep(3)
    GPIO.output(pin, GPIO.LOW)


def test_servo() -> None:
    gpio = 17
    # factory = PiGPIOFactory()
    servo = AngularServo(gpio, min_angle=0, max_angle=180, min_pulse_width=0.5 / 1000, max_pulse_width=2.5 / 1000)

    while True:
        servo.mid()
        print("mid")
        sleep(0.5)
        servo.angle = 180
        print("180")
        sleep(1)
        servo.mid()
        print("mid")
        sleep(0.5)
        servo.angle = 0
        print(0)
        sleep(1)


if __name__ == "__main__":
    test_moisture_dry()
