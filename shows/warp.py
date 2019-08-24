from grid import Pyramid, inset
from .knobs import KnobFactory
from randomcolor import random_color
from .showbase import ShowBase


class Warp(ShowBase):
    @staticmethod
    def description() -> str:
        return 'concentric triangle outlines from out to in'

    def __init__(self, pyramid: Pyramid, frame_delay: float = 0.2):
        self.grid = pyramid.face
        self.frame_delay = frame_delay

        self.__knobs = KnobFactory() \
            .hsv('Base Color', default=random_color(hue='purple')) \
            .create()

        # Not sure of the proper formula for this, but allows running on normal or mega triangle.
        self.max_distance = 0
        while self.grid.select(inset(self.max_distance)):
            self.max_distance += 1

    def next_frame(self) -> int:
        while True:
            for distance in range(self.max_distance):
                self.grid.clear()

                color = self.knobs['Base Color']
                self.grid.set(inset(distance), color)

                yield self.frame_delay

    @property
    def knobs(self):
        return self.__knobs
