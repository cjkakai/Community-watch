from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin

metadata = MetaData(
    naming_convention={
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    }
)

db = SQLAlchemy(metadata=metadata)
bcrypt = Bcrypt()


class PoliceOfficer(db.Model, SerializerMixin):
    __tablename__ = "police_officers"
    serialize_rules = ("-assignments.officer", "-password_hash")

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    badge_number = db.Column(db.String, unique=True, nullable=False)
    rank = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    phone = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    role = db.Column(db.String, default="officer")
    created_at = db.Column(db.DateTime, default=datetime.now)

    assignments = db.relationship("Assignment", back_populates="officer")
    crime_reports = association_proxy("assignments", "crime_report")

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    @validates("phone")
    def validate_phone(self, key, phone):
        if not phone.isdigit() or len(phone) < 10:
            raise ValueError("Phone number must be at least 10 digits.")
        return phone

    @validates("badge_number")
    def validate_badge_number(self, key, badge_number):
        if not badge_number.isdigit() or len(badge_number) < 8:
            raise ValueError("Badge_number must be numeric and at least 8 digits long.")
        return badge_number

    def __repr__(self):
        return f"<PoliceOfficer {self.name} - {self.role}>"


class CrimeCategory(db.Model, SerializerMixin):
    __tablename__ = "crime_categories"
    serialize_rules = ("-crime_reports.crime_category",)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)

    crime_reports = db.relationship(
        "CrimeReport",
        back_populates="crime_category",
        cascade="all, delete-orphan",
    )

    def __repr__(self):
        return f"<CrimeCategory {self.name}>"


class CrimeReport(db.Model, SerializerMixin):
    __tablename__ = "crime_reports"
    serialize_rules = ("-assignments.crime_report",)

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String, nullable=False)
    status = db.Column(db.String, default="open")
    created_at = db.Column(db.DateTime, default=datetime.now)
    crime_category_id = db.Column(db.Integer, db.ForeignKey("crime_categories.id"), nullable=False)

    crime_category = db.relationship("CrimeCategory", back_populates="crime_reports")
    assignments = db.relationship("Assignment", back_populates="crime_report")
    officers = association_proxy("assignments", "officer")

    @validates("status")
    def validate_status(self, key, status):
        allowed = {"open", "closed", "pending"}
        if status not in allowed:
            raise ValueError(f"Status must be one of {allowed}")
        return status

    def __repr__(self):
        return f"<CrimeReport {self.title} - {self.status}>"


class Assignment(db.Model, SerializerMixin):
    __tablename__ = "assignments"
    serialize_rules = ("-officer.assignments", "-crime_report.assignments")

    id = db.Column(db.Integer, primary_key=True)
    role_in_case = db.Column(db.String, nullable=False)
    assigned_at = db.Column(db.DateTime, default=datetime.now)
    crime_report_id = db.Column(db.Integer, db.ForeignKey("crime_reports.id"), nullable=False)
    officer_id = db.Column(db.Integer, db.ForeignKey("police_officers.id"), nullable=False)

    crime_report = db.relationship("CrimeReport", back_populates="assignments")
    officer = db.relationship("PoliceOfficer", back_populates="assignments")

    def __repr__(self):
        return f"<Assignment CrimeReport={self.crime_report_id} Officer={self.officer_id}>"
