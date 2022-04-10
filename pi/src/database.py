from peewee import SqliteDatabase, Model, CharField, IntegerField

db = SqliteDatabase('local_databaseFlora.db')


class localPlantDB(Model):                  # type: ignore
    class Meta:
        database = db


class User (localPlantDB):
    userID = CharField()
    deviceID = CharField()
    email = CharField()
    password = CharField()


class Photos (localPlantDB):
    photoID = CharField()
    picture = CharField()
    plantID = CharField()
    createdAt = CharField()

    def getByPlantID(self, plantID: CharField) -> None:
        photo = Photos.select().where(Photos.plantID == plantID)
        for photo in Photos.select():
            print("[READING PHOTOS FROM ID]:", photo.photoID, photo.picture, photo.plantID, photo.createdAt)


class Plant (localPlantDB):
    plantID = CharField()
    optima = CharField()
    angle = IntegerField()
    registeredChannel = IntegerField()

    def getByID(self, id: CharField) -> None:
        plant = Plant.select().where(Plant.plantID == id)
        for plant in Plant.select():
            print("[READING PLANT FROM ID]:", plant.plantID, plant.optima, plant.angle, plant.registeredChannel)


class Device (localPlantDB):
    deviceID = CharField()
    sensehat_icon = CharField()
