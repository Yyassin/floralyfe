"""
send_email.py
==============
Requests backend server endpoint
to send an email notification.
"""

__author__ = "yousef"

import requests


def send_email(to: str, subject: str, text: str, html: str, path: str) -> bool:
    """
    Sends an email to the specified recipient, with the specified subject and text.

    :param to: str, the recipient's email.
    :param subject: str, the email subject.
    :param text: str, the email text.
    :param html: str, the email text as formatted in html.
    :param path: str, the email API endpoint path.
    """
    request_msg = {
        "email": {
            "to": to,
            "subject": subject,
            "text": text,
            "html": html
        }
    }

    response = requests.post(path, json=request_msg)
    return response.status_code == 200
