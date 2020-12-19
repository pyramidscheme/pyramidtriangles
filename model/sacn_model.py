"""
Model to communicate with Devices listening for sACN DMX data

Pixels are representations of the addressable unit in your object. Cells can have multiple pixels in this model only
have one LED each.
"""
from __future__ import annotations
import logging
from collections.abc import Iterable
import sacn

from .base import allocate_universes, DisplayColor, Model
from grid import Address, Cell

logger = logging.getLogger("pyramidtriangles")


class sACN(Model):
    def __init__(self, bind_address: str, brightness: float = 1.0):
        self.brightness = brightness
        self.sender = sacn.sACNsender(
            bind_address=bind_address,
            universeDiscovery=False,
        )

        self.leds = []

    def activate(self, cells: Iterable[Cell]):
        self.sender.start()
 
        # dictionary which will hold an array of 512 ints for each universe, universes are keys to the arrays.
        self.leds = allocate_universes(cells)
        for universe_index in sorted(self.leds):
            logger.info('Activating sACN universe %d (%d channels)',
                        universe_index, len(self.leds[universe_index]))
            self.sender.activate_output(universe_index)
            self.sender[universe_index].multicast = True

    def stop(self):
        for universe_index in self.leds:
            self.sender.deactivate_output(universe_index)
        self.sender.stop()

    def __del__(self):
        self.stop()

    def set(self, cell: Cell, addr: Address, color: DisplayColor):
        color = color.scale(self.brightness)
        try:
            channels = self.leds[addr.universe.id]
        except KeyError:
            raise IndexError(
                f'attempt to set channel in undefined universe {addr.universe.id}')

        # our Color tuples have their channels in the same order as sACN
        for i, c in enumerate(color.rgbw256):
            try:
                channels[addr.offset + i] = c
            except IndexError:
                raise IndexError(
                    f'internal error in sACN model; failed to assign to universe {addr.universe.id}, address {addr.offset}')

    def go(self):
        for ux in self.leds:
            for v in self.leds[ux]:
                if not 0 <= v < 256:
                    raise ValueError(f"bad led value '{v}'")
            self.sender[ux].dmx_data = self.leds[ux]
