from collections import deque
from typing import Deque
import random

from .show import Show
from color import RGB
from grid import Cell, Pyramid


class Zaphod(Show):
    def __init__(self, pyramid: Pyramid, frame_delay=0.1):
        self.grid = pyramid.panel
        self.frame_delay = frame_delay

    def shuffle(self) -> Deque[Cell]:
        cells = self.grid.cells
        random.shuffle(cells)
        return deque(cells)

    def next_frame(self):
        cells = self.shuffle()
        while True:
            if len(cells) == 0:
                cells = self.shuffle()

            self.grid.clear()
            self.grid.set(cells.popleft(), RGB(200, 10, 25))

            yield self.frame_delay
