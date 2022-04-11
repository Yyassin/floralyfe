# type: ignore
"""
Sensors.py
======
Uniform sensor hardware interface

A uniform interface for all nodes to
interface with hardware sensors and actuators.
These are the SenseHat, PiCamera, servo, moisture, water level
sensors and the water pumps.
"""

__author__ = "yousef & abdalla & zakariyya"

from typing import List
from util.Singleton import Singleton
from time import sleep
from util.util import IS_RPI
import statistics as s
from random import randint

if IS_RPI:
    from sense_hat import SenseHat
    from picamera import PiCamera
    from gpiozero import AngularServo, LED
    import busio
    import digitalio
    import board
    import adafruit_mcp3xxx.mcp3008 as MCP
    from gpiozero.pins.pigpio import PiGPIOFactory
    from adafruit_mcp3xxx.analog_in import AnalogIn
else:
    # Mock if this isn't running on the RPi
    from config.get_mock_pins import SenseHat, PiCamera, AngularServo, LED

# Mock values are randomly generated from a normal distribution.
MAX_16B = 65535  # 2^16 - 1
VARIANCE = 21617e-9


def read_sensor(mean: float) -> float:
    """
    Mocks reading a value from an analog sensor. Returns
    a reading equal to the provide mean and a random error.

    :param mean: float, The mean of the value to return.
    """
    n = s.NormalDist(mu=mean, sigma=VARIANCE ** (1 / 2))

    samples = n.samples(1, seed=randint(0, 100))
    return max(samples[0], 0)


