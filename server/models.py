from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy import MetaData
from flask_sqlalchemy import SQLAlchemy

from config import db

# Models
class PoliceOfficer(db.Model, SerializerMixin):
    __tablename__ = 'police_officers'
    
    serialize_rules = ('-assignments.officer', '-password_hash')
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    badge_number = db.Column(db.String(20), unique=True, nullable=False)
    rank = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    password_hash = db.Column(db.String(128))
    role = db.Column(db.String(20), default='officer')
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    
    # Relationships
    assignments = db.relationship('Assignment', back_populates='officer', cascade='all, delete-orphan')
    
    def authenticate(self, password):
        # Simple password check - in production, use proper hashing
        return self.password_hash == password

class CrimeCategory(db.Model, SerializerMixin):
    __tablename__ = 'crime_categories'
    
    serialize_rules = ('-crime_reports.category',)
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text)
    severity_level = db.Column(db.Integer, default=1)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    
    # Relationships
    crime_reports = db.relationship('CrimeReport', back_populates='category')

class CrimeReport(db.Model, SerializerMixin):
    __tablename__ = 'crime_reports'
    
    serialize_rules = ('-assignments.crime_report', '-category.crime_reports')
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(20), default='open')
    priority = db.Column(db.String(20), default='medium')
    crime_category_id = db.Column(db.Integer, db.ForeignKey('crime_categories.id'), nullable=False)
    reported_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    
    # Relationships
    category = db.relationship('CrimeCategory', back_populates='crime_reports')
    assignments = db.relationship('Assignment', back_populates='crime_report', cascade='all, delete-orphan')

class Assignment(db.Model, SerializerMixin):
    __tablename__ = 'assignments'
    
    serialize_rules = ('-officer.assignments', '-crime_report.assignments')
    
    id = db.Column(db.Integer, primary_key=True)
    officer_id = db.Column(db.Integer, db.ForeignKey('police_officers.id'), nullable=False)
    crime_report_id = db.Column(db.Integer, db.ForeignKey('crime_reports.id'), nullable=False)
    role_in_case = db.Column(db.String(50), default='investigating')
    assigned_at = db.Column(db.DateTime, server_default=db.func.now())
    status = db.Column(db.String(20), default='active')
    
    # Relationships
    officer = db.relationship('PoliceOfficer', back_populates='assignments')
    crime_report = db.relationship('CrimeReport', back_populates='assignments')
