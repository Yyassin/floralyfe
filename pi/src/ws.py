"""
ws.py
======
Websocket Receiver
"""

__author__ = "yousef"

# Documentation: https://github.com/websocket-client/websocket-client/blob/master/websocket/_app.py
# Missing py.typed marker.
import websocket    # type: ignore
import json
import threading
from queue import Queue
from typing import Any, Dict, cast
from util import Logger, Singleton


class WSReceiver(Singleton.Singleton):
    """
        WebSocket Receiver API

        A threaded instance that connects and listens to the specified
        socket. Specified callbacks are invoked on according message topics being
        received.
    """

    def __init__(self: "WSReceiver", queues: "Dict[str, Queue[Any]]", url: str, subscription_id: str) -> None:
        """
            Initializes a new WSReceiver with the specified parameters.

            :param queues: Dict[str, Queue[Any]], map from message topic to queue listening for that message.
            :param url: str, the socket url to listen to.
            :param subscription_id: str, the id to subscribe to.
        """
        self.queues = queues
        self.logger = Logger.Logger(type(self).__name__)

        # Consider: more callbacks like this if needed
        # self.callbacks = {
        #     key: lambda msg: queues[key].put(msg) for key in queues
        # }

        self.url = url
        self.subscription_id = subscription_id
        self.ws = None
        self.wss_thread = None
        self.init_socket()

    def init_socket(self: "WSReceiver") -> None:
        """
            Initializes the websocket listener thread
            and its callback methods.
        """
        self.ws = websocket.WebSocketApp(
            self.url,
            on_open=self.on_open,
            on_message=self.on_message,
            on_close=self.on_close,
        )

        assert self.ws is not None
        self.wss_thread = threading.Thread(target=lambda: self.ws.run_forever())
        self.wss_thread.daemon = True

    def process_message(self: "WSReceiver", message: Dict[str, Any]) -> None:
        """
            Processes the specified message. Usually this means routing
            the message to the queue that's listening for it, if any.
        """
        topic = message.get("topic", None)                                  # Extract the message topic

        if topic is None:
            self.logger.debug(f"Got message with no topic: {message}")      # Abort if there isn't one
            return

        self.logger.debug(f"WSReceiver: Got {topic}")
        queue = self.queues.get(topic)                                      # Otherwise, send it to the listener queue, if any.
        if queue:
            queue.put(message)

    def on_open(self: "WSReceiver", ws: "websocket.WebsocketApp") -> None:
        """
            Websocket on_open callback - invoked on connection
            creation. Immediately subscribes to the subscription id.
        """
        self.logger.debug(f"Connected to WebSocket@{ws.url}")
        subscription_msg = {
            "topic": "subscribe",
            "payload": {
                "deviceID": self.subscription_id,  # only want to listen to this device
            },
        }

        assert self.ws is not None
        self.ws.send(json.dumps(subscription_msg))

    def on_message(self: "WSReceiver", ws: "websocket.WebsocketApp", message: Any) -> None:
        """
            Websocket on_message callback - invoked on message
            received. Parses the message to json and processes it.
        """
        try:
            message = eval(message)
            if not isinstance(message, dict):
                message = json.loads(message)
        except ValueError:
            self.logger.debug("Error loading json.")
        except SyntaxError:
            pass

        if (isinstance(message, dict)):
            self.process_message(cast(Dict[str, Any], message))

    def on_close(self: "WSReceiver", ws: "websocket.WebsocketApp", close_status_code: int, close_msg: bytes) -> None:
        """
            Websocket on_close callback - invoked on connection
            close. Logs close status.
        """
        self.logger.debug(f"Closed connection. Status code: { str(close_status_code) }, Message: { str(close_msg) }")

    def run(self: "WSReceiver") -> None:
        """
            Starts the websocket listener thread.
        """
        assert self.wss_thread is not None
        self.wss_thread.start()

    def join(self: "WSReceiver", timeout: int) -> None:
        """
            Joins the listener thread to the calling thread.
        """
        assert self.wss_thread is not None
        self.wss_thread.join(timeout)
