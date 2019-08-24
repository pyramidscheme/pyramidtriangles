import dataclasses
import logging
import queue
from dataclasses import dataclass
from typing import TypeVar, Union, Iterable, Iterator, MutableMapping, Mapping, Dict

from color import Color

logger = logging.getLogger("pyramidtriangles")

KnobType = Union['ValueKnob', 'HSVKnob']
KnobValue = Union[int, float, Color]
# Constrained generic type of int or float
V = TypeVar('V', int, float)


@dataclass
class ValueKnob:
    """
    Configurable knob for a show requesting an int or float value.
    """
    default: V
    min: V
    max: V
    step: V


@dataclass
class HSVKnob:
    """
    Configurable knob for a show requesting an HSV value.
    """
    default: Dict[str, float]


class KnobMediator(MutableMapping):
    """
    Mediates setting/getting of knob values to ensure thread safety.
    """

    def __init__(self, knobs: MutableMapping[str, KnobType], values: MutableMapping[str, KnobValue]):
        self.queue = queue.Queue()
        self.__knobs = knobs
        self.values = values

    def _process_queue(self) -> None:
        """
        Process queue of submitted knob values.
        """
        while True:
            try:
                (name, value) = self.queue.get_nowait()
                if name not in self.values:
                    logger.warning(f"{type(self).__name__}: knob name '{name}' in queue but not registered")
                    continue  # skipping

                if isinstance(value, (int, float, Color)):
                    self.values[name] = value
                else:
                    raise TypeError(f"Unexpected knob value type {type(value)}")
            except queue.Empty:
                break

    def __getitem__(self, name: str) -> KnobValue:
        self._process_queue()
        return self.values[name]

    def __setitem__(self, name: str, value: KnobValue) -> None:
        self.queue.put_nowait((name, value))

    def __delitem__(self, key: str) -> None:
        raise NotImplementedError

    def __len__(self) -> int:
        return len(self.values)

    def __iter__(self) -> Iterator[str]:
        return iter(self.values)

    @property
    def json_object(self) -> Iterable[Mapping[str, Union[str, Dict[str, float]]]]:
        """
        Produces a sequence of nested dict which can be directly JSON encoded.

        [{
          name: 'Speed',
          value: {
            default: {
              h: 1.0,
              s: 1.0,
              v: 1.0,
            },
          },
          type: 'HSVKnob',
        },
        .
        .
        .
        ]

        Actual JSON encoding is left for cherrypy as part of a larger message.
        """
        ret = []
        for (name, knob) in self.__knobs.items():
            knob_type = type(knob).__name__
            if dataclasses.is_dataclass(knob):
                ret.append({'name': name, 'value': dataclasses.asdict(knob), 'type': knob_type})
        return ret


class KnobFactory:
    def __init__(self):
        self.dict: MutableMapping[str, KnobType] = {}
        self.values: MutableMapping[str, KnobValue] = {}

    def hsv(self, name: str, default: Color) -> 'KnobFactory':
        if name in self.dict or name in self.values:
            raise ValueError(f"Duplicate registered knob with name '{name}'")

        self.dict[name] = HSVKnob(default=dict(zip('hsv', default.hsv)))
        self.values[name] = default
        return self

    def value(self, name: str, default: V, min: V, max: V, step: V) -> 'KnobFactory':
        if name in self.dict or name in self.values:
            raise ValueError(f"Duplicate registered knob with name '{name}'")

        self.dict[name] = ValueKnob(default=default, min=min, max=max, step=step)
        self.values[name] = default
        return self

    def create(self):
        return KnobMediator(self.dict, self.values)
