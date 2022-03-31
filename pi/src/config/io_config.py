import config.get_mock_pins as mock
from util.util import IS_RPI
from gpiozero import OutputDevice, LED
from config.config import SW_TEST
from util.Logger import Logger

logger = Logger("io_config")

if IS_RPI and not SW_TEST:
    # from sense_hat import SenseHat
    from config.get_mock_pins import SenseHat, PiCamera
    # from picamera import PiCamera
    import busio
    import digitalio
    import board
    import adafruit_mcp3xxx.mcp3008 as MCP
    from adafruit_mcp3xxx.analog_in import AnalogIn
    logger.warn("Loaded config in RPi mode.")

    spi = busio.SPI(clock=board.SCK, MISO=board.MISO, MOSI=board.MOSI)
    cs = digitalio.DigitalInOut(board.D22)
    mcp = MCP.MCP3008(spi, cs)

    sense = SenseHat()
    camera = PiCamera()
    servo = OutputDevice(13)

    chan0 = AnalogIn(mcp, MCP.P0)
    chan1 = AnalogIn(mcp, MCP.P1)
    chan2 = AnalogIn(mcp, MCP.P2)
    pin17 = LED(17)
    pin27 = LED(27)

    gpios = [pin27, pin17, servo, camera]

    pins = {
        "sense_hat": sense,
        "servo": servo,
        "camera": camera,
        "water_level": chan1,
        "channel_1": {
            "moisture": chan0,
            "pump": pin17
        },
        "channel_2": {
            "moisture": chan2,
            "pump": pin27
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
