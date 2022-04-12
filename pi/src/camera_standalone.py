"""
    camera_standalone.py
    ========================
    Any standalone testing with the CameraSystem class
    should be performed here to satisfy the import structure and entrypoint
    (i.e keeping src as root so imports keep working).

    * This is an example template for standalone module testing in general.
"""

__author__ = "yousef"

from camera_system import CameraSystem


def main() -> None:
    camera = CameraSystem.CameraSystem(None)    # type: ignore
    camera.test_function()


if __name__ == "__main__":
    main()
