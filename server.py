from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from sqlalchemy import func
import os
import datetime

app = Flask(__name__, static_url_path='', 
            static_folder='Expenditures/build',)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'expenditures.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
ma = Marshmallow(app)

@app.route('/')
@app.route('/home')
def root():
    return app.send_static_file('index.html')

cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

class Expenditure(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80))
    amount = db.Column(db.Integer)
    reason = db.Column(db.String(120))
    created_date = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def __init__(self, username, amount, reason):
        self.username = username
        self.amount = amount
        self.reason = reason


class ExpendituresSchema(ma.Schema):
    class Meta:
        # Fields to expose
        fields = ('id', 'username', 'amount', 'reason', 'created_date')


expenditure_schema = ExpendituresSchema()
expenditures_schema = ExpendituresSchema(many=True)


# endpoint to create new expenditure
@app.route("/api/expenditures", methods=["POST"])
def add_expenditure():
    username = request.json['username']
    amount = request.json['amount']
    reason = request.json['reason']
    
    expenditure = Expenditure(username, amount, reason)

    db.session.add(expenditure)
    db.session.commit()

    return jsonify(expenditure_schema.dump(expenditure))


# endpoint to show all expenditures
@app.route("/api/expenditures", methods=["GET"])
def get_expenditure():
    limit = request.args.get('limit')
    if limit:
        all_expenditures = Expenditure.query.order_by(Expenditure.created_date.desc()).limit(limit).all()
    else:
        all_expenditures = Expenditure.query.all()
    result = expenditures_schema.dump(all_expenditures)
    return jsonify(result)

# endpoint to delete expenditure
@app.route("/api/expenditures/<id>", methods=["DELETE"])
def expenditure_delete(id):
    expenditure = Expenditure.query.get(id)
    db.session.delete(expenditure)
    db.session.commit()

    return expenditure_schema.jsonify(expenditure)

# endpoint to show all expenditures
@app.route("/api/current-status", methods=["GET"])
def get_status():
    expenditure_sum = db.session.query(Expenditure.username, func.sum(Expenditure.amount)).group_by(Expenditure.username).all()
    return jsonify(expenditure_sum)

@app.route('/<path:path>')
def send_static(path):
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(debug=True)