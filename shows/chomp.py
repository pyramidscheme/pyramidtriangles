from typing import Sequence

from color import HSV
from grid import Grid, Position, Cell, every
from randomcolor import random_color
from .showbase import ShowBase


class Chomp(ShowBase):
    def __init__(self, grid: Grid, frame_delay: float = 0.2):
        self.grid = grid
        self.frame_delay = frame_delay

    def upper_fangs(self, adjust_down: int = 0) -> Sequence[Cell]:
        positions = [Position(row, col) for row, col in (
            (3, 0), (3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6), (4, 1), (4, 3), (4, 5), (4, 7)
        )]

        for _ in range(adjust_down):
            positions = [pos.adjust(2, 2) for pos in positions]

        return [self.grid[pos] for pos in positions if pos in self.grid]

    def lower_fangs(self, adjust_up: int = 0) -> Sequence[Cell]:
        positions = [Position(row, col) for row, col in (
            (9, 4), (9, 14), (10, 5), (10, 6), (10, 8), (10, 10), (10, 12), (10, 14), (10, 15),
            (11, 7), (11, 8), (11, 9), (11, 10), (11, 11), (11, 12), (11, 13), (11, 14), (11, 15)
        )]

        for _ in range(adjust_up):
            positions = [pos.adjust(-2, -2) for pos in positions]

        return [self.grid[pos] for pos in positions if pos in self.grid]

    def next_frame(self):
        background = HSV(217/360, 0.26, 1.0)
        lower_color = random_color(hue='purple')
        upper_color = lower_color.copy()
        upper_color.h -= 0.1

        while True:
            self.grid.set(every, background)
            upper = self.upper_fangs(0)
            self.grid.set(upper, upper_color)
            lower = self.lower_fangs(0)
            self.grid.set(lower, lower_color)
            self.grid.go()
            yield self.frame_delay

            self.grid.set(lower, background)
            lower = self.lower_fangs(1)
            self.grid.set(lower, lower_color)
            self.grid.go()
            yield self.frame_delay

            self.grid.set(upper, background)
            self.grid.set(lower, background)
            upper = self.upper_fangs(1)
            self.grid.set(upper, upper_color)
            lower = self.lower_fangs(2)
            self.grid.set(lower, lower_color)
            self.grid.go()
            yield self.frame_delay
