#!/usr/bin/env python3
import os
import sys
sys.path.append('server')

from config import app, db

def deploy():
    """Run deployment tasks."""
    with app.app_context():
        try:
            # Import models to ensure they're registered
            from models import PoliceOfficer, CrimeReport, Assignment, CrimeCategory
            
            # Create all tables
            db.create_all()
            print("Database tables created successfully!")
            
        except Exception as e:
            print(f"Database setup error: {e}")
            raise

if __name__ == '__main__':
    deploy()
