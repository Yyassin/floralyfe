"""
vitals_query.py
=======================
GraphQL mutation to create and
store a vital on the cloud database.
"""

__author__ = "abdalla"

from typing import Dict, Any
from query.query import get_gql_request


def create_vital(variables: Dict[str, Any]) -> Dict[str, Any]:
    """
    Makes a GraphQL request to create a vital with the specified
    parameters. Returns the response.

    :param variables: Dict[str, Any], the query variables.
    """
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
