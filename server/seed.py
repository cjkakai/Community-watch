#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Citizen, PoliceOfficer, CrimeReport, Assignment

fake = Faker()


if __name__ == '__main__':
    with app.app_context():
        print("Clearing database...")
        db.drop_all()
        db.create_all()
        print("Database created!")

        # -------------------------
        # Seed Police Officers
        # -------------------------
        officers = []
        roles = ["officer", "admin"]
        for _ in range(10):
            officer = PoliceOfficer(
                name=fake.name(),
                badge_number=str(randint(10000000, 99999999)),
                rank=rc(["Constable", "Sergeant", "Inspector", "Chief"]),
                email=fake.unique.email(),
                phone=fake.unique.msisdn()[:10],  # Ensure 10 digits
                role=rc(roles)
            )
            officer.set_password("password123")  # Default password
            db.session.add(officer)
            officers.append(officer)

        # -------------------------
        # Seed Crime Categories
        # -------------------------
        categories = []
        for cat_name in ["Theft", "Assault", "Fraud", "Vandalism", "Traffic"]:
            cat = CrimeCategory(name=cat_name)
            db.session.add(cat)
            categories.append(cat)

        # -------------------------
        # Seed Crime Reports
        # -------------------------
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

        # -------------------------
        # Seed Assignments
        # -------------------------
        for report in reports:
            # Assign 1-3 officers randomly to each report
            assigned_officers = rc(officers)
            assignment = Assignment(
                role_in_case=rc(["Lead Investigator", "Support Officer"]),
                crime_report=report,
                officer=assigned_officers
            )
            db.session.add(assignment)

        db.session.commit()
        print("Seeding complete!")
