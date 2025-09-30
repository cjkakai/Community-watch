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

        # -----------------
        # Seed Police Officers
        # -----------------
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
            officer.password = "password123"  # Use the password setter
            db.session.add(officer)
            officers.append(officer)

        # -----------------
        # Seed Crime Categories
        # -----------------
        categories = []
        for name in ["Theft", "Assault", "Fraud", "Vandalism", "Traffic"]:
            category = CrimeCategory(name=name)
            db.session.add(category)
            categories.append(category)

        db.session.commit()

        # -----------------
        # Seed Crime Reports
        # -----------------
        reports_data = [
            ("Pickpocketing at the market", "A victim reported wallet stolen while shopping.", "Downtown Market", "open", "Theft"),
            ("Car vandalized", "Vehicle windows smashed during the night.", "5th Avenue Parking Lot", "open", "Vandalism"),
            ("Online scam", "Resident fell victim to an online shopping fraud.", "Sunset Apartments", "pending", "Fraud"),
            ("Bar fight", "Multiple people involved in physical altercation.", "Blue Moon Bar", "open", "Assault"),
            ("Traffic accident", "Two cars collided at intersection, minor injuries reported.", "Maple St & 10th Ave", "pending", "Traffic"),
            ("Home burglary", "Break-in reported at residential home, electronics stolen.", "Greenwood Estate", "resolved", "Theft"),
            ("Graffiti", "Graffiti painted on public library walls.", "Central Library", "open", "Vandalism"),
            ("Credit card fraud", "Unauthorized transactions reported by victim.", "Downtown Bank", "pending", "Fraud"),
            ("Road rage incident", "Driver attacked another motorist with a blunt object.", "Highway 7", "open", "Assault"),
            ("Hit-and-run", "Car struck pedestrian and fled the scene.", "Main Street", "pending", "Traffic"),
        ]

        reports = []
        for title, desc, location, status, cat_name in reports_data:
            category = next((c for c in categories if c.name == cat_name), None)
            if not category:
                continue
            report = CrimeReport(
                title=title,
                description=desc,
                location=location,
                status=status,
                crime_category_id=category.id
            )
            db.session.add(report)
            reports.append(report)

        db.session.commit()

        # -----------------
        # Seed Assignments
        # -----------------
        roles_in_case = ["investigating", "patrolling", "reporting"]
        assignment_statuses = ["active", "completed"]

        for report in reports:
            assigned_officers = sample(officers, k=randint(1, 3))  # 1 to 3 officers per report
            for officer in assigned_officers:
                assignment = Assignment(
                    officer_id=officer.id,
                    crime_report_id=report.id,
                    role_in_case=rc(roles_in_case),
                    status=rc(assignment_statuses)
                )
                db.session.add(assignment)

        db.session.commit()

        print("Seeding completed with officers, categories, reports, and assignments!")
