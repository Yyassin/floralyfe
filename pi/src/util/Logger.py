"""
Logger.py
=========
Logging class to format and colour logs.
"""

__author__ = "yousef"

import logging
import logging.config
from colorama import Fore, Style
from typing import Any


class Logger():
    """
        Logger to facilitate logging across the application. Formats
        logs according to time, level and name.
    """

    def __init__(self: "Logger", name: str) -> None:
        """
            Initializes a new Logger.

            :param name: str, the logger's name (used in output).
        """
        self.logger = logging.getLogger(name)
        self.name = name
        # Load formating config. This path is relative to the root src/.
        logging.config.fileConfig(fname='util/logger.conf', disable_existing_loggers=False)

    def _format_message(self: "Logger", msg: str) -> str:
        """
            Formats a message to be bold and
            include this logger's name.

            v
            :returns: str, the formatted message.
        """
        return str(Style.BRIGHT + f"[{self.name}] {msg}" + Style.RESET_ALL)  # mypy cast

    def error(self: "Logger", msg: str, *args: Any) -> None:
        """
            Displays a red ERROR level log message.

            :param msg: str, the error message to log.
            :param *args: Any, formatting arguments.
        """
        logging.error(Fore.RED + self._format_message(msg), *args)

    def warn(self: "Logger", msg: str, *args: Any) -> None:
        """
            Displays a yellow WARNING level log message.

            :param msg: str, the warning message to log.
            :param *args: Any, formatting arguments.
        """
        logging.warning(Fore.YELLOW + self._format_message(msg), *args)

    def debug(self: "Logger", msg: str, *args: Any) -> None:
        """
            Displays a green DEBUG level log message.

            :param msg: str, the debug message to log.
            :param *args: Any, formatting arguments.
        """
        logging.debug(Fore.GREEN + self._format_message(msg), *args)
