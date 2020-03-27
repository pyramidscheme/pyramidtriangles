import logging
from dataclasses import dataclass
from queue import Queue, Empty
import time
from threading import Event, Thread
from typing import Optional, Mapping, Any, Iterable

import shows
import util
from grid import Pyramid
from shows import Show
from .commands import BrightnessCommand, RunShowCommand, ShowRuntimeCommand, ShowKnobCommand
from .playlist_controller import PlaylistController

logger = logging.getLogger("pyramidtriangles")


def make_interpolator():
    low_interp = util.make_interpolater(0.0, 0.5, 2.0, 1.0)
    hi_interp = util.make_interpolater(0.5, 1.0, 1.0, 0.5)

    def interpolation(val):
        """
        Interpolation function to map OSC input into ShowRunner speed_x

        Input values range from 0.0 to 1.0
        input 0.5 => 1.0
        input < 0.5 ranges from 2.0 to 1.0
        input > 0.5 ranges from 1.0 to 0.5
        """
        if val == 0.5:
            return 1.0
        elif val < 0.5:
            return low_interp(val)
        else:
            return hi_interp(val)
    return interpolation


speed_interpolation = make_interpolator()


@dataclass
class Status:
    """Represents current status of ShowRunner."""
    current_show: str
    show_start_time: float
    # {show: [{knob1: {_some values_}}, ...]}
    knobs: Iterable[Mapping[str, Mapping[str, Any]]]
    max_show_time: int
    brightness_scale: float
    speed_scale: float


