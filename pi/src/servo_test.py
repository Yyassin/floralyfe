from gpiozero import AngularServo
from gpiozero.pins.pigpio import PiGPIOFactory
from time import sleep

myGPIO = 18
factory = PiGPIOFactory()
servo = AngularServo(17, min_angle=0, max_angle=180, min_pulse_width=0.5 / 1000, max_pulse_width=2.5 / 1000, pin_factory=factory)

while True:
    servo.mid()
    print("180")
    sleep(0.5)
    servo.angle = 180
    print("min")
    sleep(1)
    servo.mid()
    print("mid")
    sleep(0.5)
    servo.angle = 0
    print(0)
    sleep(1)
