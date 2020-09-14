import datetime

from sqlalchemy import event

from app import db, ma

tags = db.Table('tags',
                db.Column('tag_id', db.Integer, db.ForeignKey(
                    'tag.id'), primary_key=True),
                db.Column('expenditure_id', db.Integer, db.ForeignKey(
                    'expenditure.id'), primary_key=True)
                )


class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True)
    icon = db.Column(db.String(60))
    color = db.Column(db.String(60))

    @staticmethod
    def insert_initial_values(*args, **kwargs):
        db.session.add(Tag(name='Lebensmittel',
                           color='primary', icon="restaurant"))
        db.session.add(Tag(name='Drogerie',
                           color='secondary', icon="water"))
        db.session.add(Tag(name='Aktivitäten',
                           color='tertiary', icon="beer"))
        db.session.add(Tag(name='Urlaub',
                           color='success', icon="airplane"))
        db.session.commit()


class Expenditure(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80))
    amount = db.Column(db.Integer)
    _reason = db.Column("reason", db.String(120))
    created_date = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    tags = db.relationship(Tag, secondary=tags, lazy='subquery',
                           backref=db.backref('expenditures', lazy=True))

    @ property
    def reason(self):
        return self._reason.title()

    @reason.setter
    def reason(self, reason):
        self._reason = reason


@staticmethod
def insert_initial_values(*args, **kwargs):
    db.session.add(Expenditure(username='Dani',
                               amount=0, reason="Übertrag"))
    db.session.add(Expenditure(username='Cram',
                               amount=0, reason="Übertrag"))
    db.session.commit()


event.listen(Expenditure.__table__, 'after_create',
             Expenditure.insert_initial_values)

event.listen(Tag.__table__, 'after_create',
             Tag.insert_initial_values)


class TagSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'icon', 'color')


class ExpenditureSchema(ma.Schema):
    tags = ma.Nested(TagSchema, many=True)

    class Meta:
        fields = ('id', 'username', 'amount', 'reason', 'created_date', 'tags')
