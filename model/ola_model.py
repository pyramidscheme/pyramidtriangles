"""
Model to communicate with OLA
Based on ola_send_dmx.py

Pixels are representations of the addressable unit in your object. Cells can have multiple pixels in this model only
have one LED each.
"""
import array
import json
import ola

from .modelbase import ModelBase


class OLAModel(ModelBase):
    def __init__(self, max_dmx, model_json=None):
        # XXX any way to check if this is a valid connection?

        self.PIXEL_MAP = None
        self._map_leds(model_json)
        self.wrapper = ola.ClientWrapper()
        self.client = self.wrapper.Client()
        # Keys for LEDs are integers representing universes, each universe has an array of possible DMX channels
        # Pixels are an LED represented by 4 DMX addresses

        # initializing just 4 universes!!! Need to make this more configurable.
        self.leds = {
            0: [0] * max_dmx,
            1: [0] * max_dmx,
            2: [0] * max_dmx,
            3: [0] * max_dmx,
            4: [0] * max_dmx
        }

    def _map_leds(self, f):
        # Loads a json file with mapping info describing your leds.
        # The json file is formatted as a dictionary of numbers (as strings sadly, b/c json is weird
        # each key in the dict is a fixtureUID.
        # each array that fixtureUID returns is of the format [universeUID, DMXstart#]
        with open(f, 'r') as json_file:
            self.PIXEL_MAP = json.load(json_file, object_hook=lambda d: {int(k): v for (k, v) in d.items()})

    # Model basics
    def set_pixel(self, pixel, color, cellid=None):
        if pixel in self.PIXEL_MAP:
            ux = self.PIXEL_MAP[pixel][0] 
            ix = self.PIXEL_MAP[pixel][1] - 1  # dmx is 1-based, python lists are 0-based

            (r, g, b, w) = color.dmx
            self.leds[ux][ix]   = g
            self.leds[ux][ix+1] = r
            self.leds[ux][ix+2] = b
            self.leds[ux][ix+3] = w
        else:
            print(f'WARNING: {pixel} not in pixel ID MAP')

    def go(self):
        data_to_send = {}
        for ux in self.leds:
            data = array.array('B')
            data.extend(self.leds[ux])
            data_to_send[ux] = data

        for u in data_to_send:
            self.client.SendDmx(int(u), data_to_send[u], lambda state: print(state))
