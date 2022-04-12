"""
test_database.py
=================
Validates and unit tests the local peewee SQLite database.
"""

__author__ = "zakariyya"

from database import db, User, Photos, Plant, Device
import json
from util.Logger import Logger
from peewee import CharField

# Initialization and expected values.
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

logger = Logger("DataBase Test")


def write_users() -> None:
    """
    Tests writing a user to the database.
    """
    User.create(userID=userID, email=email, password=password)
    print("[USER WRITING]:", userID, email, password)

    logger.debug(f"Wrote user id: {userID}, email: {email}, password: {password}")


def write_photos() -> None:
    """
    Tests writing a photo to the database.
    """
    Photos.create(photoID=photoID, picture=picture, plantID=plantID, createdAt=createdAt)
    print("[PHOTOS WRITING]:", photoID, picture, plantID, createdAt)

    logger.debug(f"Wrote photo id: {photoID}, picture: {picture}, plant id: {plantID}, createdAt: {createdAt}")


def write_plant() -> None:
    """
    Tests writing a plant to the database.
    """
    Plant.create(registeredPlant=registeredPlant, optima=optima_string, angle=angle, registeredChannel=registeredChannel)
    print("[PLANT WRITING]:", registeredPlant, optima, angle, registeredChannel)

    logger.debug(f"Write plant registered: {registeredPlant}, optima: {optima},angle: {angle}, registered Channel: {registeredChannel}")


def write_device() -> None:
    """
    Tests writing a device meta to the database.
    """
    Device.create(deviceID=deviceID, sensehat_icon=sensehat_icon)
    print("[DEVICE WRITING]:", deviceID, sensehat_icon)

    logger.debug(f"Write device id: {deviceID}, sensehat icon: {sensehat_icon}")


def read_users() -> None:
    """
    Tests reading a user from the database.
    """
    user = User.get(User.userID == userID)
    assert user.userID == userID
    assert user.email == email
    assert user.password == password

    logger.debug(f"Got user id: {user.userID}, email: {user.email}, password: {user.password}")


def read_photos() -> None:
    """
    Tests reading photos from the database.
    """
    photos = Photos.get(Photos.photoID == photoID)
    assert photos.photoID == photoID
    assert photos.picture == picture
    assert photos.plantID == plantID
    assert photos.createdAt == createdAt

    logger.debug(f"Got photo id: {photos.photoID}, picture: {photos.picture}, plant id: {photos.plantID}, createdAt: {photos.createdAt}")


def read_photos_from_ID(id: CharField) -> None:
    """
    Tests reading photos by id.
    """
    photoIns.getByPlantID(id)


def read_plant() -> None:
    """
    Tests reading a plant from the database.
    """
    plant = Plant.get(Plant.registeredPlant == registeredPlant)
    assert plant.registeredPlant == registeredPlant
    assert plant.optima == optima
    assert plant.angle == angle
    assert plant.registeredChannel == registeredChannel

    logger.debug(f"Got plant registered: {plant.registeredPlant}, optima: {plant.optima},angle: {plant.angle}, registered Channel: {plant.registeredChannel}")


def read_plant_from_ID(id: CharField) -> None:
    """
    Tests reading plant by ID.
    """
    plantIns.getByID(id)


def read_device() -> None:
    """
    Tests reading a device meta from the database.
    """
    device = Device.get(Device.deviceID == deviceID)
    assert device.deviceID == deviceID
    assert device.sensehat_icon == sensehat_icon

    logger.debug(f"Got device id: {device.deviceID}, sensehat icon: {device.sensehat_icon}")


def main() -> None:
    """
    Runs all database unit tests.
    """
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
    read_plant_from_ID('mxb')
    read_photos_from_ID('photoId')
