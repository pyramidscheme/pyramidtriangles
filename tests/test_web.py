import queue
import threading
import cherrypy
from cherrypy.test import helper

from core.commands import ShowRuntimeCommand, RunShowCommand
from web import Web

shutdown = threading.Event()
command_queue = queue.LifoQueue()
status_queue = queue.Queue()


class WebTest(helper.CPWebCase):
    @staticmethod
    def setup_server():
        web = Web(
            shutdown,
            command_queue,
            status_queue,
        )
        cherrypy.tree.mount(web, '/', Web.build_config({}))

    def test_index_returns_something(self):
        # index.html basically loads all the other content
        self.getPage('/')
        self.assertStatus(200)
        self.assertInBody('static/js')

    def test_cycle_time(self):
        assert command_queue.empty()

        body = '{"value":30}'
        self.getPage(
            url='/cycle_time',
            headers=[
                ('Content-Type', 'application/json'),
                ('Content-Length', str(len(body))),
            ],
            method='POST',
            body=body,
        )
        self.assertStatus(200)

        assert ShowRuntimeCommand(30) == command_queue.get()
        assert command_queue.empty()

    def test_get_shows(self):
        self.getPage(
            url='/shows',
            headers=[
                ('Content-Type', 'application/json'),
                ('Content-Length', '0'),
            ],
            method='GET',
        )
        self.assertStatus(200)
        self.assertInBody('Warp')

    def test_run_show(self):
        assert command_queue.empty()

        body = '{"value":"Warp"}'
        self.getPage(
            url='/shows',
            headers=[
                ('Content-Type', 'application/json'),
                ('Content-Length', str(len(body))),
            ],
            method='POST',
            body=body,
        )
        self.assertStatus(200)

        assert RunShowCommand('Warp') == command_queue.get()
        assert command_queue.empty()

        body = '{"value":"Invalid"}'
        self.getPage(
            url='/shows',
            headers=[
                ('Content-Type', 'application/json'),
                ('Content-Length', str(len(body))),
            ],
            method='POST',
            body=body,
        )
        self.assertStatus(400)

        body = 'Invalid'
        self.getPage(
            url='/shows',
            headers=[
                ('Content-Type', 'application/json'),
                ('Content-Length', str(len(body))),
            ],
            method='POST',
            body=body,
        )
        self.assertStatus(400)
