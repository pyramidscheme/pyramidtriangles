import cherrypy
from queue import Queue
from typing import Mapping

from core import RuntimeCmd
from .latest_status import LatestStatus


@cherrypy.expose
@cherrypy.tools.json_in()
@cherrypy.tools.json_out()
class CycleTime:
    def __init__(self, queue: Queue, status: LatestStatus):
        self.queue = queue
        self.status = status

    def GET(self) -> Mapping[str, int]:
        return {'data': self.status.latest().max_show_time}

    def POST(self) -> None:
        data = cherrypy.request.json
        if 'data' not in data:
            raise cherrypy.HTTPError(400)
        value = data['data']

        print(f'received new cycle time {value}')
        self.queue.put(RuntimeCmd(int(value)))
