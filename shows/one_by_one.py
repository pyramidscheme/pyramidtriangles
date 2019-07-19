from .showbase import ShowBase
from color import Color


class OneByOne(ShowBase):
    def __init__(self, tri_grid, frame_delay=1.5):
        self.tri_grid = tri_grid
        self.frame_delay = frame_delay

    def next_frame(self):
        ncells = len(self.tri_grid.get_cells())-1
        self.tri_grid.clear()
        cell_n = 0

        while True:
            self.tri_grid.clear()
            print(cell_n)
            self.tri_grid.set_cell_by_cellid(self.tri_grid.get_cells()[cell_n].get_id(), Color(r=1, g=1, b=1/10, w=1/10))

            if cell_n >= ncells:
                cell_n = -1
            cell_n += 1

            yield self.frame_delay
