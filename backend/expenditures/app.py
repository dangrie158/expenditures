import os
import re

from flask import Flask
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy

_app = Flask(
    __name__,
    static_url_path="",
    static_folder="../../frontend/build",
)

basedir = os.path.abspath(os.path.dirname(__file__))
_app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(
    os.environ.get("EXPEDITURES_DB_PATH", "/var/expenditures/"),
    "db.sqlite"
)
_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(_app)
ma = Marshmallow(_app)

def setup_app():
    from auth import Authenticator
    from flask_cors import CORS

    CORS(_app, resources={r"/*": {"origins": "*"}})
    Authenticator(_app, db, enforce_paths=(re.compile(r".*/api/.*"),))

_initialized = False

def get_app():
    global _initialized
    if not _initialized:
        setup_app()
        _initialized = True
    return _app
