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

    # pprint.pprint(user_data["data"])

    return cast(Dict[str, Any], user_data["data"])      # A user's data is another json (python dictionary)
