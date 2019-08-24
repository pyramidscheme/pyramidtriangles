import time
from dataclasses import dataclass
from queue import Queue, Empty

from typing import Mapping, Iterable, Any, Optional

from core import Status


@dataclass(frozen=True)
class ApiStatus:
    """Represents current status returned via API."""
    show: str
    seconds_remaining: int
    max_show_time: int
    # {show: [{knob1: {_some values_}}, ...]}
    knobs: Iterable[Mapping[str, Mapping[str, Any]]]
    brightness_scale: float
    speed_scale: float


class LatestStatus:
    """Wraps a Queue of Status updates to supply the most recent status."""
    def __init__(self, queue: 'Queue[Status]'):
        self.queue = queue
        self.current: Optional[Status] = None

    def latest(self) -> Optional[ApiStatus]:
        while True:
            try:
                self.current = self.queue.get_nowait()
            except Empty:
                break

        current = self.current
        now = time.perf_counter()
        return ApiStatus(
            show=current.current_show,
            seconds_remaining=current.max_show_time - int(now - current.show_start_time),
            max_show_time=current.max_show_time,
            knobs=current.knobs,
            brightness_scale=current.brightness_scale,
            speed_scale=current.speed_scale,
        )
