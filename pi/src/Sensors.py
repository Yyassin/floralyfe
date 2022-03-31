from typing import Any, Dict, Tuple, List, Union, cast
from camera_system.camera_util import PI_capture
from util.Singleton import Singleton
from util.util import IS_RPI
if IS_RPI:
    try:
        from sense_hat import SenseHat
        from picamera import PiCamera
    except ImportError:
        pass
else:
    from config.get_mock_pins import SenseHat
    from config.get_mock_pins import PiCamera

from gpiozero import GPIODevice, DigitalOutputDevice, PWMOutputDevice, AngularServo

# sensehat, moisture


class Sensors(Singleton):
    def __init__(self: "Sensors", pins: "Dict[str, Any]", channel: int = 1) -> None:
        self.sense = cast(SenseHat, pins["sense_hat"])
        self.camera = cast(PiCamera, pins["camera"])
        self.servo = cast(AngularServo, pins["servo"])
        self.channel = channel
        self.water_level = cast(GPIODevice, pins["water_level"])
        self.channel1 = {
            "moisture": cast(GPIODevice, pins["channel_1"]["moisture"]),
            "pump": cast(DigitalOutputDevice, pins["channel_1"]["pump"])
        }
        self.channel2 = {
            "moisture": cast(GPIODevice, pins["channel_2"]["moisture"]),
            "pump": cast(DigitalOutputDevice, pins["channel_2"]["pump"])
        }
        self.channels = {
            1: self.channel1,
            2: self.channel2
        }

    def get_temperature(self: "Sensors") -> float:
        return cast(float, self.sense.get_temperature())

    def get_humidity(self: "Sensors") -> float:
        return cast(float, self.sense.get_humidity())

    def set_sense_mat(self: "Sensors", mat: List[List[int]]) -> None:
        self.sense.set_pixels(mat)

    def get_water_level(self: "Sensors") -> float:
        return cast(float, self.water_level.voltage)

    def set_channel(self: "Sensors", channel: int) -> None:
        self.channel = channel

    def _get_channel(self: "Sensors", channel: Union[int, None]) -> int:
        return channel if channel is not None else self.channel

    def get_soil_moisture(self: "Sensors", channel: Union[int, None] = None) -> float:
        sensor = cast(PWMOutputDevice, self.channels[self._get_channel(channel)]["moisture"])
        return cast(float, sensor.voltage)

    def turn_on_pump(self: "Sensors", channel: Union[int, None] = None) -> None:
        pump = cast(DigitalOutputDevice, self.channels[self._get_channel(channel)]["pump"])
        pump.on()

    def turn_off_pump(self: "Sensors", channel: Union[int, None] = None) -> None:
        pump = cast(DigitalOutputDevice, self.channels[self._get_channel(channel)]["pump"])
        pump.off()

    def turn_servo(self: "Sensors", angle: float) -> None:
        self.servo.angle = angle

    def capture_image(self: "Sensors", dim: Tuple[int, int, int] = (240, 320, 3)) -> Any:
        return PI_capture(self.camera, dim)[0]
