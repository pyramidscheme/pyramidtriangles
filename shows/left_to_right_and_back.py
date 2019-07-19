from .showbase import ShowBase
from color import Color
import time


class LeftToRightAndBack(ShowBase):
    def __init__(self, tri_grid, frame_delay=1.0):
        self.tri_grid = tri_grid
        self.frame_delay = frame_delay

    def next_frame(self):
        xlen = len(self.tri_grid._triangle_grid)
        ylen = len(self.tri_grid._triangle_grid[0])
        x = 0
        y = 0
        fwd = True

        while True:

            if fwd is True:
                self.tri_grid.clear()

                if y < ylen:
                    for rows in self.tri_grid._triangle_grid:
                        cell = self.tri_grid._triangle_grid[x][y]

                        if cell is None:
                            pass
                        else:
                            r = 1.0
                            g = 0.0
                            for pix in range(6):
                                self.tri_grid.set_pixel(cell.get_pixels()[pix], Color(r=r, g=g, b=0, w=0.01), cell.get_id())
                                time.sleep(.2)
                                self.tri_grid.go()
                                r -= 0.01
                                g += 1/6
                        x += 1
                    x = 0
                    y += 1

                else:
                    x = 0
                    y = ylen-1
                    fwd = False
            else:
                if y >= 0:
                    for rows in self.tri_grid._triangle_grid:

                        cell = self.tri_grid._triangle_grid[x][y]

                        if cell is None:
                            pass
                        else:
                            g = 1.0
                            b = 0.0
                            for pix in range(6):
                                self.tri_grid.set_pixel(cell.get_pixels()[5-pix], Color(r=0, g=g, b=b, w=0.01), cell.get_id())
                                time.sleep(.2)
                                self.tri_grid.go()
                                g -= 1/6
                                b += 1/6
                        x += 1
                        
                    y -= 1
                    x = 0
                else:
                    y = 0
                    x = 0
                    fwd = True

            yield self.frame_delay
