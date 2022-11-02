import os
import re

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

_app = Flask(
    __name__,
    static_url_path="",
    static_folder="Expenditures/build",
)

basedir = os.path.abspath(os.path.dirname(__file__))
_app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(
    basedir, "expenditures.sqlite"
)
_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(_app)
ma = Marshmallow(_app)


def setup_app():
    from flask_marshmallow import Marshmallow
    from flask_cors import CORS
    from auth import Authenticator

    cors = CORS(_app, resources={r"/*": {"origins": "*"}})

    basic_auth = Authenticator(_app, db, enforce_paths=(re.compile(r".*/api/.*"),))


_initialized = False


def get_app():
    global _initialized
    if not _initialized:
        setup_app()
        _initialized = True
    return _app
