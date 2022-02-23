import json
from queue import Queue
import threading
from typing import Any
# Missing py.typed marker
import websocket    # type: ignore


class WSReceiver:
    def __init__(self, queues: "dict[str, Queue[Any]]") -> None:
        self.queues = queues
        # These callbacks should be reserved for notifying other nodes,
        # they can then implement callbacks of their own
        # self.callbacks = {
        #     key: lambda msg: queues[key].put(msg) for key in queues
        # }

        self.SOCKET = "ws://localhost:4000"
        self.ws = None
        self.wss_thread = None
        self.init_socket()

    def init_socket(self) -> None:
        self.ws = websocket.WebSocketApp(
            self.SOCKET,
            on_open=self.on_open,
            on_message=self.on_message,
            on_close=self.on_close
        )

        assert self.ws is not None
        self.wss_thread = threading.Thread(target=lambda: self.ws.run_forever())
        self.wss_thread.daemon = True

    def process_message(self, message: dict[str, Any]) -> None:
        topic = message.get("topic", None)

        if topic is None:
            print("Got message with no topic:", message)
            return

        print("WSReceiver: Got", topic)
        queue = self.queues.get(topic)
        if queue:
            queue.put(message)

    def on_open(self, ws: "websocket.WebsocketApp") -> None:
        print(f"Connected to WebSocket@{self.SOCKET}")
        subscription_msg = {
            "topic": "subscribe",
            "payload": {
                "userID": "hello",
            },
        }

        assert self.ws is not None
        self.ws.send(json.dumps(subscription_msg))

    def on_message(self, ws: "websocket.WebsocketApp", message: Any) -> None:
        try:
            message = eval(message)
            if not type(message) is dict:
                message = json.loads(message)
        except ValueError:
            print("Error loading json.")

        self.process_message(message)

    def on_close(self, ws: "websocket.WebsocketApp") -> None:
        print("Closed connection.")

    def run(self) -> None:
        assert self.wss_thread is not None
        self.wss_thread.start()

    def join(self, timeout: int) -> None:
        assert self.wss_thread is not None
        self.wss_thread.join(timeout)
