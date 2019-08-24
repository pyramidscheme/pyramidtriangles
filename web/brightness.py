import cherrypy
from queue import Queue
from typing import Mapping

from core import BrightnessCmd
from .latest_status import LatestStatus


@cherrypy.expose
@cherrypy.tools.json_in()
@cherrypy.tools.json_out()
class Brightness:
    def __init__(self, queue: Queue, status: LatestStatus):
        self.queue = queue
        self.status = status

    def GET(self) -> Mapping[str, int]:
        brightness = int(self.status.latest().brightness_scale * 100)
        return {"data": brightness}

    def POST(self):
        data = cherrypy.request.json
        if 'data' not in data:
            raise cherrypy.HTTPError(400)
        brightness = data['data']/100.0
        self.queue.put(BrightnessCmd(brightness))
