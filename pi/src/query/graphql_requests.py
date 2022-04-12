"""
graphql_requests.py
=======================
GraphQL request helpers to send
queries and mutations with generic variables.
"""

__author__ = "abdalla"

import config.config as config
from typing import Dict, Any, cast
import requests
import pprint


def run_gql_request(query: str, variables: Dict[str, Any], path: str) -> Dict[str, Any]:
    """
    Requests the specified GraphQL query with the specified variables
    to the specified path.

    :param query: str, the GraphQL query.
    :param variables: Dict[str, Any], the query variables.
    :param path: str, the API endpoint.
    """
    json = cast(Dict[str, Any], dict({'query': query}))
    if variables:
        json['variables'] = variables

    response = requests.post(path, json=json)
    if response.status_code == 200:
        return cast(Dict[str, Any], response.json())    # All GQL responses are json (python dictionaries)
    else:
        raise Exception("Query failed to run: {} - {}".format(response.status_code, response.json()))


def get_gql_request(user_query: str, variables: Dict[str, Any]) -> Dict[str, Any]:
    """
    Helper to destructure graphQL request data, returns the destructured data.

    :param user_query: str, the GraphQL query.
    :param variables: Dict[str, Any], the query variables.
    """
    user_data = run_gql_request(user_query, variables, config.GRAPHQL_URL)

    pprint.pprint(user_data["data"])

    return cast(Dict[str, Any], user_data["data"])      # A user's data is another json (python dictionary)


# ==== A bunch of queries ==== #

def view_user(username: str) -> Dict[str, Any]:
    variables = {
        "username": username
    }

    user_query = """
    query view_user($username: String!){
        users(username: $username){
            id
            firstName
            lastName
            username
            email
            password
        }
    }
    """

    return get_gql_request(user_query, variables)


def view_vital(plantID: str) -> Dict[str, Any]:
    variables = {
        "plantID": plantID
    }

    user_query = """
    query view_vitals($plantID: ID!){
        vitals(plantID: $plantID){
            id
            soilMoisture
            temperature
            airHumidity
            light
            greenGrowth
            plantID
            createdAt
        }
    }
    """

    return get_gql_request(user_query, variables)


def view_note(plantID: str) -> Dict[str, Any]:
    variables = {
        "plantID": plantID
    }

    user_query = """
    query view_notes($plantID: ID!){
        notes(plantID: $plantID){
            id
            title
            text
            plantID
            updatedAt
        }
    }
    """

    return get_gql_request(user_query, variables)


def view_plant(ownerID: str) -> Dict[str, Any]:
    variables = {
        "ownerID": ownerID
    }

    user_query = """
    query view_plant($ownerID: String!) {
        plants(ownerID: $ownerID) {
            id
            name
            species
            cameraAngle
            optima {
                humidity
                soilMoisture
                temperature
            }
            ownerID
        }
    }
    """

    return get_gql_request(user_query, variables)


def create_vital(variables: Dict[str, Any]) -> Dict[str, Any]:
    user_mutation = """
    mutation create_vital ($soilMoisture: Float!,
                $temperature: Float!,
                $airHumidity: Float!,
                $light: Float!,
                $greenGrowth: Float!,
                $plantID: ID!,
                $deviceID: ID!) {
        createVital(soilMoisture: $soilMoisture,
                    temperature: $temperature,
                    airHumidity: $airHumidity,
                    light: $light,
                    greenGrowth: $greenGrowth,
                    plantID: $plantID,
                    deviceID: $deviceID){
        id
        soilMoisture
        temperature
        airHumidity
        light
        greenGrowth
        plantID
        createdAt
      }
    }
    """

    return get_gql_request(user_mutation, variables)


def update_vital(variables: Dict[str, Any]) -> Dict[str, bool]:
    user_mutation = """
    mutation update_vital ($id: ID!,
                            $soilMoisture: Float!,
                            $temperature: Float!,
                            $airHumidity: Float!,
                            $light: Float!,
                            $greenGrowth: Float!,
                            $plantID: ID!,
                            $deviceID: ID!) {
        updateVital(id: $id,
                    soilMoisture: $soilMoisture,
                    temperature: $temperature,
                    airHumidity: $airHumidity,
                    light: $light,
                    greenGrowth: $greenGrowth,
                    plantID: $plantID,
                    deviceID: $deviceID)
    }
    """

    return get_gql_request(user_mutation, variables)


def delete_vital(id: str, deviceID: str) -> Dict[str, bool]:
    variables = {
        "id": id,
        "deviceID": deviceID
    }

    user_mutation = """
    mutation delete_vital ($id: ID!, $deviceID: ID!) {
        deleteVital(id: $id, deviceID: $deviceID)
    }
    """

    return get_gql_request(user_mutation, variables)


