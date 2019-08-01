import os
import sys

curr_cell = 0
u = 1059
#Built from https://docs.google.com/spreadsheets/d/16Ys242V437N968W5UU2WQdonFJ6SwZJeYmEXGbC9cYo/edit#gid=0
ds = {1: [1, 1051,0],
      2: [3, 1018,1050],
      3: [5, 969, 1017],
      4: [7, 904, 968],
      5: [9, 823, 903],
      6: [11, 726,822],
      7: [13, 613, 725],
      8: [15, 484,612],
      9: [17, 339, 483],
      10: [19, 178,338],
      11: [21, 1, 177]
      }

for row in ds:
    n_cells = ds[row][0] # ncells in row

    is_up = True
    for cell in range (1, n_cells+1):
        print('{0}: [{1},{2},{3},{4},{5},{6},{7},{8}],'.format(curr_cell, u, u-1, u-2 , u-3, u-4, u-5, u-6, u-7))
        u -= 8
        curr_cell += 1
    u -= 9
