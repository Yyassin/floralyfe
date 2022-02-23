import logging
import logging.config
from colorama import Fore, Style    # type: ignore
from typing import Any


class Logger():
    def __init__(self, name: str):
        self.logger = logging.getLogger(name)
        self.name = name
        logging.config.fileConfig(fname='util/logger.conf', disable_existing_loggers=False)

    def _format_message(self, msg: str) -> str:
        return Style.BRIGHT + f"[{self.name}] {msg}" + Style.RESET_ALL

    def error(self, msg: str, *args: Any) -> None:
        logging.error(Fore.RED + self._format_message(msg), *args)

    def warn(self, msg: str, *args: Any) -> None:
        logging.warning(Fore.YELLOW + self._format_message(msg), *args)

    def debug(self, msg: str, *args: Any) -> None:
        logging.debug(Fore.GREEN + self._format_message(msg), *args)
