import platform

IS_WINDOWS = platform.uname().system == "Windows"
IS_RPI = not IS_WINDOWS  # not great but works for our purposes
