#!/usr/bin/env python3
import os
from server.config import app, db
from flask_migrate import upgrade

def deploy():
    """Run deployment tasks."""
    with app.app_context():
        # Create database tables
        db.create_all()
        
        # Migrate database to latest revision
        try:
            upgrade()
            print("Database migration completed successfully!")
        except Exception as e:
            print(f"Migration error (this might be normal for first deploy): {e}")
            # For first deployment, just create all tables
            db.create_all()
            print("Database tables created successfully!")

if __name__ == '__main__':
    deploy()