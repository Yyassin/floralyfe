"""
user_query.py
=======================
GraphQL queries to create and
update a user on the cloud database.
"""

__author__ = "abdalla"

from typing import Dict, Any
from query.query import get_gql_request


def login(email: str, password: str) -> Dict[str, Any]:
    """
    Authenticates a user with the specified credentials.

    :param email: str, the login email address.
    :param password: str, the login password.
    """
    variables = {
        "email": email,
        "password": password
    }

    user_query = """
    query view_user($email: String!, $password: String!){
        users(email: $email, password: $password){
            id
            firstName
            lastName
            username
            deviceID
            email
            password
        }
    }
    """

    return get_gql_request(user_query, variables)


def update_user(variables: Dict[str, Any]) -> Dict[str, bool]:
    """
    Updates the user according to the specified variables.

    :param variables: Dict[str, Any], the query variables.
    """
    user_mutation = """
    mutation update_user ($id: ID!,
                            $firstName: String,
                            $lastName: String,
                            $username: String,
                            $email: String,
                            $password: String,
                            $avatar: String,
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
