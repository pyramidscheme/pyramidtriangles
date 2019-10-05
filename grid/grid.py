from abc import abstractmethod
import logging
from typing import Callable, Iterator, Iterable, List, Mapping, NamedTuple, Optional, Union, Type

from color import Color, RGB
from model import Model
from .cell import Cell, Direction
from .geom import Address, Coordinate, Geometry, Position

logger = logging.getLogger('pyramidtriangles')

Location = Union[Coordinate, Position]

Query = Callable[['Grid'], Iterable[Cell]]
Selector = Union[Location,
                 Cell,
                 Iterable[Cell],
                 Query]


class Pixel(NamedTuple):
    cell: Cell
    address: Address
    model: Type[Model]

    def set(self, color: Color):
        self.model.set(self.cell, self.address, color)

    def __call__(self, color: Color):
        self.set(color)


class Grid(Mapping[Location, Cell]):
    """
    Grid represents our triangular cells in a coordinate system.

    A Grid may correspond to a single panel, or an entire side of
    the pyramid.
    """

    geom: Geometry
    model: Type[Model]

    def cell_exists(self, coord):
        ret_val = True
        try: 
            self.select(coord)
        except Exception as e:
            #Coord does not exits
            ret_val = False
        return ret_val

    @property
    def row_count(self) -> int:
        return self.geom.rows

    @property
    @abstractmethod
    def cells(self) -> List[Cell]:
        raise NotImplementedError

    @abstractmethod
    def _cell(self, coordinate: Coordinate) -> Optional[Cell]:
        raise NotImplementedError

    def select(self, sel: Selector) -> Iterable[Cell]:
        """
        Select cells within the grid.

        The selector `sel` may be a query (like `inset(1)`), a Coordinate,
        a Position, or a list thereof.
        """
        if isinstance(sel, (int, Coordinate, Position)):
            try:
                cells = [self[sel]]
            except KeyError:
                # FIXME(lyra): Face is sparse; coordinates not on a panel
                # don't have a corresponding Cell
                cells = []
        elif isinstance(sel, Cell):
            cells = [sel]
        elif isinstance(sel, Iterable) and not isinstance(self, str):
            cells = sel  # FIXME(lyra)
        elif callable(sel):
            cells = sel(self)
        else:
            raise TypeError(f'invalid Cell selector {sel!r}')

        return cells

    def pixels(self, sel: Selector, direction: Direction = Direction.NATURAL) -> Iterator[Pixel]:
        """
        Yield the settable pixels of one or more cells.
        """

        for cell in self.select(sel):
            for addr in cell.pixel_addresses(direction):
                yield Pixel(cell, addr, self.model)

    def set(self, sel: Selector, color: Color):
        for pixel in self.pixels(sel):
            pixel.set(color)

    def set_cells(self, cells, color):
        for c in cells:
            self.set(Coordinate(c[0], c[1]), color)

    def set_all_cells(self, color=None):
        for cell in self._cells:
            self.set(Coordinate(cell[0], cell[1]), color)

    def clear(self, color: Color = RGB(0, 0, 0)):
        self.set(self.cells, color)
        self.go()

    def go(self):
        """
        Flush the underlying model (render its current state).
        """
        self.model.go()

    def _normalize_location(self, loc: Location) -> Coordinate:
        if isinstance(loc, Coordinate):
            return loc
        elif isinstance(loc, Position):
            return Coordinate.from_pos(loc, self.geom)
        else:
            raise TypeError(f'invalid Grid location {loc!r}')

    def __getitem__(self, loc: Location) -> Cell:
        coordinate = self._normalize_location(loc)
        cell = self._cell(coordinate)

        if cell is None:
            if coordinate not in self.geom:
                raise KeyError(f'{coordinate} is not within {self.geom}')

            return Cell(coordinate, None, [], self.geom, real=False)

        return cell

    def __iter__(self):
        return (cell.coordinate for cell in self.cells)

    def __len__(self) -> int:
        return len(self.cells)

    def __repr__(self):
        return f'<{type(self).__name__} rows={self.row_count} {self.model}>'
