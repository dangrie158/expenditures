import datetime
from collections import Counter

from app import db, get_app
from flask import jsonify, request
from models import *
from sqlalchemy import func

app = get_app()


@app.route("/")
@app.route("/home")
def root():
    return app.send_static_file("index.html")


@app.route("/api/expenditures", methods=["POST"])
def add_expenditure():
    tags = request.json.pop("tags")

    expenditure = Expenditure(**request.json)
    for tag in tags:
        instance = Tag.query.filter(Tag.name == tag["name"]).first()
        expenditure.tags.append(instance)
    db.session.add(expenditure)
    db.session.commit()

    return jsonify(ExpenditureSchema().dump(expenditure))


@app.route("/api/expenditures/<id>", methods=["PUT"])
def update_expenditure(id):
    expenditure = Expenditure.query.get(id)

    tags = request.json.pop("tags", [])
    expenditure.tags = [Tag.query.filter(Tag.name == tag["name"]).first() for tag in tags]
    expenditure.username = request.json.pop("username")
    expenditure.reason = request.json.pop("reason")
    expenditure.amount = request.json.pop("amount")
    db.session.commit()

    return jsonify(ExpenditureSchema().dump(expenditure))


@app.route("/api/expenditures", methods=["GET"])
def get_expenditure():
    limit = request.args.get("limit")
    tag = request.args.get("tag")
    date = request.args.get("date")

    year = None
    month = None
    if date:
        date_components = date.split("-")
        if len(date_components) == 2:
            year, month = date_components
        else:
            year = date_components[0]

    selected_expenditures = Expenditure.query.order_by(Expenditure.created_date.desc())

    if tag:
        selected_expenditures = selected_expenditures.join(
            tags_to_expenditures, tags_to_expenditures.columns.expenditure_id == Expenditure.id
        ).filter(tags_to_expenditures.columns.tag_id == int(tag))

    if month:
        selected_expenditures = selected_expenditures.filter(
            func.strftime("%m", Expenditure.created_date) == str(month)
        )

    if year:
        selected_expenditures = selected_expenditures.filter(func.strftime("%Y", Expenditure.created_date) == str(year))

    if limit:
        selected_expenditures = selected_expenditures.limit(limit)

    result = ExpenditureSchema(many=True).dump(selected_expenditures.all())
    return jsonify(result)


@app.route("/api/expenditures/summary", methods=["GET"])
def expenditure_summary():
    total = db.session.query(func.sum(Expenditure.amount)).all()[0][0]

    result_year = (
        db.session.query(func.strftime("%Y", Expenditure.created_date), func.sum(Expenditure.amount))
        .group_by(func.strftime("%Y", Expenditure.created_date))
        .order_by(Expenditure.created_date.desc())
        .all()
    )

    current_year = datetime.date.today().year
    result_month = (
        db.session.query(
            func.strftime("%Y-%m", Expenditure.created_date),
            func.sum(Expenditure.amount),
        )
        .filter(func.strftime("%Y", Expenditure.created_date) == str(current_year))
        .group_by(func.strftime("%Y-%m", Expenditure.created_date))
        .order_by(Expenditure.created_date.desc())
        .all()
    )

    return jsonify({"total": total, "by_year": result_year, "by_month": result_month})


@app.route("/api/expenditures/<id>", methods=["DELETE"])
def expenditure_delete(id):
    expenditure = Expenditure.query.get(id)
    db.session.delete(expenditure)
    db.session.commit()

    return ExpenditureSchema().jsonify(expenditure)


@app.route("/api/tags", methods=["POST"])
def add_tag():
    tag = Tag(**request.json)
    db.session.add(tag)
    db.session.commit()

    return jsonify(TagSchema().dump(tag))


@app.route("/api/tags", methods=["GET"])
def get_tags():
    all_tags = Tag.query.all()
    result = TagSchema(many=True).dump(all_tags)
    return jsonify(result)


@app.route("/api/shops", methods=["GET"])
def get_shops():
    all_expenditures = Expenditure.query.all()
    result = Counter([expenditure.reason for expenditure in all_expenditures])
    return jsonify(sorted(result.keys(), key=lambda k: result[k], reverse=True))


@app.route("/api/tags/<id>", methods=["GET"])
def tag_detail(id):
    tag = Tag.query.get(id)

    total = (
        db.session.query(func.sum(Expenditure.amount))
        .join(tags_to_expenditures, tags_to_expenditures.columns.expenditure_id == Expenditure.id)
        .filter(tags_to_expenditures.columns.tag_id == id)
        .all()[0][0]
    )

    result_year = (
        db.session.query(func.strftime("%Y", Expenditure.created_date), func.sum(Expenditure.amount))
        .join(tags_to_expenditures, tags_to_expenditures.columns.expenditure_id == Expenditure.id)
        .filter(tags_to_expenditures.columns.tag_id == id)
        .group_by(func.strftime("%Y", Expenditure.created_date))
        .order_by(Expenditure.created_date.desc())
        .all()
    )

    current_year = datetime.date.today().year
    result_month = (
        db.session.query(
            func.strftime("%Y-%m", Expenditure.created_date),
            func.sum(Expenditure.amount),
        )
        .join(tags_to_expenditures, tags_to_expenditures.columns.expenditure_id == Expenditure.id)
        .filter(tags_to_expenditures.columns.tag_id == id)
        .filter(func.strftime("%Y", Expenditure.created_date) == str(current_year))
        .group_by(func.strftime("%Y-%m", Expenditure.created_date))
        .order_by(Expenditure.created_date.desc())
        .all()
    )

    return jsonify(
        {
            **TagSchema().dump(tag),
            "total": total,
            "by_year": result_year,
            "by_month": result_month,
        }
    )


@app.route("/api/tags/<id>", methods=["DELETE"])
def tag_delete(id):
    tag = Tag.query.get(id)
    db.session.delete(tag)
    db.session.commit()

    return TagSchema().jsonify(tag)


@app.route("/api/tags/summary", methods=["GET"])
def get_tag_expenditures():
    result = (
        db.session.query(Tag, func.sum(Expenditure.amount))
        .join(tags_to_expenditures, tags_to_expenditures.columns.expenditure_id == Expenditure.id)
        .join(Tag, tags_to_expenditures.columns.tag_id == Tag.id)
        .group_by(Tag.id)
        .all()
    )
    return jsonify([{**TagSchema().dump(e[0]), "sum": e[1]} for e in result])


@app.route("/api/current-status", methods=["GET"])
def get_status():
    expenditure_sum = (
        db.session.query(Expenditure.username, func.sum(Expenditure.amount)).group_by(Expenditure.username).all()
    )
    return jsonify([tuple(row) for row in expenditure_sum])


@app.route("/<path:path>")
def send_static(path):
    return app.send_static_file("index.html")
