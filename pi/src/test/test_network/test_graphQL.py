"""
test_graphQL.py
=========================
Tests that the Pi can make
graphql quries and mutations.
"""

__author__ = "abdalla & zakariyya"

import sys
import graphql_requests


expected_vitals = {
    "soilMoisture": 41,
    "temperature": 40,
    "airHumidity": 46,
    "light": 47,
    "greenGrowth": 50,
    "plantID": "plantid1",
    "deviceID": "yousef-device"
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

expected_notification = {
    "label": "noti",
    "type": "noti",
    "plantID": "plant",
    "deviceID": "yousef-device"
}

expected_frontend_note = {
    "title": "frontend-title",
    "text": "frontend-text",
    "plantID": "frontend-id"
}

expected_frontend_user = {
    "firstName": "frontend-fN",
    "lastName": "frontend-lN",
    "username": "u-frontend",
    "email": "frontend@f.com",
    "password": "frontend"
}


def test_create_vital() -> None:
    actual_vital = graphql_requests.create_vital(expected_vitals)
    assert "createVital" in actual_vital
    actual_vital = actual_vital["createVital"]

    for key in expected_vitals:
        if (key != "id" and key != "plantID" and key != "deviceID"):
            assert (expected_vitals[key] == actual_vital[key]), graphql_requests.delete_vital(actual_vital["id"], actual_vital["deviceID"])

    print("Test Passed: Create Vital")


def test_view_vital() -> None:
    print(type(expected_vitals["plantID"]))
    actual_vital = graphql_requests.view_vital("plantid1")
    assert "vitals" in actual_vital
    actual_vital = actual_vital["vitals"][0]

    for key in expected_vitals:
        if (key != "id" and key != "plantID" and key != "deviceID"):
            assert (expected_vitals[key] == actual_vital[key]), graphql_requests.delete_vital(actual_vital["id"], actual_vital["deviceID"])

    print("Test Passed: View Vital")
    # graphql_requests.delete_vital(actual_vital["id"], actual_vital["deviceID"])


def test_create_user() -> None:
    actual_user = graphql_requests.create_user(expected_user)
    assert "createUser" in actual_user
    actual_user = actual_user["createUser"]

    for key in expected_user:
        assert (expected_user[key] == actual_user[key]), graphql_requests.delete_user(actual_user["id"])

    print("Test Passed: Create User")


def test_view_user() -> None:
    actual_user = graphql_requests.view_user(expected_user["username"])
    assert "users" in actual_user
    actual_user = actual_user["users"][0]

    for key in expected_user:
        assert (expected_user[key] == actual_user[key]), graphql_requests.delete_user(actual_user["id"])

    print("Test Passed: View User")
    # graphql_requests.delete_user(actual_user["id"])


def test_view_frontend_user() -> None:
    actual_user = graphql_requests.view_user(expected_frontend_user["username"])
    assert "users" in actual_user
    actual_user = actual_user["users"][0]

    for key in expected_frontend_user:
        assert (expected_frontend_user[key] == actual_user[key]), graphql_requests.delete_user(actual_user["id"])

    print("Test Passed: View Frontend User")
    # graphql_requests.delete_user(actual_user["id"])


def test_create_notes() -> None:
    actual_note = graphql_requests.create_note(expected_note)
    assert "createNote" in actual_note
    actual_note = actual_note["createNote"]

    for key in expected_note:
        if (key != "plantID"):
            assert (expected_note[key] == actual_note[key]), graphql_requests.delete_note(actual_note["id"])

    print("Test Passed: Create Notes")


def test_view_notes() -> None:
    actual_note = graphql_requests.view_note(expected_note["plantID"])
    assert "notes" in actual_note
    actual_note = actual_note["notes"][0]

    for key in expected_note:
        if (key != "plantID"):
            assert (expected_note[key] == actual_note[key]), graphql_requests.delete_note(actual_note["id"])

    print("Test Passed: View Notes")
    # graphql_requests.delete_note(actual_note["id"])


def test_view_frontend_notes() -> None:
    actual_note = graphql_requests.view_note(expected_frontend_note["plantID"])
    assert "notes" in actual_note
    actual_note = actual_note["notes"][0]

    for key in expected_frontend_note:
        if (key != "plantID"):
            assert (expected_frontend_note[key] == actual_note[key]), graphql_requests.delete_note(actual_note["id"])

    print("Test Passed: View Notes")
    # graphql_requests.delete_note(actual_note["id"])


def test_create_plant() -> None:
    actual_plant = graphql_requests.create_plant(expected_plant)
    assert "createPlant" in actual_plant
    actual_plant = actual_plant["createPlant"]

    for key in expected_plant:
        if (key != "ownerID"):
            assert (expected_plant[key] == actual_plant[key]), graphql_requests.delete_plant(actual_plant["id"])

    print("Test Passed: Create Plant")


def test_view_plant() -> None:
    actual_plant = graphql_requests.view_plant("ownerid")
    assert "plants" in actual_plant
    actual_plant = actual_plant["plants"][0]

    for key in expected_plant:
        if (key != "ownerID"):
            assert (expected_plant[key] == actual_plant[key]), graphql_requests.delete_plant(actual_plant["id"])

    print("Test Passed: View Plant")
    # graphql_requests.delete_plant(actual_plant["id"])


def test_create_notification() -> None:
    actual_notification = graphql_requests.create_notification(expected_notification)
    assert "createNotification" in actual_notification
    actual_notification = actual_notification["createNotification"]

    for key in expected_notification:
        if (key != "id" and key != "deviceID"):
            assert (expected_notification[key] == actual_notification[key]), graphql_requests.delete_notification(actual_notification["id"])

    print("Test Passed: Create Notification")


def test_view_notification() -> None:
    actual_notification = graphql_requests.view_notification(expected_notification["plantID"])
    assert "notification" in actual_notification
    actual_notification = actual_notification["notification"][0]

    for key in expected_notification:
        if (key != "id" and key != "deviceID"):
            assert (expected_notification[key] == actual_notification[key]), graphql_requests.delete_notification(actual_notification["id"])

    print("Test Passed: View Notification")
    # graphql_requests.delete_notification(actual_notification["id"])


def run_create_tests() -> None:
    test_create_user()
    test_create_plant()
    test_create_vital()
    test_create_notes()
    test_create_notification()


def run_view_tests() -> None:
    test_view_user()
    test_view_plant()
    test_view_vital()
    test_view_notes()
    test_view_notification()


def run_view_frontend_tests() -> None:
    test_view_frontend_notes()
    test_view_frontend_user()


if __name__ == "__main__":
    tests = {"f": run_view_frontend_tests, "c": run_create_tests, "v": run_view_tests}

    for command in sys.argv[1:]:
        tests[command]()
