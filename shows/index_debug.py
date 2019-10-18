from itertools import chain, cycle
from typing import List

from grid import Coordinate, Grid, Pyramid, every
from color import HSV as hsv
from color import RGB
from .showbase import ShowBase


class IndexDebug(ShowBase):
    def __init__(self, pyramid: Pyramid, frame_delay: float = 0.05):
        self.pyramid = pyramid.face
        self.frame_delay = frame_delay
        self.n_cells = len(self.grid)
        self.hsv = hsv(1,1,1)



    def set_param(self, name, val):
        if name == 'flash':
            try:
                self.grid.set(every, RGB(255, 0, 0))
                self.grid.go()
            except Exception as e:
                print("Bad Hue flash!", val, e)

        if name == 'speed':
            try:
                self.frame_delay = float(val)
            except Exception as e:
                print("Bad Speed Value!", val)

        if name == "change_primary_hsv":
            try:
                self.hsv = HSV(val[0],val[1],val[2])
            except Exception as e:
                print("Bad HSVColor Values!", val)



        if name == "change_secondary_hsv":
            try:
                self.hsv = HSV(val[0],val[1],val[2])
            except Exception as e:
                print("Bad HSVColor Values!", val)



    def next_frame(self):
        self.pyramid.clear()
        yield self.frame_delay

        def coordinates(grid: Grid) -> List[Coordinate]:
            return sorted([cell.coordinate for cell in grid.cells],
                          key=lambda c: (c.y, c.x))

        faces = [(face, cycle(coordinates(face)))
                 for face in self.pyramid.faces]
        highest_universe = max(cell.highest_universe.id
                               for cell in self.pyramid.cells)

        while True:
            for cell in sorted(self.grid.cells):
                universe = max(a.universe for a in cell.addresses)
                hue = 1.0 - (cell.position.row / self.grid.row_count) * 0.9

                self.grid.clear()
                self.hsv.h = hue
                self.grid.set(cell.position, self.hsv)
                self.grid.go()
                yield self.frame_delay

            for cell in sorted(self.grid.cells):
                universe = max(a.universe for a in cell.addresses)
                hue = min(0.9, (universe - 1) * 0.1)
                self.hsv.h = hue
                self.grid.set(cell, self.hsv )
                self.grid.go()
                yield self.frame_delay
