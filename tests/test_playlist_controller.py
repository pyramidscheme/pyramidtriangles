from core import PlaylistController


def second(items):
    return items[1]


def test_controller():
    playlist = PlaylistController()
    assert playlist.current_playlist() == []

    playlist.put('Show 1')
    assert list(map(second, playlist.current_playlist())) == ['Show 1']
    playlist.put('Show 2')
    assert list(map(second, playlist.current_playlist())) == ['Show 1', 'Show 2']
    playlist.put('Show 3')
    assert list(map(second, playlist.current_playlist())) == ['Show 1', 'Show 2', 'Show 3']
    playlist.put('Show 4')
    assert list(map(second, playlist.current_playlist())) == ['Show 1', 'Show 2', 'Show 3', 'Show 4']

    assert playlist.pop() == 'Show 1'
    assert list(map(second, playlist.current_playlist())) == ['Show 2', 'Show 3', 'Show 4']

    (second_id, _) = playlist.current_playlist()[1]
    playlist.delete(second_id)
    assert list(map(second, playlist.current_playlist())) == ['Show 2', 'Show 4']

    playlist.clear()
    assert playlist.current_playlist() == []


def test_controller_empty():
    playlist = PlaylistController()
    assert playlist.current_playlist() == []

    # Effective no-op
    playlist.clear()
    assert playlist.pop() is None


def test_controller_bad_delete_ignored():
    playlist = PlaylistController()
    assert playlist.current_playlist() == []

    playlist.delete(0)
