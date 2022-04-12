"""
ws.py
======
Websocket Receiver Class Implementation

A threaded instance that connects to and receives
messages from the specified WebSocket server. Processes
the message each time on is received and places the
contents into a specified listener queue (listening to
a specified message topic).
"""

__author__ = "yousef"

from threading import Thread
from typing import Any, Dict, cast
from queue import Queue
from json import dumps, loads
from util import Logger, Singleton
import time
import websocket


class WSClient(Singleton.Singleton):
    """
        WebSocket Receiver API

        A threaded instance that connects and listens to the specified
        socket on the specified subscription id. Reroutes all received
        messages to an associated listener queue.

        This is a singleton instance, only one should ever exist and
        be shared between classes.
    """

    def __init__(self: "WSClient", queues: "Dict[str, Queue[Any]]",
                 url: str, subscription_id: str, device_id: str) -> None:
        """
            Initializes a new WSReceiver with the specified parameters.

            :param queues: Dict[str, Queue[Any]], a map linking a
                           message-topic to the associated listener queue.
            :param url: str, the socket url to connect and listen to.
            :param subscription_id: str, the client id to subscribe to.

            >>> camera_task_queue = Queue()
            >>> queues = { "camera_topic": camera_task_queue }
            >>> ws_receiver = WSReceiver(queues, config.WS_URL, config.USER_ID)
        """
        self.queues = queues
        self.url = url
        self.subscription_id = subscription_id
        self.device_id = device_id
        self.logger = Logger.Logger(type(self).__name__)
        self.ping_thread = None
        self.ws = None                       # Empty websocket connection
        self.wss_thread = None               # Empty websocket listener thread
        self.init_socket()

    def init_socket(self: "WSClient") -> None:
        """
            Initializes the websocket listener thread
            and its callback methods for open, message
            and close events.
        """
        self.ws = websocket.WebSocketApp(
            self.url,
            on_open=self.on_open,
            on_message=self.on_message,
            on_close=self.on_close,
        )

        # If the initialization is successful, bind the socket
        # listener to a dedicated thread.
        assert self.ws is not None
        self.wss_thread = Thread(target=lambda: self.ws.run_forever())
        self.wss_thread.daemon = True

    def process_message(self: "WSClient", message: Dict[str, Any]) -> None:
        """
            Processes the specified message. This means routing
            the message to the queue that's listening for it (its topic),
            if any.

            :param message: Dict[str, Any] The received message (json)
                            to be routed to a listener queue.
        """
        topic = message.get("topic", None)       # Extract the message topic

        if topic is None:                        # Abort if there isn't a topic
            self.logger.debug(f"Got message with no topic: {message}")
            return

        self.logger.debug(f"WSReceiver: Got {topic}")
        queue = self.queues.get(topic)           # Otherwise, send it to the
        if queue:                                # associated listener queue.
            queue.put(message)
            self.logger.debug(f"Put in queue {topic}")

    def send(self: "WSClient", message: Dict[str, Any], topic: str) -> None:
        """
            Pushes the specified message on the web socket connection.

            :param message: The message (json) to push.
        """
        message["deviceID"] = self.device_id  # From db
        message["topic"] = topic
        if self.ws is not None:
            self.ws.send(dumps(message))

    def on_open(self: "WSClient", ws: "websocket.WebsocketApp") -> None:
        """
            Websocket on_open callback - invoked when the connection
            is established. Immediately subscribes to the instance
            subscription id.

            :param ws: websocket.WebsocketApp, the ws connection with
                       the on_open callback.

            *Note*: It may seem redundant to have ws as a parameter
            when we have it as an instance method but this is the
            documented callback interface.
        """
        self.logger.debug(f"Connected to WebSocket@{ws.url}")

        # Create the subscription message
        # We only want to listen to messages from subscription_id
        subscription_msg = {
            "topic": "subscribe",
            "payload": {
                "userID": self.subscription_id,
            },
        }

        assert self.ws is not None
        self.ws.send(dumps(subscription_msg))

    def on_message(self: "WSClient", ws: "websocket.WebsocketApp",
                   message: Any) -> None:
        """
            Websocket on_message callback - invoked on each message
            receive event. Parses the message from a json to python dictionary
            and processes it.

            :param ws: websocket.WebsocketApp, the ws connection with
                       the on_message callback.
            :param message: Any, the message that is received.

            *Note*: It may seem redundant to have ws as a parameter
            when we have it as an instance method but this is the documented
            callback interface.
        """
        # Ignore processing on heartbeat pings
        if (message == "heartbeat"):
            return

        # Parse the message from json to python dictionary. There's two
        # ways to decode depending on if the json was directly encoded or
        # stringified first.
        try:
            # Decode a stringified message json
            message = eval(message)
            if not isinstance(message, dict):
                # Load an encoded message if that doesn't work.
                message = loads(message)
        except ValueError:
            self.logger.debug("Error loading json.")
        except SyntaxError:
            pass

        # At this point, we should surely have a json
        # but assert before processing the message just in case.
        if (isinstance(message, dict)):
            self.process_message(cast(Dict[str, Any], message))

    def on_close(self: "WSClient", ws: "websocket.WebsocketApp",
                 close_status_code: int, close_msg: bytes) -> None:
        """
            Websocket on_close callback - invoked on connection
            close. Logs close status to shell.

            :param ws: websocket.WebsocketApp, the ws connection
                       with the on_close callback.
            :param close_status_code: int, the status code returned
                                      by the connection close event.
            :param close_msg: bytes, the message returned by the
                              connection close event.

            *Note*: It may seem redundant to have ws as a parameter
            when we have it as an instance method but this is the
            documented callback interface.
        """
        self.logger.debug(f"""Closed connection. Status code:
            { str(close_status_code) }, Message: { str(close_msg) }""")

    def ping(self: "WSClient") -> None:
        while True:
            self.send({"msg": "ping"}, "ping")
            time.sleep(10)

    def run(self: "WSClient") -> None:
        """
            Starts the websocket listener thread which
            makes the websocket app start listening.
        """
        assert self.wss_thread is not None
        self.wss_thread.start()
        time.sleep(5)
        self.ping_thread = Thread(target=self.ping, daemon=True)
        self.ping_thread.start()

    def join(self: "WSClient", timeout: int) -> None:
        """
            Joins the listener thread to the calling thread. Blocks
            the calling thread until the listener thread terminates
            or the specified timeout (ms) elapses.

            :param timeout: Time in ms to timeout for.
        """
        assert self.wss_thread is not None
        self.wss_thread.join(timeout)
