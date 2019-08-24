from dataclasses import dataclass

from shows.knobs import KnobValue


@dataclass(frozen=True)
class BrightnessCommand:
    brightness: float


@dataclass(frozen=True)
class RunShowCommand:
    show: str


@dataclass(frozen=True)
class ShowRuntimeCommand:
    runtime: int


@dataclass(frozen=True)
class ShowKnobCommand:
    show: str
    name: str
    value: KnobValue


@dataclass(frozen=True)
class SpeedCommand:
    speed: float
