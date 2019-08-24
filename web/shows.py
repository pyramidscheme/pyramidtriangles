from dataclasses import dataclass, asdict
from queue import Queue
import cherrypy
from core.commands import RunShowCommand
from shows import load_shows


@dataclass(frozen=True)
class Show:
    name: str
    description: str


@cherrypy.expose
@cherrypy.tools.json_in()
@cherrypy.tools.json_out()
class Shows:
    def __init__(self, queue: Queue):
        self.queue = queue
        self.shows = [Show(name=name, description=cls.description()) for (name, cls) in load_shows()]
        self.show_names = list(map(lambda x: x.name, self.shows))

    def GET(self):
        """Returns listing of show names"""
        return {"shows": [asdict(show) for show in self.shows]}

    def POST(self):
        """Sets the current show to 'value' key in request"""
        data = cherrypy.request.json
        if 'value' not in data:
            raise cherrypy.HTTPError(400)
        show_name = data['value']

        if show_name is None or show_name not in self.show_names:
            raise cherrypy.HTTPError(400)

        self.queue.put(RunShowCommand(show_name))
