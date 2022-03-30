from peewee import SqliteDatabase, Model, CharField, IntegerField

db = SqliteDatabase('local_databaseFlora.db')


class localPlantDB(Model):
    class Meta:
        database = db


class User (localPlantDB):
    userID = CharField(unique=True)
    email = CharField(unique=True)
    password = CharField(unique=True)


class Photos (localPlantDB):
    photoID = CharField(unique=True)
    picture = CharField(unique=True)
    plantID = CharField(unique=True)
    createdAt = CharField(unique=True)

    def getByPlantID(self, plantID: CharField) -> None:
        photo = Photos.select().where(Photos.plantID == plantID)
        for photo in Photos.select():
            print("[READING PHOTOS FROM ID]:", photo.photoID, photo.picture, photo.plantID, photo.createdAt)


class Plant (localPlantDB):
    registeredPlant = CharField(unique=True)
    optima = CharField(unique=True)
    angle = IntegerField(unique=True)
    registeredChannel = IntegerField(unique=True)

    def getByID(self, id: CharField) -> None:
        plant = Plant.select().where(Plant.registeredPlant == id)
        for plant in Plant.select():
            print("[READING PLANT FROM ID]:", plant.registeredPlant, plant.optima, plant.angle, plant.registeredChannel)


class Device (localPlantDB):
    deviceID = CharField(unique=True)
    sensehat_icon = CharField(unique=True)