class ShowRunner(Thread):
    def __init__(self,
                 pyramid: Pyramid,
                 command_queue: Queue,
                 status_queue: Queue,
                 shutdown: Event,
                 max_showtime: int = 240,
                 brightness_scale: float = 1.0,
                 speed_scale: float = 1.0,
                 fail_hard: bool = True):
        super(ShowRunner, self).__init__(name=type(self).__name__)

        self.pyramid = pyramid
        self.command_queue = command_queue
        self.status_queue = status_queue
        self.shutdown = shutdown
        self.__max_show_time = max_showtime
        self.__brightness_scale = brightness_scale
        # show speed multiplier in [0.5, 2.0], 1.0 is normal, lower is faster, higher is slower
        self.__speed_scale = speed_scale
        self.fail_hard = fail_hard

        # map of names -> show constructors
        self.shows = dict(shows.load_shows())
        self.random_show_sequence = shows.random_shows()
        self.playlist = PlaylistController()

        # current show object & frame generator
        self.show: Optional[Show] = None
        self.framegen = None
        self.prev_show = None
        self.show_start_time = 0.0

    def _send_status(self):
        """
        Enqueue a status update in queue for consumers.
        """
        self.status_queue.put(self.status)

    @property
    def status(self) -> Status:
        """
        Returns the status of the ShowRunner.
        """
        if self.show is None:
            return Status()

        knobs_json = []
        if self.show.knobs:
            knobs_json = self.show.knobs.json_array

        # Represents JSON status object
        return Status(
            current_show=self.show.name,
            show_start_time=self.show_start_time,
            knobs=knobs_json,
            max_show_time=self.max_show_time,
            brightness_scale=self.brightness_scale,
            speed_scale=self.speed_scale)

    def process_command_queue(self):
        msgs = []
        while True:
            try:
                msgs.append(self.command_queue.get_nowait())
            except Empty:
                break
        [self._process_command(cmd) for cmd in msgs]

    def _process_command(self, msg) -> None:
        if isinstance(msg, RunShowCommand):
            self.next_show(msg.show)
        elif isinstance(msg, ShowRuntimeCommand):
            self.max_show_time = msg.runtime
        elif isinstance(msg, BrightnessCommand):
            self.brightness_scale = msg.brightness
        elif isinstance(msg, ShowKnobCommand):
            show_name = self.show.name if self.show else ''

            if show_name != msg.show:
                logger.info(f"Received knob value for show '{msg.show}' but show '{show_name}' running")
                return

            knobs = self.show.knobs
            if knobs is not None:
                knobs[msg.name] = msg.value

        elif isinstance(msg, tuple):
            logger.debug(f'OSC: {msg}')

            (addr, val) = msg
            addr = addr.split('/z')[0]
            val = val[0]
            assert addr[0] == '/'
            (ns, cmd) = addr[1:].split('/')
            if ns == '1':
                # control command
                if cmd == 'next':
                    self.next_show()
                elif cmd == 'previous':
                    if self.prev_show:
                        self.next_show(self.prev_show.name)
                elif cmd == 'speed':
                    self.speed_scale = speed_interpolation(val)
                    print(f"setting speed_x to: '{self.speed_scale}'")

        else:
            logger.warning(f"ignoring unknown msg: '{msg}'")

    def clear(self):
        """Clears all panels."""
        self.pyramid.clear()

    def next_show(self, name: Optional[str] = None) -> None:
        """
        Sets the next show to run, in priority of:
            1. Show passed as argument
            2. Show in playlist
            3. Show from semi-random sequence generator
        """
        show_cls = None
        if name:
            if name in self.shows:
                show_cls = self.shows[name]
            else:
                logger.warning(f"unknown show as argument: '{name}'")

        if not show_cls:
            name = self.playlist.next()
            if name:
                if name in self.shows:
                    show_cls = self.shows[name]
                else:
                    logger.warning(f"unknown show from playlist: '{name}'")

        if not show_cls:
            logger.info("choosing random show")
            (name, show_cls) = next(self.random_show_sequence)

        self.clear()
        self.prev_show = self.show
        self.show = show_cls(self.pyramid)
        self.show_start_time = time.perf_counter()

        self._send_status()
        print(f'next show: {name}')

        self.framegen = self.show.next_frame()

    def get_next_frame(self):
        "return a delay or None"
        try:
            return next(self.framegen)
        except StopIteration:
            return None

    def run(self):
        if not (self.show and self.framegen):
            print("Next Next Next")
            self.next_show()

        # Loops until the shutdown event is triggered
        while not self.shutdown.is_set():
            try:
                self.process_command_queue()

                delay = self.get_next_frame()
                self.pyramid.go()
                if delay:
                    real_delay = delay * self.speed_scale
                    self.shutdown.wait(real_delay)  # shutdown.wait() is like time.sleep() but can be interrupted

                    now = time.perf_counter()
                    elapsed = now - self.show_start_time
                    if elapsed > self.max_show_time:
                        print("max show time elapsed, changing shows")
                        self.next_show()
                else:
                    print("show is out of frames, waiting...")
                    self.shutdown.wait(2)

                    self.next_show()
            except Exception:
                logger.exception("unexpected exception in show loop!")
                if self.fail_hard:
                    raise

                self.next_show()

    @property
    def max_show_time(self) -> int:
        return self.__max_show_time

    @max_show_time.setter
    def max_show_time(self, show_time: int):
        if show_time < 5:
            self.__max_show_time = 5
        else:
            self.__max_show_time = show_time
        self._send_status()

    @property
    def brightness_scale(self) -> float:
        return self.__brightness_scale

    @brightness_scale.setter
    def brightness_scale(self, brightness: float):
        if brightness < 0.0:
            self.__brightness_scale = 0.0
        elif brightness > 1.0:
            self.__brightness_scale = 1.0
        else:
            self.__brightness_scale = brightness
        self.pyramid.face.model.brightness = self.__brightness_scale
        self._send_status()

    @property
    def speed_scale(self):
        return self.__speed_scale

    @speed_scale.setter
    def speed_scale(self, speed: float):
        """Sets show speed multiplier in [0.5, 2.0], 1.0 is normal, lower is faster, higher is slower."""
        if speed < 0.5:
            self.__speed_scale = 0.5
        elif speed > 2.0:
            self.__speed_scale = 2.0
        else:
            self.__speed_scale = speed
        self._send_status()
