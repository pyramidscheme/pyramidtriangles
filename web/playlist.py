import cherrypy
from queue import Queue
from typing import List, Tuple, Mapping, Optional, Union

from core import PlaylistController
from core.commands import RunShowCommand


@cherrypy.expose
@cherrypy.tools.json_in()
@cherrypy.tools.json_out()
class Playlist:
    def __init__(self, queue: Queue, playlist: PlaylistController):
        self.queue = queue
        self.playlist = playlist

    def GET(self) -> Mapping[str, Union[List[Tuple[int, str]], int]]:
        """
        Returns the current playlist of shows. [(id, show),...].
        """

        return {
            'playlist': self.playlist.current_playlist(),
            'playing': self.playlist.current_entry(),
        }

    def POST(self) -> None:
        """
        Appends a show to the playlist.
        """
        data = cherrypy.request.json
        if 'show' not in data:
            raise cherrypy.HTTPError(400, f"missing parameter 'show'")

        self.playlist.put(data['show'])

    @cherrypy.popargs('entry_id')
    def DELETE(self, entry_id: Optional[int] = None) -> None:
        """
        Deletes a show from the playlist by playlist/{entry_id}, or all shows by /playlist/.
        """
        if entry_id is None:
            self.playlist.clear()
            return

        self.playlist.delete(entry_id)

    def PUT(self) -> None:
        """
        Runs the playlist entry with {entry_id} as the current show.

        It works by setting {entry_id} to be the next playlist entry, then triggers the ShowRunner to play the next
        show.
        """
        data = cherrypy.request.json
        if 'entry_id' not in data:
            raise cherrypy.HTTPError(400, f"missing parameter 'entry_id'")

        self.playlist.set_next(data['entry_id'])
        self.queue.put(RunShowCommand(None))
