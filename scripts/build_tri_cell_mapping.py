import os
import sys

curr_cell = 0

#Built from https://docs.google.com/spreadsheets/d/16Ys242V437N968W5UU2WQdonFJ6SwZJeYmEXGbC9cYo/edit#gid=0
ds = {1: [1, 1052,0],
      2: [3, 1019,1051],
      3: [5, 970, 1018],
      4: [7, 905, 969],
      5: [9, 824, 904],
      6: [11, 727,823],
      7: [13, 614, 726],
      8: [15, 485,613],
      9: [17, 340, 484],
      10: [19, 179,339],
      11: [21, 2, 178]
      }

for row in sorted(ds):
    n_cells = ds[row][0] # ncells in row
    u = ds[row][1] # up cell counter
    d = ds[row][2] # down cell counter

    is_up = True
    for cell in range (1, n_cells+1):
        if is_up:
            print('{0}: [{1},{2},{3},{4},{5},{6},{7},{8}],'.format(curr_cell, u, u+1, u+2 , u+3, u+4, u+5, u+6, u+7))
            is_up = False
            u += 8
     
        else:
            print('{0}: [{1},{2},{3},{4},{5},{6},{7},{8}],'.format(curr_cell, d ,d-1, d-2, d-3, d-4,d-5,d-6, d-7))
            d -= 8
            is_up = True

        curr_cell += 1

