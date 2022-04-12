"""
util.py
=========
Utility functions and defintitions.
"""

import platform

# Detects the machine we're running on.
IS_WINDOWS = platform.uname().system == "Windows"           # True if on windows
# True if linux, specifically for Pi (works for other things too probably
# but evaluates to false on github workflow machine which is what we need).
IS_RPI = not IS_WINDOWS and platform.machine() == "armv7l"
