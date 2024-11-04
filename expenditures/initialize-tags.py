from expenditures.app import db
from expenditures.models import Expenditure, Tag

for e in Expenditure.query.all():
    for t in Tag.query.all():
        print(f"\t{t.id:<3}{t.name}")

    print(f"{e.reason:20}{e.amount / 100:>6}")

    default_tags = {str(t.id) for t in e.tags}

    if e.reason.lower() in (
        "edeka",
        "kaufland",
        "rewe",
        "essen",
        "eier",
        "dm",
        "aldi",
        "lidl",
        "real",
        "netto",
    ):
        new_tag = Tag.query.filter(Tag.name == "Lebensmittel").first()
        default_tags.add(str(new_tag.id))

    if e.reason.lower() in ("dm",):
        new_tag = Tag.query.filter(Tag.name == "Drogerie").first()
        default_tags.add(str(new_tag.id))

    if e.reason.lower() in ("unithekle", "bier", "biergarten"):
        new_tag = Tag.query.filter(Tag.name == "Aktivitäten").first()
        default_tags.add(str(new_tag.id))

    if e.reason.lower() in ("hotel", "flug"):
        new_tag = Tag.query.filter(Tag.name == "Urlaub").first()
        default_tags.add(str(new_tag.id))

    selected_tags = input(f"[{', '.join(default_tags)+']':<10}?> ")
    if not selected_tags:
        new_tags = [int(n) for n in default_tags]
    else:
        new_tags_str = selected_tags.split(",")
        new_tags = [int(n) for n in new_tags_str]

    new_objects = [Tag.query.get(id) for id in new_tags]
    print(f"objects now tagged with {[n.name for n in new_objects]}")
    print("\n" * 3)
    e.tags = new_objects
    db.session.commit()
