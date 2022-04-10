import requests


def send_email(to: str, subject: str, text: str, html: str, path: str) -> bool:

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
