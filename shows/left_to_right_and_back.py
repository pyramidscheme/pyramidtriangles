from color import HSV, RGB
from .showbase import ShowBase
from grid import TriangleGrid, traversal
import time

class LeftToRightAndBack(ShowBase):
    def __init__(self, tri_grid: TriangleGrid, frame_delay: float = 0.2):
        self.tri_grid = tri_grid
        self.frame_delay = frame_delay

    def next_frame(self):
        row_count = self.tri_grid.row_count

        hsv = HSV(0.0,0.9,.5, False)
#        from IPython import embed; embed() 
        pix_arr = []
        a_ctr = 0
        for points in traversal.left_to_right(row_count):
 
            for (row, column) in points:
                cell = self.tri_grid.get_cell_by_coordinates(row, column)
                b_ctr = 0
                for pixel in self.tri_grid._model._pixelmap[cell.id]:
                    if len(pix_arr) <= a_ctr+b_ctr:
                        pix_arr.append([])
                    pix_arr[a_ctr+b_ctr].append(pixel)
                    b_ctr += 1
            a_ctr += 4
        self.tri_grid.clear()
        
        while True:
            for i in pix_arr:
                
                for ii in i:
                    print(ii, hsv.hsv, hsv.rgbw)
                    self.tri_grid._model.set_pixel_by_pixel_id(ii,hsv)
                    self.tri_grid.go()
                hsv.h += .09
                if hsv.h >= 1.0:
                    hsv.h = 0.0
                time.sleep(0.9)
 
            for i in reversed(pix_arr):

                for ii in reversed(i):
                    print(ii, hsv.hsv, hsv.rgbw)
                    self.tri_grid._model.set_pixel_by_pixel_id(ii,hsv)
                    self.tri_grid.go()
                hsv.v += .1
                if hsv.v >= 1.0:
                    hsv.v = 0.0
                time.sleep(0.9)

                
            yield self.frame_delay

