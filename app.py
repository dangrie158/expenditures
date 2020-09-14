

from flask import Flask
from flask_sqlalchemy import SQLAlchemy

from flask_marshmallow import Marshmallow
from flask_cors import CORS

import os

app = Flask(__name__, static_url_path='',
            static_folder='Expenditures/build',)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + \
    os.path.join(basedir, 'expenditures.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

ma = Marshmallow(app)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
