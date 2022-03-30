import datetime
import time
from gpiozero import AngularServo
from database import Plant, Photos
from gpiozero.pins.pigpio import PiGPIOFactory
from peewee import CharField


class servoMotor:
    plantIns = Plant()
    photoIns = Photos()
    factory = PiGPIOFactory()

    today = datetime.datetime.today()

    s = AngularServo(17, min_angle=0, max_angle=180, min_pulse_width=0.5 / 1000, max_pulse_width=2.5 / 1000, pin_factory=factory)

    def initServo(self) -> None:
        self.s.angle = 0

    def turnToAngle(self, given_angle: int) -> None:
        self.s.angle = given_angle

    def turn_right(self) -> None:
        if int(self.s.angle) < 160:
            print(self.s.angle)
            self.s.angle = int(self.s.angle) + 20
            print(self.s.angle)

    def turn_left(self) -> None:
        if int(self.s.angle) > 20:
            print(self.s.angle)
            self.s.angle = int(self.s.angle) - 20
            print(self.s.angle)

    def take_day_pic(self) -> None:
        while True:
            now = datetime.datetime.today()
            if self.today.day != now.day:
                for plant in Plant.select():
                    self.s.angle = plant.angle
                    pic = "pictaken"  # code that takes a picture
                    time.sleep(5)
                    Photos.create(photoID="photoID", picture=pic, plantID="plantId2", createdAt=str(self.today.day))
                self.today = now
            time.sleep(1)

    def turn_to_plant(self, id: CharField) -> None:
        plant = Plant.get(Plant.plantID == id)
        self.s.angle = plant.angle
        print(self.s.angle)


if __name__ == '__main__':
    s = servoMotor()
    s.turn_right()
    time.sleep(2)
    # s.turnToAngle(100)
    # sleep(2)
    s.turn_left()
