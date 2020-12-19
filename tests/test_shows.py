from grid import Pyramid
from shows import Show, load_shows


def test_load_shows():
    names = {name for (name, cls) in load_shows()}
    assert {
        'LeftToRight',
        'LeftToRightAndBack',
        'Random',
        'UpDown',
    }.issubset(names)
    assert 'DebugShow' in names
    assert 'DisabledShow' not in names


class DebugShow(Show, debug=True):
    def __init__(self, pyramid: Pyramid) -> None:
        pass

    def next_frame(self):
        pass


class DisabledShow(Show, disable=True):
    def __init__(self, pyramid: Pyramid) -> None:
        pass

    def next_frame(self):
        pass