def create_user(variables: Dict[str, Any]) -> Dict[str, Any]:
    user_mutation = """
    mutation create_user ($firstName: String!,
                            $lastName: String!,
                            $username: String!,
                            $email: String!,
                            $password: String!){
        createUser(firstName:$firstName,
                    lastName: $lastName,
                    username: $username,
                    email: $email,
                    password: $password){
            id
            firstName
            lastName
            username
            email
            password
        }
    }
    """

    return get_gql_request(user_mutation, variables)


def update_user(variables: Dict[str, Any]) -> Dict[str, bool]:
    user_mutation = """
    mutation update_user ($id: ID!,
                            $firstName: String!,
                            $lastName: String!,
                            $username: String!,
                            $email: String!,
                            $password: String!,
                            $avatar: String!,
                            $subscribedNotifications: Boolean,
                            $deviceID: String){
        updateUser(id: $id,
                    firstName:$firstName,
                    lastName: $lastName,
                    username: $username,
                    email: $email,
                    password: $password,
                    avatar: $avatar,
                    subscribedNotifications: $subscribedNotifications,
                    deviceID: $deviceID)
    }
    """

    return get_gql_request(user_mutation, variables)


def delete_user(id: str) -> Dict[str, bool]:
    variables = {
        "id": id
    }

    user_mutation = """
    mutation delete_user($id: ID!){
        deleteUser(id: $id)
    }
    """

    return get_gql_request(user_mutation, variables)


def create_note(variables: Dict[str, Any]) -> Dict[str, Any]:
    user_mutation = """
    mutation create_note ($title: String!, $text: String!, $plantID: String!){
        createNote(title: $title, text: $text, plantID: $plantID){
            id
            title
            text
            plantID
        }
    }
    """

    return get_gql_request(user_mutation, variables)


def update_note(variables: Dict[str, Any]) -> Dict[str, bool]:
    user_mutation = """
    mutation update_note ($id: ID!, $title: String, $text: String!){
        updateNote(id: $id, title: $title, text: $text)
    }
    """

    return get_gql_request(user_mutation, variables)


def delete_note(id: str) -> Dict[str, bool]:
    variables = {
        "id": id
    }

    user_mutation = """
    mutation delete_note($id: ID!){
        deleteNote(id: $id)
    }
    """

    return get_gql_request(user_mutation, variables)


def create_plant(variables: Dict[str, Any]) -> Dict[str, Any]:
    user_mutation = """
    mutation create_plant ($name: String!,
                            $species: String!,
                            $cameraAngle: Float!,
                            $optima: OptimaInput!,
                            $ownerID: ID!){
        createPlant(name: $name,
                    species: $species,
                    cameraAngle: $cameraAngle,
                    optima: $optima,
                    ownerID: $ownerID){
            id
            name
            species
            cameraAngle
            optima{
                temperature
                soilMoisture
                humidity
            }
            ownerID
        }
    }
    """

    return get_gql_request(user_mutation, variables)


def update_plant(variables: Dict[str, Any]) -> Dict[str, bool]:
    user_mutation = """
    mutation update_plant ($id: ID!,
                            $name: String!,
                            $species: String!,
                            $cameraAngle: Float!,
                            $optima: OptimaInput!){
        updatePlant(id: $id,
                    name: $name,
                    species: $species,
                    cameraAngle: $cameraAngle,
                    optima: $optima)
    }
    """

    return get_gql_request(user_mutation, variables)


def delete_plant(id: str) -> Dict[str, bool]:
    variables = {
        "id": id
    }

    user_mutation = """
    mutation delete_plant($id: ID!){
        deletePlant(id: $id)
    }
    """

    return get_gql_request(user_mutation, variables)


def view_notification(plantID: str) -> Dict[str, Any]:
    variables = {
        "plantID": plantID
    }

    user_query = """
    query view_notification($plantID: ID!){
        notification(plantID: $plantID){
            id
            label
            type
            plantID
        }
    }
    """

    return get_gql_request(user_query, variables)


def create_notification(variables: Dict[str, Any]) -> Dict[str, Any]:
    user_mutation = """
    mutation create_notification($label: String!,
                                    $type: String!,
                                    $plantID: ID!,
                                    $deviceID: ID!){
        createNotification(label: $label,
                            type: $type,
                            plantID: $plantID,
                            deviceID: $deviceID){
            id
            label
            type
            plantID
        }
    }
    """

    return get_gql_request(user_mutation, variables)


def delete_notification(id: str) -> Dict[str, bool]:
    variables = {
        "id": id
    }

    user_mutation = """
    mutation delete_notification($id: ID!){
        deleteNotification(id: $id)
    }
    """

    return get_gql_request(user_mutation, variables)


if __name__ == "__main__":
    print("hi")
