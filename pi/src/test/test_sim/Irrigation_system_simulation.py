"""
Irrigation_system_simulation.py
=========================
Graphical tkinter simulation
of the irrigation subsystem.
"""

__author__ = "abdalla"

from email.message import EmailMessage
from typing import Any
from enum import Enum
from time import sleep
import smtplib
from util.Logger import Logger

logger = Logger("Irregation Subsystem")
EMAIL_USER = "floralyfenotif@gmail.com"
EMAIL_PASS = "floralyfePass"


class IrregationStates(Enum):
    IDLE = 1
    CHECK_MOISTURE = 2
    CHECK_WATER_LEVEL = 3
    WATER_PLANT = 4
    WAIT = 5
    NOTIFY_USER = 6


class IrregationSubsystem:

    def __init__(self, moisture_pin: Any, water_pin: Any, pump_pin: Any, notify_pin: Any, threshold: float, test: bool) -> None:
        self.moisture_sensor = moisture_pin
        self.water_sensor = water_pin
        self.pump = pump_pin
        self.notify = notify_pin
        self.threshold = threshold

        if (test):
            self.waitTimes = {
                "IDLE": 5,
                "pumpON": 3,
                "wait": 2
            }
        else:
            self.waitTimes = {
                "IDLE": 60 * 60,
                "pumpON": 5,
                "wait": 2 * 60
            }

        self.msg = EmailMessage()
        self.msg["Subject"] = "FLORALYFE: Warning"
        self.msg["From"] = EMAIL_USER
        self.msg["To"] = "you.ayassin2@gmail.com"
        self.msg.set_content("Please fill up the water tank for the system to resume")

        self.state = IrregationStates.IDLE
        self.override = False

    def getState(self) -> IrregationStates:
        return self.state

    def setState_IDLE(self) -> None:
        self.state = IrregationStates.IDLE

    def idle(self) -> None:
        logger.debug("State: IDLE")

        timer = 0.0
        while (timer < self.waitTimes["IDLE"]):
            sleep(0.1)
            timer += 0.1

            if (self.override):
                self.state = IrregationStates.CHECK_WATER_LEVEL
                self.override = False
                return

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
        sleep(self.waitTimes["pumpON"])
        logger.debug("Pump off")
        self.pump.toggle()

        self.state = IrregationStates.WAIT

    def wait(self) -> None:
        logger.debug("State: WAIT")

        timer = 0.0
        while (timer < self.waitTimes["wait"]):
            sleep(0.1)
            timer += 0.1

            if (self.override):
                self.state = IrregationStates.CHECK_WATER_LEVEL
                self.override = False
                return

        self.state = IrregationStates.CHECK_MOISTURE

    def notify_user(self) -> None:
        logger.debug("State: NOTIFY_USER")

        self.notify.toggle()  # To be removed

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(EMAIL_USER, EMAIL_PASS)

            smtp.send_message(self.msg)

        logger.debug("Email Sent")

        self.notify.toggle()  # To be removed

        self.state = IrregationStates.IDLE

    def Override_pump(self) -> None:
        logger.debug("[Override Request] pump on")
        self.override = True

    def execute(self) -> None:
        StateOperation = {
            IrregationStates.IDLE: self.idle,
            IrregationStates.CHECK_MOISTURE: self.check_moisture,
            IrregationStates.CHECK_WATER_LEVEL: self.check_water_level,
            IrregationStates.WATER_PLANT: self.water_plant,
            IrregationStates.WAIT: self.wait,
            IrregationStates.NOTIFY_USER: self.notify_user
        }

        if (self.override):
            self.state = IrregationStates.CHECK_WATER_LEVEL
            self.override = False

        StateOperation.get(self.state, self.setState_IDLE)()
