#!/usr/bin/env python3

from random import randint, choice as rc, sample
from faker import Faker
from app import app
from models import db, PoliceOfficer, CrimeCategory, CrimeReport, Assignment

fake = Faker()

if __name__ == "__main__":
    with app.app_context():
    
        print("Clearing database...")
        db.drop_all()
        db.create_all()
        print("Database created!")

        officers = []
        roles = ["officer", "admin"]
        for _ in range(10):
            officer = PoliceOfficer(
                name=fake.name(),
                badge_number=str(randint(10000000, 99999999)),
                rank=rc(["Constable", "Sergeant", "Inspector", "Chief"]),
                email=fake.unique.email(),
                phone=fake.unique.msisdn()[:10],
                role=rc(roles)
            )
            officer.set_password("password123")
            db.session.add(officer)
            officers.append(officer)

        categories = []
        for name in ["Theft", "Assault", "Fraud", "Vandalism", "Traffic"]:
            category = CrimeCategory(name=name)
            db.session.add(category)
            categories.append(category)


        reports = []
        for _ in range(15):
            report = CrimeReport(
                title=fake.sentence(nb_words=4),
                description=fake.paragraph(),
                location=fake.city(),
                status=rc(["open", "closed", "pending"]),
                crime_category=rc(categories)
            )
            db.session.add(report)
            reports.append(report)

        for report in reports:
            assigned_officers = sample(officers, k=randint(1, min(3, len(officers))))
            for officer in assigned_officers:
                assignment = Assignment(
                    role_in_case=rc(["Lead Investigator", "Support Officer"]),
                    crime_report=report,
                    officer=officer
                )
                db.session.add(assignment)

        db.session.commit()
        print("Seeding complete!")
