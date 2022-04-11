"""
database.py
============
SQLite database wrapper and helper. Creates four
tables: User, Photos, Plant and Device and provides
the according accessors from Model parent class.
"""

__author__ = "zakariyya"

from peewee import SqliteDatabase, Model, CharField, IntegerField

# Create the database
db = SqliteDatabase('local_databaseFlora.db')


# Create the root model
# Visit peewee documentation to see accessor syntax
class localPlantDB(Model):                  # type: ignore
    class Meta:
        database = db


# The user model
class User (localPlantDB):
    userID = CharField()
    deviceID = CharField()
    email = CharField()
    password = CharField()


# The Plant Photo model
class Photos (localPlantDB):
    photoID = CharField()
    picture = CharField()
    plantID = CharField()
    createdAt = CharField()

    # Specific plant-id filter accessor
    def getByPlantID(self, plantID: CharField) -> None:
        photo = Photos.select().where(Photos.plantID == plantID)
        for photo in Photos.select():
            print("[READING PHOTOS FROM ID]:", photo.photoID, photo.picture, photo.plantID, photo.createdAt)


# Plant model
class Plant (localPlantDB):
    plantID = CharField()
    optima = CharField()
    angle = IntegerField()
    registeredChannel = IntegerField()

    # Specific id filter accessor.
    def getByID(self, id: CharField) -> None:
        plant = Plant.select().where(Plant.plantID == id)
        for plant in Plant.select():
            print("[READING PLANT FROM ID]:", plant.plantID, plant.optima, plant.angle, plant.registeredChannel)


# Device model (for meta data)
class Device (localPlantDB):
    deviceID = CharField()
    sensehat_icon = CharField()
