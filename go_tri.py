import argparse
import faulthandler
import logging
import sys
import threading
import netifaces
from typing import Type
import queue

from core import ShowRunner, create_osc_server
from grid import Pyramid
from model import Model
from model.sacn_model import sACN
from model.simulator import SimulatorModel
import shows
from web import Web

# Prints stack trace on failure
faulthandler.enable()

logger = logging.getLogger("pyramidtriangles")


class TriangleServer(object):
    def __init__(self, model: Type[Model], pyramid: Pyramid, args):
        self.model = model
        self.pyramid = pyramid
        self.args = args

        # Commands for the ShowRunner to process
        self.command_queue = queue.Queue()
        # Sequence of status updates from ShowRunner to Web
        self.status_queue = queue.Queue()
        # Event to synchronize shutting down
        self.shutdown = threading.Event()

        self.runner = None
        self._create_services()

    def _create_services(self):
        """Create TRI services, trying to fail gracefully on missing dependencies"""

        # XXX can this also advertise the web interface?
        # XXX should it only advertise services that exist?

        # OSC listener thread
        osc_main_thread = threading.Thread(target=create_osc_server, args=(self.shutdown, self.command_queue))
        osc_main_thread.start()

        # Show runner
        self.runner = ShowRunner(
            pyramid=self.pyramid,
            command_queue=self.command_queue,
            status_queue=self.status_queue,
            shutdown=self.shutdown,
            max_showtime=args.max_time,
            fail_hard=args.fail_hard)

        if args.shows:
            print("setting show:", args.shows[0])
            self.runner.next_show(args.shows[0])

    def start(self):
        if self.runner.is_alive():
            logger.warning("start() called, but tri_grid is already running!")
            return

        try:
            self.runner.start()
        except Exception:
            logger.exception("Exception starting ShowRunner")

    def go_web(self):
        """Run with the web interface"""
        logger.info("Running with web interface")

        show_names = [name for (name, cls) in shows.load_shows()]
        print(f'shows: {show_names}')
        web = Web(self.shutdown, self.command_queue, self.status_queue)

        config = {
            'global': {
                'server.socket_host': '0.0.0.0',
                'server.socket_port': 9990,
                # 'engine.timeout_monitor.on' : True,
                # 'engine.timeout_monitor.frequency' : 240,
                # 'response.timeout' : 60*15
            },
        }

        # this method blocks until KeyboardInterrupt
        web.start(config)


def dump_panels(pyramid: Pyramid):
    for i, face in enumerate(pyramid.faces):
        print(f'Face {i + 1}:')

        for j, panel in enumerate(sorted(face.panels, key=lambda panel: panel.start)):
            print(f'  Panel {j + 1}:')
            print(f'    origin: {panel.geom.origin}')
            print(f'    start:  {panel.start}')

        print()


if __name__ == '__main__':
    console = logging.StreamHandler()
    console.setFormatter(logging.Formatter('%(levelname)s - %(message)s'))
    logger.addHandler(console)

    parser = argparse.ArgumentParser(description='Triangle Light Control')

    parser.add_argument('--max-time', type=float, default=float(60),
                        help='Maximum number of seconds a show will run (default 60)')

    parser.add_argument('--bind', help='Local address to use for sACN')
    parser.add_argument('--simulator', dest='simulator', action='store_true')

    parser.add_argument('--list', action='store_true',
                        help='List available shows')
    parser.add_argument('--panels', action='store_true',
                        help='Show face and panel attributes')
    parser.add_argument('shows', metavar='show_name', type=str, nargs='*',
                        help='name of show (or shows) to run')
    parser.add_argument('--fail-hard', type=bool, default=True,
                        help="For production runs, when shows fail, the show runner moves to the next show")

    args = parser.parse_args()

    if args.list:
        logger.info("Available shows: %s", ', '.join(
            [name for (name, cls) in shows.load_shows()]))
        sys.exit(0)

    if args.simulator:
        sim_host = "localhost"
        sim_port = 4444
        logger.info(f'Using TriSimulator at {sim_host}:{sim_port}')

        model = SimulatorModel(sim_host, port=sim_port)
    else:
        bind = args.bind
        if not bind:
            gateways = netifaces.gateways()[netifaces.AF_INET]

            for _, interface, _ in gateways:
                for a in netifaces.ifaddresses(interface).get(netifaces.AF_INET, []):
                    if a['addr'].startswith('192.168.0'):
                        logger.info(
                            f"Auto-detected Pyramid local IP: {a['addr']}")
                        bind = a['addr']
                        break
                if bind:
                    break

            if not bind:
                parser.error(
                    'Failed to auto-detect local IP. Are you on Pyramid Scheme wifi or ethernet?')

        logger.info("Starting sACN")
        model = sACN(bind)

    pyramid = Pyramid.build_single(model)
    if args.panels:
        dump_panels(pyramid)
        sys.exit(0)

    model.activate(pyramid.cells)

    # TriangleServer only needs model for model.stop()
    app = TriangleServer(model=model, pyramid=pyramid, args=args)

    try:
        app.start()  # start related service threads
        app.go_web()  # enter main blocking event loop
    except Exception:
        logger.exception("Unhandled exception running TRI!")
