from query.send_email import send_email
from query.create_notification import create_notification
from enum import Enum
from time import sleep
from config import config
from Sensors import Sensors     # type: ignore
from util.Logger import Logger
from database import Plant
import schedule

EMAIL_USER = "floralyfenotif@gmail.com"
EMAIL_PASS = "floralyfePass"


class IrrigationStates(Enum):
    IDLE = 1
    CHECK_MOISTURE = 2
    CHECK_WATER_LEVEL = 3
    WATER_PLANT = 4
    WAIT = 5
    NOTIFY_USER = 6


class IrrigationSubsystem:

    def __init__(self: "IrrigationSubsystem", index: int, sensors: Sensors, userEmail: str, deviceID: str, test: bool) -> None:
        self.sensors = sensors
        self.email = userEmail
        self.index = index
        self.deviceID = deviceID

        self.channel = -1
        self.threshold = -1

        if (test):
            self.waitTimes = {
                "IDLE": 5,
                "pumpON": 0.5,
                "wait": 5
            }
        else:
            self.waitTimes = {
                "IDLE": 3600,
                "pumpON": 5,
                "wait": 120
            }

        self.state = IrrigationStates.IDLE
        self.override = False

        self.logger = Logger(f"PlantMonitor {index}")

    def get_state(self: "IrrigationSubsystem") -> IrrigationStates:
        return self.state

    def set_state_idle(self: "IrrigationSubsystem") -> None:
        self.state = IrrigationStates.IDLE

    def idle(self: "IrrigationSubsystem") -> None:
        self.logger.debug("State: IDLE")

    def check_moisture(self: "IrrigationSubsystem") -> None:
        self.logger.debug("State: CHECK_MOISTURE")

        try:
            plants = list(Plant.select())
        except Exception as e:
            self.logger.debug(f"No plants registered: {e}")
            self.state = IrrigationStates.IDLE
            return None

        if (len(plants) < self.index + 1):
            self.logger.debug("No plants registered for this thread")
            self.state = IrrigationStates.IDLE
            return None

        plant = plants[self.index]
        self.channel = plant.registeredChannel
        self.threshold = eval(plant.optima)['soilMoisture']

        moisturePrecentage = self.sensors.get_soil_moisture(self.channel)

        self.logger.debug(f"Monitor plant id: {plant.id}")
        self.logger.debug(f"Moisture%: {moisturePrecentage}, thresh: {self.threshold}")

        if (moisturePrecentage < self.threshold):
            self.state = IrrigationStates.CHECK_WATER_LEVEL
        else:
            self.set_state_idle()

    def check_water_level(self: "IrrigationSubsystem") -> None:
        self.logger.debug("State: CHECK_WATER_LEVEL")

        if (self.sensors.get_water_level() < 0.5):
            self.state = IrrigationStates.NOTIFY_USER
        else:
            self.state = IrrigationStates.WATER_PLANT

    def water_plant(self: "IrrigationSubsystem") -> None:
        self.logger.debug("State: WATER_PLANT")

        self.sensors.turn_on_pump(self.channel)
        self.logger.debug("Pump on")

        sleep(self.waitTimes["pumpON"])

        self.logger.debug("Pump off")
        self.sensors.turn_off_pump(self.channel)

        type = "WATER_EVENT"
        create_notification({
            "label": type,
            "type": type,
            "plantID": self.sensors.get_selected_plant_id(),
            "deviceID": self.deviceID
        })

        self.state = IrrigationStates.WAIT

    def wait(self: "IrrigationSubsystem") -> None:
        self.logger.debug("State: WAIT")

        timer = 0.0
        while (timer < self.waitTimes["wait"]):
            sleep(0.1)
            timer += 0.1

        self.state = IrrigationStates.CHECK_MOISTURE

    def notify_user(self: "IrrigationSubsystem") -> None:
        self.logger.debug("State: NOTIFY_USER")

        email_msg = """
            Please fill up the water tank for the system to resume
        """

        send_email(
            self.email,
            "Floralyfe: Water Tank Low",
            email_msg,
            f"<b> {email_msg} </b>",
            f"{config.API_SERVER}/notification/sendEmail"
        )

        self.logger.debug("Email Sent")

        type = "WATER_LEVEL"
        create_notification({
            "label": type,
            "type": type,
            "plantID": self.sensors.get_selected_plant_id(),
            "deviceID": self.deviceID
        })

        self.state = IrrigationStates.IDLE

    def execute(self: "IrrigationSubsystem") -> None:
        StateOperation = {
            IrrigationStates.IDLE: self.idle,
            IrrigationStates.CHECK_MOISTURE: self.check_moisture,
            IrrigationStates.CHECK_WATER_LEVEL: self.check_water_level,
            IrrigationStates.WATER_PLANT: self.water_plant,
            IrrigationStates.WAIT: self.wait,
            IrrigationStates.NOTIFY_USER: self.notify_user
        }

        if (self.override):
            self.state = IrrigationStates.CHECK_WATER_LEVEL
            self.override = False

        StateOperation.get(self.state, self.set_state_idle)()

    def start_state_machine(self: "IrrigationSubsystem") -> None:
        self.state = IrrigationStates.CHECK_MOISTURE

    def main(self: "IrrigationSubsystem") -> None:
        schedule.every(30).seconds.do(self.start_state_machine)
        while(True):
            self.execute()
            schedule.run_pending()
            sleep(1)
