# type: ignore
from typing import List
from gpiozero import AngularServo, LED
from util.Singleton import Singleton
from sense_hat import SenseHat
from picamera import PiCamera
import busio
import digitalio
import board
import adafruit_mcp3xxx.mcp3008 as MCP
from gpiozero.pins.pigpio import PiGPIOFactory
from adafruit_mcp3xxx.analog_in import AnalogIn
import statistics as s
from random import randint

from time import sleep

MAX_16B = 65535  # 2^16 - 1
VARIANCE = 21617e-9


def read_sensor(mean: float) -> float:
    n = s.NormalDist(mu=mean, sigma=VARIANCE ** (1 / 2))

    samples = n.samples(1, seed=randint(0, 100))
    return max(samples[0], 0)


class Sensors(Singleton):
    def __init__(self: "Sensors") -> None:
        PiCamera().close()
        self.sense = SenseHat()
        self.camera = PiCamera()
        self.MAX_ANGLE = 180
        self.MIN_ANGLE = 0
        self.servo_enable = LED(22)
        self.servo_enable.on()
        self.servo = AngularServo(17, min_angle=self.MIN_ANGLE, max_angle=self.MAX_ANGLE, min_pulse_width=0.5 / 1000, max_pulse_width=2.5 / 1000, pin_factory=PiGPIOFactory())
        self.servo.mid()
        self.pump1 = LED(27)
        self.pump2 = LED(5)

        # MCP
        self.spi = busio.SPI(clock=board.SCK, MISO=board.MISO, MOSI=board.MOSI)
        self.cs = digitalio.DigitalInOut(board.D22)
        self.mcp = MCP.MCP3008(self.spi, self.cs)

        self.moisture1 = AnalogIn(self.mcp, MCP.P0)
        self.moisture2 = AnalogIn(self.mcp, MCP.P2)
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
        self.gpios = [17, 18, 19, 20]
        self.selected_channel = 1
        self.selected_plant_id = ""

    def get_camera(self: "Sensors") -> PiCamera:
        return self.camera

    def get_gpios(self: "Sensors") -> List[int]:
        return self.gpios

    def get_selected_channel(self: "Sensors") -> int:
        return self.selected_channel

    def get_selected_plant_id(self: "Sensors") -> str:
        return self.selected_plant_id

    def set_selected_plant(self: "Sensors", plant_id: str, channel: int) -> None:
        self.selected_channel = channel
        self.selected_plant_id = plant_id

    def get_temperature(self: "Sensors") -> float:
        return self.sense.get_temperature()

    def get_humidity(self: "Sensors") -> float:
        return self.sense.get_humidity()

    def set_sense_mat(self: "Sensors", mat: List[List[int]]) -> None:
        self.sense.set_pixels(mat)

    def get_soil_moisture(self: "Sensors", channel: int) -> float:
        # return 1 - self.channel[channel]["moisture"].value / MAX_16B
        return read_sensor(self.channel[channel]["mean"])

    def get_water_level(self: "Sensors") -> float:
        # return self.water_level.voltage
        return read_sensor(self.water_mean)

    def set_water_mean(self: "Sensors", mean: float) -> None:
        self.water_mean = mean

    def set_moisture_mean(self: "Sensors", mean: float, channel: int) -> None:
        self.channel[channel]["mean"] = mean

    def turn_servo(self: "Sensors", angle: float) -> None:
        if (angle > self.MAX_ANGLE or angle < self.MIN_ANGLE):
            return

        self.servo.angle = angle

    def turn_on_pump(self: "Sensors", channel: int) -> None:
        self.servo_enable.off()
        sleep(1)
        self.channel[channel]["pump"].on()

    def turn_off_pump(self: "Sensors", channel: int) -> None:
        self.channel[channel]["pump"].off()
        sleep(1)
        self.servo_enable.on()

    def cleanup(self: "Sensors") -> None:
        self.camera.stop_preview()
        self.camera.close()
        self.sense.clear()
        self.servo.close()
        self.servo_enable.close()
        self.pump1.close()
        self.pump2.close()


if __name__ == "__main__":
    sensors = Sensors()
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

    sensors.turn_on_pump(1)
    sleep(0.5)
    sensors.turn_off_pump(1)
    sleep(0.5)

    sensors.turn_on_pump(2)
    sleep(0.5)
    sensors.turn_off_pump(2)
    sleep(0.5)

    sensors.cleanup()
