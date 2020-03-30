from abc import ABC, abstractmethod
from functools import lru_cache
from random import choice
from typing import Iterator, Tuple, Type, TypeVar, Optional, Iterable

from .knobs import KnobMediator

Show = TypeVar('Show', bound="ShowBase")


class ShowBase(ABC):
    """Abstract base class to register Shows"""

    @property
    def name(self) -> str:
        """Returns the name of the show."""
        return type(self).__name__

    @staticmethod
    def description() -> str:
        """
        Returns a show's description when overridden, or empty string.
        """
        return ''

    @property
    def knobs(self) -> Optional[KnobMediator]:
        """
        Returns the show's KnobMediator or None, which is used to mediate configurable 'knobs' which the UI can input
        into a running show.
        """
        return None

    @abstractmethod
    def next_frame(self) -> int:
        """
        Draw the next step of the animation.  This is the main loop of the show.  Set some pixels and then 'yield' a
        number to indicate how long you'd like to wait before drawing the next frame.  Delay numbers are in seconds.
        """
        raise NotImplementedError


@lru_cache(maxsize=None)
def load_shows() -> Iterable[Tuple[str, Type[Show]]]:
    """Return a sorted list of tuples (name, class) of ShowBase subclasses."""
    return sorted([(cls.__name__, cls) for cls in ShowBase.__subclasses__()])


def random_shows(no_repeat: float = 1/3) -> Iterator[Tuple[str, Type[ShowBase]]]:
    """
    Return an infinite sequence of randomized shows.

    Remembers the last 'no_repeat' proportion of items to avoid replaying shows too soon. no_repeat defaults to 1/3 of
    the sequence.
    """
    seq = load_shows()  # sequence of tuples of (name, class)
    seen = []

    while True:
        show = choice(seq)
        while show[0] in seen or 'Debug' in show[0]:
            show = choice(seq)

        seen.append(show[0])
        if len(seen) >= no_repeat*len(seq):
            seen.pop(0)

        yield show
