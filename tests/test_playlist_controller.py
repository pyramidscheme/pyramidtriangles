import pytest

from core import PlaylistController


def second(items):
    return items[1]


@pytest.fixture
def playlist():
    p = PlaylistController()
    p.clear()
    return p


def test_controller(playlist):
    assert playlist.current_playlist() == []

    playlist.put('Show 1')
    assert list(map(second, playlist.current_playlist())) == ['Show 1']
    playlist.put('Show 2')
    assert list(map(second, playlist.current_playlist())) == ['Show 1', 'Show 2']
    playlist.put('Show 3')
    assert list(map(second, playlist.current_playlist())) == ['Show 1', 'Show 2', 'Show 3']
    playlist.put('Show 4')
    assert list(map(second, playlist.current_playlist())) == ['Show 1', 'Show 2', 'Show 3', 'Show 4']

    (second_id, _) = playlist.current_playlist()[1]
    playlist.delete(second_id)
    assert list(map(second, playlist.current_playlist())) == ['Show 1', 'Show 3', 'Show 4']

    playlist.clear()
    assert playlist.current_playlist() == []


def test_controller_looping(playlist):
    playlist.put('Show 1')
    playlist.put('Show 2')
    playlist.put('Show 3')
    playlist.put('Show 4')
    playlist.delete(playlist.current_playlist()[1][0])
    assert list(map(second, playlist.current_playlist())) == ['Show 1', 'Show 3', 'Show 4']

    assert [playlist.next(), playlist.next(), playlist.next(), playlist.next(), playlist.next()] == \
           ['Show 1', 'Show 3', 'Show 4', 'Show 1', 'Show 3']


def test_controller_empty(playlist):
    assert playlist.current_playlist() == []
    # Effective no-op
    playlist.clear()
    assert playlist.next() is None


def test_controller_bad_delete_ignored(playlist):
    assert playlist.current_playlist() == []
    playlist.delete(0)


def test_controller_set_next(playlist):
    assert playlist.current_playlist() == []
    playlist.set_next(0)
    assert playlist.next() is None

    playlist.put('Show 1')
    playlist.put('Show 2')
    playlist.put('Show 3')
    playlist.put('Show 4')

    for (i, show) in [(0, 'Show 1'), (1, 'Show 2'), (2, 'Show 3')]:
        index = playlist.current_playlist()[i][0]
        playlist.set_next(index)
        assert playlist.next() == show
