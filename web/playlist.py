import cherrypy
from typing import List, Tuple, Mapping, Optional, Union

from core import PlaylistController


@cherrypy.expose
@cherrypy.tools.json_in()
@cherrypy.tools.json_out()
class Playlist:
    def __init__(self, playlist: PlaylistController):
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
