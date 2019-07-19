from .showbase import ShowBase
from color import Color


class UpDown(ShowBase):
    def __init__(self, tri_grid, frame_delay=2):
        self.cells = tri_grid
        self.frame_delay = frame_delay

    def next_frame(self):
        a = "up"

        while True:
            self.cells.clear()

            if a == "up":
                print('up')
                for i in self.cells.get_up_cells():
                    print("Up", i.get_id())
                    self.cells.set_cell_by_cellid(i.get_id(), Color(r=1, g=1, b=1, w=1))
            else:
                print('down')
                for i in self.cells.get_down_cells():
                    print("down", i.get_id())
                    self.cells.set_cell_by_cellid(i.get_id(), Color(r=1, g=0, b=0, w=0))

            if a == "up":
                a = "down"
            else:
                a = "up"

            yield self.frame_delay
