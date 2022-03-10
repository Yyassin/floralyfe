# need to pip install requests

import config
from typing import Dict, Any, cast
import requests  # type: ignore
import pprint


def run_gql_request(query: str, variables: Dict[str, Any], path: str) -> Any:

    json = cast(Dict[str, Any], dict({'query': query}))
    if variables:
        json['variables'] = variables

    response = requests.post(path, json=json)
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception("Query failed to run: {} - {}".format(response.status_code, response.json()))


def get_gql_request(user_query: str, variables: Dict[str, Any]) -> Any:
    user_data = run_gql_request(user_query, variables, config.GRAPHQL_URL)

    pprint.pprint(user_data["data"])

    return user_data["data"]


def view_user(username: str) -> Dict[str, Any]:
    variables = {
        "username": username
    }

    user_query = """
    query view_user($username: String!){
        users(username: $username){
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
            updateAt
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


def update_vital(variables: Dict[str, Any]) -> bool:
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


def delete_vital(variables: Dict[str, Any]) -> bool:
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
            firstName
            lastName
            username
            email
            password
        }
    }
    """

    return get_gql_request(user_mutation, variables)


def update_user(variables: Dict[str, Any]) -> bool:
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


def create_note(variables: Dict[str, Any]) -> Dict[str, Any]:
    user_mutation = """
    mutation create_note ($title: String!, $text: String!, $plantID: String!){
        createNote(title: $title, text: $text, plantID: $plantID){
            title
            text
            plantID
        }
    }
    """

    return get_gql_request(user_mutation, variables)


def update_note(variables: Dict[str, Any]) -> bool:
    user_mutation = """
    mutation update_note ($id: ID!, $title: String, $text: String!){
        updateNote(id: $id, title: $title, text: $text)
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


def update_plant(variables: Dict[str, Any]) -> bool:
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


if __name__ == "__main__":
    print("hi")
