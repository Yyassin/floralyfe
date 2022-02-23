"""
    Test physical outputs step by step / state machines here.
"""

from gpiozero import Device, OutputDevice       # type: ignore
from gpiozero.pins.mock import MockFactory      # type: ignore

Device.pin_factory = MockFactory()


def test_output_write_active_high(mock_factory: "MockFactory" = Device.pin_factory):
    pin = mock_factory.pin(2)
    with OutputDevice(2) as device:
        device.on()
        assert pin.state
        device.off()
        assert not pin.state