class Sensors(Singleton):
    def __init__(self: "Sensors", hw: bool) -> None:
        """
        Initializes the sensor interface.

        :param hw: bool, False if hw should be mocked, true otherwise.
        """

        # Initialize all digital sensors and all actuators.
        PiCamera().close()           # In case of failure to terminate in previous session.
        self.sense = SenseHat()
        self.camera = PiCamera()
        self.MAX_ANGLE = 180
        self.MIN_ANGLE = 0
        self.servo_enable = LED(22)  # Servo enable pin connected to transistor. Disable servo when pumps are on due to rel. high current draw.
        self.servo_enable.on()
        self.servo = AngularServo(17, min_angle=self.MIN_ANGLE, max_angle=self.MAX_ANGLE, min_pulse_width=0.5 / 1000, max_pulse_width=2.5 / 1000, pin_factory=PiGPIOFactory())
        self.servo.mid()
        self.pump1 = LED(27)
        self.pump2 = LED(5)
        self.hw = hw

        # Initialize MCP and analog sensors.
        self.spi = busio.SPI(clock=board.SCK, MISO=board.MISO, MOSI=board.MOSI)
        self.cs = digitalio.DigitalInOut(board.D22)
        self.mcp = MCP.MCP3008(self.spi, self.cs)

        self.moisture1 = AnalogIn(self.mcp, MCP.P7)
        self.moisture2 = AnalogIn(self.mcp, MCP.P6)
        self.water_level = AnalogIn(self.mcp, MCP.P1)
        self.water_mean = 0.95

        self.channel = {
            1: {
                "pump": self.pump1,
                "moisture": self.moisture1,
                "mean": 0.9
            },
            2: {
                "pump": self.pump2,
                "moisture": self.moisture2,
                "mean": 0.75
            }
        }

        # Moisture 1, moisture 2, pump 1 and pump 2
        self.gpios = [17, 18, 27, 5]
        self.selected_channel = 1
        self.selected_plant_id = ""

    def get_camera(self: "Sensors") -> PiCamera:
        """
        Returns a reference to the PiCamera.
        """
        return self.camera

    def get_gpios(self: "Sensors") -> List[int]:
        """
        Returns all gpios used by sensor channels
        in the format [moisture1GPIO, moisture2GPIO,
        pump1GPIO, pump2GPIO].
        """
        return self.gpios

    def get_selected_channel(self: "Sensors") -> int:
        """
        Returns the channel of the currently selected plant.
        """
        return self.selected_channel

    def get_selected_plant_id(self: "Sensors") -> str:
        """
        Returns the id of the currently selected plant.
        """
        return self.selected_plant_id

    def set_selected_plant(self: "Sensors", plant_id: str, channel: int) -> None:
        """
        Sets the channel and id of the interface to match those for
        the currently selected plant.

        :param plant_id: str, the selected plant's plant ID.
        :param channel: int, the selected plant's channel.
        """
        self.selected_channel = channel
        self.selected_plant_id = plant_id

    def get_temperature(self: "Sensors") -> float:
        """
        Returns the temperature read by the SenseHat in celsius.
        """
        return self.sense.get_temperature()

    def get_humidity(self: "Sensors") -> float:
        """
        Returns the relative humidity read by the SenseHat as a percentage.
        """
        return self.sense.get_humidity()

    def set_sense_mat(self: "Sensors", mat: List[List[int]]) -> None:
        """
        Sets the SenseHat pixel matrix to the specified colour matrix.

        :param mat: List[List[int]], 8x8 array of rgb values to set
        the SenseHat matrix.
        """
        self.sense.set_pixels(mat)

    def get_soil_moisture(self: "Sensors", channel: int) -> float:
        """
        Returns the soil moisture reading from the sensor on the
        specified channel.

        :param channel: int, the channel to read the moisture from.
        """
        if self.hw:
            return 1 - self.channel[channel]["moisture"].value / MAX_16B
        return read_sensor(self.channel[channel]["mean"])

    def get_water_level(self: "Sensors") -> float:
        """
        Returns the water level reading from the water level sensor.
        """
        if self.hw:
            return self.water_level.value / MAX_16B
        return read_sensor(self.water_mean)

    def set_water_mean(self: "Sensors", mean: float) -> None:
        """
        Sets the mock water level sensor's mean to the specified value.

        :param mean: float, the mean to set.
        """
        self.water_mean = mean

    def set_moisture_mean(self: "Sensors", mean: float, channel: int) -> None:
        """
        Sets the mock moisture level sensor's mean to the specified value.

        :param mean: float, the mean to set.
        :param channel: int, the channel of the sensor being set.
        """
        self.channel[channel]["mean"] = mean

    def turn_servo(self: "Sensors", angle: float) -> None:
        """
        Turns the servo motor to the specified angle.

        :param angle: float, the angle to turn the servo to.
        """
        if (angle > self.MAX_ANGLE or angle < self.MIN_ANGLE):
            return

        self.servo.angle = angle

    def turn_on_pump(self: "Sensors", channel: int) -> None:
        """
        Turns on the pump on the specified channel.

        :param channel: int, the channel of the pump to turn on.
        """
        self.servo_enable.off()     # Deactivate servo (BJT) since it's sensitive to the (rel.) high current draw.
        sleep(1)
        self.channel[channel]["pump"].on()

    def turn_off_pump(self: "Sensors", channel: int) -> None:
        """
        Turns off the pump on the specified channel.

        :param channel: int, the channel of the pump to turn off.
        """
        self.channel[channel]["pump"].off()
        sleep(1)
        self.servo_enable.on()

    def cleanup(self: "Sensors") -> None:
        """
        IO cleanup - closes all connections and frees resources.
        """
        self.camera.stop_preview()
        self.camera.close()
        self.sense.clear()
        self.servo.close()
        self.servo_enable.close()
        self.pump1.close()
        self.pump2.close()


if __name__ == "__main__":
    # Brief test script
    sensors = Sensors(True)
    sensors.get_soil_moisture(1)
    print("Temp:", sensors.get_temperature())
    print("Humid:", sensors.get_humidity())
    print("Water Level:", sensors.get_water_level())
    print("Soil Moisture 1:", sensors.get_soil_moisture(1))
    print("Soil Moisture 2", sensors.get_soil_moisture(2))

    # sensors.turn_servo(0)
    # sleep(1)
    # sensors.turn_servo(179)
    # sleep(1)

    # sensors.turn_on_pump(1)
    # sleep(0.5)
    # sensors.turn_off_pump(1)
    # sleep(0.5)

    # sensors.turn_on_pump(2)
    # sleep(0.5)
    # sensors.turn_off_pump(2)
    # sleep(0.5)

    sensors.cleanup()
