from camera_system import CameraSystem


def main() -> None:
    camera = CameraSystem.CameraSystem(None)    # type: ignore
    camera.test_function()


if __name__ == "__main__":
    main()
