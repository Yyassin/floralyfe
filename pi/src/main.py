import sys
from typing import Any
from queue import Queue
from camera_system import CameraSystem
from irrigation_system import IrrigationSystem
from ws import WSReceiver


def main() -> None:
    # Creates shared worker queues
    camera_task_queue = Queue()             # type: Queue[Any]
    irrigation_task_queue = Queue()         # type: Queue[Any]

    queues = {
        "camera-topic": camera_task_queue,
        "irrigation-topic": irrigation_task_queue
    }

    # Instantiate modules
    camera_system = CameraSystem.CameraSystem(camera_task_queue)
    irrigation_system = IrrigationSystem.IrrigationSystem(irrigation_task_queue)
    ws_receiver = WSReceiver(queues)

    try:
        camera_system.run()
        irrigation_system.run()
        ws_receiver.run()

        # probably not great
        assert ws_receiver.wss_thread is not None
        while ws_receiver.wss_thread.is_alive():        # exits if socket connection fails
            ws_receiver.wss_thread.join(1)
    except (KeyboardInterrupt, SystemExit):
        # cleanup here
        sys.exit()


if __name__ == "__main__":
    main()
