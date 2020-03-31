import logging
from queue import Queue
from os import path
import cherrypy
from typing import Any, Dict, Optional

from core import PlaylistController
from .brightness import Brightness
from .cycle_time import CycleTime
from .latest_status import LatestStatus
from .playlist import Playlist
from .shows import Shows
from .show_knob import ShowKnob
from .speed import Speed
from .status import Status

# Suppressing logging to terminal for cherrypy access logs, which are really noisy.
# The log is still written to `log/cherrypy_access.log` though.
logging.getLogger("cherrypy.access").propagate = False


class Web:
    """Web API for running triangle shows."""
    def __init__(self, command_queue: Queue, status_queue: Queue):
        # In-memory DB is easier than organizing thread-safety around all operations. At least one connection must stay
        # open. 'self.db' shouldn't be closed.
        self.db = PlaylistController()

        status = LatestStatus(status_queue)

        # These all are REST endpoints, path denoted by the variable name (e.g. /cycle_time).
        self.brightness = Brightness(command_queue, status)
        self.cycle_time = CycleTime(command_queue, status)
        self.playlist = Playlist(command_queue, self.db)
        self.shows = Shows(command_queue)
        self.show_knob = ShowKnob(command_queue)
        self.speed = Speed(command_queue, status)
        self.status = Status(status)

    @staticmethod
    def build_config(config: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Builds a cherrypy config by merging settings into the config argument.
        Exposed so tests can reuse this config.
        """
        directory = path.dirname(path.abspath(__file__))
        static_path = path.join(directory, 'sfrontend/public')

        if config is None:
            config = {}

        config.update({
            '/': {
                'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
                'tools.gzip.on': True,
                'tools.staticdir.on': True,
                'tools.staticdir.dir': static_path,
                'tools.staticdir.index': 'index.html',
            }
        })
        return config

    def start(self, config):
        """Starts the cherrypy server and blocks."""
        config = self.build_config(config)
        cherrypy.config.update({
            'log.access_file': 'log/cherrypy_access.log',
            'log.screen': False,
        })

        # this method blocks until KeyboardInterrupt
        cherrypy.quickstart(self, '/', config=config)
