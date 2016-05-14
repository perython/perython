# -*- coding: utf-8 -*-

# Stdlib imports
import json
import urllib2

# Core Flask imports
from flask import Blueprint, request, abort
from flask.views import MethodView

# Third-party app imports
from itsdangerous import JSONWebSignatureSerializer as Serializer, BadSignature
from flask.ext.login import current_user, login_required

# Imports from your apps
from init.flask_init import app
from init.login_manager_init import lm
from init.redis_init import redis
from init.database import db
from .models import User
from .schemas import *


auth = Blueprint('auth', __name__, url_prefix='/api/auth')


@lm.user_loader
def user_loader(user_id):
    return None


@lm.request_loader
def request_loader(request):
    token = request.headers.get('Authentication')
    if token:
        s = Serializer(app.config['SECRET_KEY'])
        try:
            user_id = s.loads(token)['user_id']
        except BadSignature:
            pass
        else:
            user = User.query.filter(User.id == user_id).first()
            if user and user.token == token:
                return user

    return None


@lm.unauthorized_handler
def unauthorized():
    return abort(401)


class LoginView(MethodView):
    def post(self):
        data, errors = UserLoginSchema().load(request.json)
        if errors:
            return json.dumps({'errors': errors})

        user = User.query.filter(User.email == data['email']).first()
        if not user or user.makepswd(data['password']) != user.password:
            abort(400)

        user.token = user.maketoken()
        db.session.add(user)
        db.session.commit()

        return json.dumps({'token': user.token})


class IdentityView(MethodView):
    @login_required
    def get(self):
        data = UserSchema().dump(current_user).data
        return json.dumps(data)


class ChangeTrackView(MethodView):
    # @login_required
    def get(self):
        url = 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=le4o&api_key=a67f8f5b94650194306b7fb1fb1364c1&limit=1&format=json'
        response = urllib2.urlopen(url)
        data = json.loads(response.read())
        track = data['recenttracks']['track'][0]
        print track
        artist_name = track['artist']['#text']
        track_name = track['name']
        print track_name, artist_name

        redis.publish('tornado_events', json.dumps({
            'type': 'landing:track:change',
            'data': {
                'test': 'test'
            }
        }))
        return json.dumps({'success': True})


auth.add_url_rule('/login', view_func=LoginView.as_view('login'))
auth.add_url_rule('/identity', view_func=IdentityView.as_view('identity'))
auth.add_url_rule('/change-track', view_func=ChangeTrackView.as_view('change_track'))
