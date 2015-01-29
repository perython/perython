# coding: utf-8
import json
import time
import sockjs.tornado
import tornado.httpserver
import tornado.ioloop
import tornado.web
from tornado.options import define, options, parse_command_line
from toredis import Client

from app import app
print app.config['TORNADO_PORT']
print app.config['TORNADO_HOST']
define('port', default=app.config['TORNADO_PORT'], help='run on the given port', type=int)
define('host', default=app.config['TORNADO_HOST'], help='The host')


class RouterConnection(sockjs.tornado.SockJSConnection):
    ip = None
    user_id = None
    participants = set()

    def on_open(self, info):
        # adds new participant
        # this means somebody opened new page no matter logged in or not
        self.ip = info.ip
        self.participants.add(self)

        print u'ON_OPEN: {} joined'.format(self.ip)
        self.print_participants()

    def on_message(self, raw_data):
        # events from front
        msg = ''
        data = json.loads(raw_data)
        message_type = data.get('type', '')
        if message_type == 'landing':
            self.user_id = 'anonymous'
            msg = u'landing'.format(message_type)

        print u'ON_MESSAGE: {}'.format(msg)
        self.print_participants()

    def on_close(self):
        # user closed page or started to reload it
        self.participants.remove(self)

        print u'ON_CLOSE: {} left'.format(self.ip)
        self.print_participants()

    def print_participants(self):
        print u'ALL_USERS {} <IP/USER_ID>: {} \n'.format(
            time.ctime(),
            ', '.join(['{}/{}'.format(p.ip, p.user_id) for p in self.participants])
        )


def tornado_events(message):
    # we process all messages from backend and deal with them carefully
    type_data, event, raw_data = message
    data = json.loads(raw_data)
    message_type = data.get('type')
    message_data = data.get('data', {})

    if message_type == 'landing:track:change':
        for participant in RouterConnection.participants:
            if participant.user_id == 'anonymous':
                participant.send(message_data)

    elif message_type == 'admin:':
        user_id = data.get('user_id', None)
        for participant in RouterConnection.participants:
            if participant.user_id == user_id:
                participant.send(message_data)

application = tornado.web.Application(
    sockjs.tornado.SockJSRouter(RouterConnection, '/sock').urls
)


if __name__ == '__main__':
    parse_command_line()
    import logging
    logging.getLogger().setLevel(logging.DEBUG)

    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(options.port, address=options.host)

    client = Client()
    client.connect()
    client.subscribe('tornado_events', callback=tornado_events)

    tornado.ioloop.IOLoop.instance().start()
