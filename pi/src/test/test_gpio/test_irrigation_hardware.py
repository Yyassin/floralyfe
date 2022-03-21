import busio
import digitalio
import board
import adafruit_mcp3xxx.mcp3008 as MCP
from adafruit_mcp3xxx.analog_in import AnalogIn
import RPi.GPIO as GPIO
from time import sleep


def test_moisture_water() -> None:
    """Test Moisture Sensor in water"""
    spi = busio.SPI(clock=board.SCK, MISO=board.MISO, MOSI=board.MOSI)
    cs = digitalio.DigitalInOut(board.D22)
    mcp = MCP.MCP3008(spi, cs)

    chan0 = AnalogIn(mcp, MCP.P0)

    print('Raw ADC Value: ', chan0.value)
    print('ADC Voltage: ' + str(chan0.voltage) + 'V')

    assert(chan0.voltage < 1)


def test_moisture_dry() -> None:
    """Test Moisture Sensor in dry condition"""
    spi = busio.SPI(clock=board.SCK, MISO=board.MISO, MOSI=board.MOSI)
    cs = digitalio.DigitalInOut(board.D22)
    mcp = MCP.MCP3008(spi, cs)

    chan0 = AnalogIn(mcp, MCP.P0)

    print('Raw ADC Value: ', chan0.value)
    print('ADC Voltage: ' + str(chan0.voltage) + 'V')

    assert(chan0.voltage > 1)


def test_waterLevel_water() -> None:
    """Test water level Sensor in water"""
    spi = busio.SPI(clock=board.SCK, MISO=board.MISO, MOSI=board.MOSI)
    cs = digitalio.DigitalInOut(board.D22)
    mcp = MCP.MCP3008(spi, cs)

    chan0 = AnalogIn(mcp, MCP.P1)

    print('Raw ADC Value: ', chan0.value)
    print('ADC Voltage: ' + str(chan0.voltage) + 'V')

    assert(chan0.voltage > 1)


def test_waterLevel_dry() -> None:
    """Test water level Sensor in dry condition"""
    spi = busio.SPI(clock=board.SCK, MISO=board.MISO, MOSI=board.MOSI)
    cs = digitalio.DigitalInOut(board.D22)
    mcp = MCP.MCP3008(spi, cs)

    chan0 = AnalogIn(mcp, MCP.P1)

    print('Raw ADC Value: ', chan0.value)
    print('ADC Voltage: ' + str(chan0.voltage) + 'V')

    assert(chan0.voltage < 1)


def test_transistor() -> None:
    """Test if the software can control a transistor"""
    GPIO.setmode(GPIO.BCM)
    GPIO.setwarnings(False)

    GPIO.setup(17, GPIO.OUT, initial=GPIO.LOW)

    GPIO.output(17, GPIO.HIGH)
    sleep(3)
    GPIO.output(17, GPIO.LOW)


if __name__ == "__main__":
    test_moisture_water()
