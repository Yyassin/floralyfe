from typing import Any
from enum import Enum
from time import sleep
from util.Logger import Logger

logger = Logger("Irregation Subsystem")


class IrregationStates(Enum):
    IDLE = 1
    CHECK_MOISTURE = 2
    CHECK_WATER_LEVEL = 3
    WATER_PLANT = 4
    WAIT = 5
    NOTIFY_USER = 6


class IrregationSubsystem:

    def __init__(self, moisture_pin: Any, water_pin: Any, pump_pin: Any, notify_pin: Any, threshold: float) -> None:
        self.moisture_sensor = moisture_pin
        self.water_sensor = water_pin
        self.pump = pump_pin
        self.notify = notify_pin
        self.threshold = threshold

        self.state = IrregationStates.IDLE

    def getState(self) -> IrregationStates:
        return self.state

    def setState_IDLE(self) -> None:
        self.state = IrregationStates.IDLE

    def idle(self) -> None:
        logger.debug("State: IDLE")

        sleep(5)

        self.state = IrregationStates.CHECK_MOISTURE

    def check_moisture(self) -> None:
        logger.debug("State: CHECK_MOISTURE")

        if (self.moisture_sensor.value < self.threshold):
            self.state = IrregationStates.CHECK_WATER_LEVEL
        else:
            self.setState_IDLE()

    def check_water_level(self) -> None:
        logger.debug("State: CHECK_WATER_LEVEL")

        if (self.water_sensor.value < self.threshold):
            self.state = IrregationStates.NOTIFY_USER
        else:
            self.state = IrregationStates.WATER_PLANT

    def water_plant(self) -> None:
        logger.debug("State: WATER_PLANT")

        self.pump.toggle()
        logger.debug("Pump on")
        sleep(3)
        logger.debug("Pump off")
        self.pump.toggle()

        self.state = IrregationStates.WAIT

    def wait(self) -> None:
        logger.debug("State: WAIT")

        sleep(1)

        self.state = IrregationStates.CHECK_MOISTURE

    def notify_user(self) -> None:
        logger.debug("State: NOTIFY_USER")

        self.notify.toggle()
        logger.debug("Email Sent")
        sleep(1)
        self.notify.toggle()

        self.state = IrregationStates.IDLE

    def execute(self) -> None:
        StateOperation = {
            IrregationStates.IDLE: self.idle,
            IrregationStates.CHECK_MOISTURE: self.check_moisture,
            IrregationStates.CHECK_WATER_LEVEL: self.check_water_level,
            IrregationStates.WATER_PLANT: self.water_plant,
            IrregationStates.WAIT: self.wait,
            IrregationStates.NOTIFY_USER: self.notify_user
        }

        StateOperation.get(self.state, self.setState_IDLE)()
