import platform

IS_WINDOWS = platform.uname().system == "Windows"
IS_RPI = not IS_WINDOWS and platform.machine() == "armv7l"  # not great but works for our purposes
