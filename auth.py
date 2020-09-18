from hashlib import sha256
from base64 import b64encode

from flask import request
from flask_basicauth import BasicAuth

from models import User
from app import db


class Authenticator(BasicAuth):
    def __init__(self, app, db):
        super().__init__(app)
        self.app = app
        self.db = db

    def authenticate(self):
        auth = request.authorization

        return (
            # make sure to always allow OPTIONS requests for preflight-checks
            request.method == "OPTIONS" or
            (auth and auth.type == "basic" and
             self.check_credentials(auth.username, auth.password))
        )

    def check_credentials(self, username, password):
        user = User.query.get(username)
        if user is not None:
            hashed_pw = Authenticator.hash_password(password)
            if hashed_pw == user.password:
                return True

        return False

    @staticmethod
    def hash_password(password):
        return b64encode(sha256(password.encode()).digest()).decode()

    @staticmethod
    def add_user(username, password):
        hashed_pw = Authenticator.hash_password(password)
        new_user = User(username=username, password=hashed_pw)
        db.session.add(new_user)
        db.session.commit()
