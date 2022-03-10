import graphql_requests


expected_vitals = {
    "soilMoisture": 41,
    "temperature": 40,
    "airHumidity": 46,
    "light": 47,
    "greenGrowth": 50,
    "plantID": "plantid",
    "deviceID": "deviceid"
}

expected_user = {
    "firstName": "justin",
    "lastName": "wang",
    "username": "justinwang",
    "email": "justinwang@gmail.com",
    "password": "qwerty"
}

expected_note = {
    "title": "title1",
    "text": "text1",
    "plantID": "plantidNote"
}

expected_plant = {
    "name": "name1",
    "species": "tulip",
    "cameraAngle": 45,
    "optima": {
        "humidity": 45,
        "soilMoisture": 40,
        "temperature": 20
    },
    "ownerID": "ownerid"
}


def test_create_vital() -> None:
    actual_vital = graphql_requests.create_vital(expected_vitals)
    assert "createVital" in actual_vital
    actual_vital = actual_vital["createVital"]

    for key in expected_vitals:
        if (key != "id" and key != "plantID" and key != "deviceID"):
            assert (expected_vitals[key] == actual_vital[key])

    print("Test Passed: Create Vital")


def test_view_vital() -> None:
    actual_vital = graphql_requests.view_vital("plantid")
    assert "createVital" in actual_vital
    actual_vital = actual_vital["createVital"]

    for key in expected_vitals:
        if (key != "id" and key != "plantID" and key != "deviceID"):
            assert (expected_vitals[key] == actual_vital[key])

    print("Test Passed: Create Vital")


def test_create_user() -> None:
    actual_user = graphql_requests.create_user(expected_user)
    assert "createUser" in actual_user
    actual_user = actual_user["createUser"]

    for key in expected_user:
        assert (expected_user[key] == actual_user[key])

    print("Test Passed: Create User")


def test_view_user() -> None:
    actual_user = graphql_requests.view_user(expected_user["username"])
    assert "users" in actual_user
    actual_user = actual_user["users"]

    for key in expected_user:
        print(expected_user[key])
        print(actual_user[key])
        assert (expected_user[key] == actual_user[key])

    print("Test Passed: Create User")


def test_create_notes() -> None:
    actual_note = graphql_requests.create_note(expected_note)
    assert "createNote" in actual_note
    actual_note = actual_note["createNote"]

    for key in expected_note:
        if (key != "plantID"):
            assert (expected_note[key] == actual_note[key])

    print("Test Passed: Create Notes")


def test_view_notes() -> None:
    actual_note = graphql_requests.view_note(expected_note["plantID"])
    assert "createNote" in actual_note
    actual_note = actual_note["createNote"]

    for key in expected_note:
        if (key != "plantID"):
            assert (expected_note[key] == actual_note[key])

    print("Test Passed: Create Notes")


def test_create_plant() -> None:
    actual_plant = graphql_requests.create_plant(expected_plant)
    assert "createPlant" in actual_plant
    actual_plant = actual_plant["createPlant"]

    for key in expected_plant:
        if (key != "ownerID"):
            assert (expected_plant[key] == actual_plant[key])

    print("Test Passed: Create Plant")


def test_view_plant() -> None:
    actual_plant = graphql_requests.view_plant("ownerid")
    assert "createPlant" in actual_plant
    actual_plant = actual_plant["createPlant"]

    for key in expected_plant:
        if (key != "ownerID"):
            assert (expected_plant[key] == actual_plant[key])

    print("Test Passed: Create Plant")


def run_tests() -> None:
    test_create_user()
    test_view_user()

    test_create_vital()
    test_view_vital()

    test_create_notes()
    test_view_notes()

    test_create_plant()
    test_view_plant()


if __name__ == "__main__":
    run_tests()
