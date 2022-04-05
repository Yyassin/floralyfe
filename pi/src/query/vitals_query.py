from typing import Dict, Any
from query.query import get_gql_request


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