from database import db, User, Photos, Plant, Device
import json

from peewee import CharField

plantIns = Plant()
photoIns = Photos()


userID = 'userIDOne'
email = 'userIDDone@gmail.com'
password = 'passOne'

photoID = 'photoId'
picture = 'fsdkjfhsdjfhsdhfdsf'
plantID = 'mxb'
createdAt = 'tuesdaythefourth'

registeredPlant = 'regPlant'
angle = 45
registeredChannel = 1
optima_dict = {"temperature": 20.0, "humidity": 19, "moisture": 33}
optima = json.dumps(optima_dict)
optima_string = json.dumps(optima_dict)

deviceID = 'deviecIdtwo'
sensehat_icon = 'MOISTURE'


def write_users() -> None:
    User.create(userID=userID, email=email, password=password)
    print("[USER WRITING]:", userID, email, password)


def write_photos() -> None:
    Photos.create(photoID=photoID, picture=picture, plantID=plantID, createdAt=createdAt)
    print("[PHOTOS WRITING]:", photoID, picture, plantID, createdAt)


def write_plant() -> None:
    Plant.create(registeredPlant=registeredPlant, optima=optima_string, angle=angle, registeredChannel=registeredChannel)
    print("[PLANT WRITING]:", registeredPlant, optima, angle, registeredChannel)


def write_device() -> None:
    Device.create(deviceID=deviceID, sensehat_icon=sensehat_icon)
    print("[DEVICE WRITING]:", deviceID, sensehat_icon)


# def write_to_db() -> None:
#    User.create(userID='userIDOne', email='userIDDone@gmail.com', password='passOne')
#    Photos.create(photoID='photoId', picture='fsdkjfhsdjfhsdhfdsf', plantID='mxb', createdAt='tuesdaythefourth')
#    Plant.create(registeredPlant='regPlant', optima=optima_string, angle=45, registeredChannel=1)
#    Device.create(deviceID='deviecIdtwo', sensehat_icon='MOISTURE')


def read_users() -> None:
    assert User.get(User.userID == userID)
    assert User.get(User.email == email)
    assert User.get(User.password == password)
    for user in User.select():
        print("[USER READING]:", user.userID, user.email, user.password)


def read_photos() -> None:
    assert Photos.get(Photos.photoID == photoID)
    assert Photos.get(Photos.picture == picture)
    assert Photos.get(Photos.plantID == plantID)
    assert Photos.get(Photos.createdAt == createdAt)
    for photo in Photos.select():
        print("[PHOTOS READING]:", photo.photoID, photo.picture, photo.plantID, photo.createdAt)


def read_photos_from_ID(id: CharField) -> None:
    photoIns.getByPlantID(id)  # type: ignore


def read_plant() -> None:
    assert Plant.get(Plant.registeredPlant == registeredPlant)
    assert Plant.get(Plant.optima == optima)
    assert Plant.get(Plant.angle == angle)
    assert Plant.get(Plant.registeredChannel == registeredChannel)
    for plant in Plant.select():
        print("[PLANT READING]:", plant.registeredPlant, plant.optima, plant.angle, plant.registeredChannel)


def read_plant_from_ID(id: CharField) -> None:
    plantIns.getByID(id)  # type: ignore


def read_device() -> None:
    assert Device.get(Device.deviceID == deviceID)
    assert Device.get(Device.sensehat_icon == sensehat_icon)
    for device in Device.select():
        print("[DEVICE READING]:", device.deviceID, device.sensehat_icon)


if __name__ == '__main__':
    db.connect()
    db.create_tables([User, Photos, Plant, Device])
    write_users()
    read_users()
    write_photos()
    read_photos()
    write_plant()
    read_plant()
    write_device()
    read_device()
#    write_to_db()
    read_plant_from_ID('mxb')  # type: ignore
    read_photos_from_ID('photoId')  # type: ignore
