from .showbase import ShowBase
from color import Color
import random as rnd


class Random(ShowBase):
    def __init__(self, tri_grid, frame_delay = 0.1):
        self.tri_grid = tri_grid
        self.frame_delay = frame_delay

        self.n_cells = len(self.tri_grid.get_cells())

    def next_frame(self):
        while True:
            self.tri_grid.clear()
            self.tri_grid.set_cell_by_cellid(rnd.randint(1, self.n_cells-2), Color(r=0.8, g=1, b=1/10, w=1/10))
            self.tri_grid.set_cell_by_cellid(rnd.randint(1, self.n_cells-2), Color(r=0.8, g=0.04, b=1/10, w=1/10))

            yield self.frame_delay
