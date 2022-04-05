from typing import Dict, Any
from query.query import get_gql_request


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
