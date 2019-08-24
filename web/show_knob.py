from queue import Queue
import cherrypy

from color import HSV
from core.commands import ShowKnobCommand


@cherrypy.expose
@cherrypy.tools.json_in()
@cherrypy.tools.json_out()
class ShowKnob:
    def __init__(self, queue: Queue):
        self.queue = queue

    def POST(self) -> None:
        """
        Sets the knob 'name' to value 'value' for show 'show'
        """
        data = cherrypy.request.json

        required_params = ['show', 'name', 'value']
        for p in required_params:
            if p not in data.keys():
                raise cherrypy.HTTPError(400, f"missing parameter '{p}'")

        value = data['value']

        if isinstance(value, dict):
            if any([c not in value.keys() for c in 'hsv']):
                raise cherrypy.HTTPError(400, 'missing parameter')

            try:
                value = HSV(*[value[c] for c in 'hsv'])
            except TypeError:
                raise cherrypy.HTTPError(400)

        self.queue.put_nowait(ShowKnobCommand(show=data['show'], name=data['name'], value=value))
