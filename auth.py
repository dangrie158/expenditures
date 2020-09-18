from hashlib import sha256
from base64 import b64encode

from flask_basicauth import BasicAuth

from models import User


class Authenticator(BasicAuth):
    def __init__(self, app, db):
        super().__init__(app)
        self.app = app
        self.db = db

    def check_credentials(self, username, password):
        user = User.query.get(username)
        if user is not None:
            hashed_pw = b64encode(sha256(password.encode()).digest()).decode()
            if hashed_pw == user.password:
                return True

        return False
