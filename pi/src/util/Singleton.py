"""
Singleton.py
=============
Singleton Abstract Class

Defines a class that can only be instantiated once.
"""
# Source: https://www.python.org/download/releases/2.2/descrintro/#__new__

__author__ = "yousef"

from typing import Type, Any


class Singleton(object):
    """
        Singleton

        Parent class to derive classes that can only be instantiated once.
    """
    def __new__(cls: Type["Singleton"], *args: Any, **kwds: Any) -> Any:
        """
            Instantiates a new class if one hasn't been instantiated already.
            Returns the existing instance otherwise.

            :param *args: Any, generic constructor arguments.
            :param **kwds: Any, generic constructor keywords.
            :returns: Any, the singleton instance.
        """
        it = cls.__dict__.get("__it__")
        if it is not None:
            return it
        cls.__it__ = it = object.__new__(cls)
        it.init(*args, **kwds)
        return it

    def init(self: "Singleton", *args: Any, **kwds: Any) -> None:
        """
            Creates a new singleton.

            :param *args: Any, generic constructor arguments.
            :param **kwds: Any, generic constructor keywords.
        """
        # Implemented by derived class. Calls __new__ implicitly.
        pass
