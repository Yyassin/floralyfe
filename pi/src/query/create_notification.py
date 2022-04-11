"""
create_notification.py
=======================
GraphQL mutation to create and
store a notification on the cloud database.
"""

__author__ = "abdalla"

from typing import Dict, Any
from query.query import get_gql_request


def create_notification(variables: Dict[str, Any]) -> Dict[str, Any]:
    """
    Makes a GraphQL request to create a notification with the specified
    parameters. Returns the response.

    :param variables: Dict[str, Any], the query variables.
    """
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
