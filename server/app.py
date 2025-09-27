#!/usr/bin/env python3
import os
from flask import Flask, jsonify, request, session, send_from_directory
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_bcrypt import Bcrypt
from flask_cors import CORS

from config import DevelopmentConfig, ProductionConfig
from models import db, bcrypt, PoliceOfficer, CrimeCategory, CrimeReport, Assignment
from decorators import rank_required, login_required

# Use ProductionConfig on Render, DevelopmentConfig locally
config = ProductionConfig if os.environ.get('RENDER') else DevelopmentConfig

app = Flask(__name__)
app.config.from_object(config)

db.init_app(app)
bcrypt.init_app(app)
migrate = Migrate(app, db)
api = Api(app)
CORS(app)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    officer = PoliceOfficer.query.filter_by(email=email).first()
    if officer and officer.check_password(password):
        session["user_id"] = officer.id
        session["role"] = officer.role
        return {"message": f"Logged in as {officer.role}"}, 200
    return {"error": "Invalid email or password"}, 401

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return {"message": "Logged out successfully"}, 200


class PoliceOfficerResource(Resource):
    def get(self, id=None):
        if id:
            officer = PoliceOfficer.query.get_or_404(id)
            return officer.to_dict()
        officers = PoliceOfficer.query.all()
        return [o.to_dict() for o in officers], 200

    def post(self):
        data = request.get_json()
        try:
            officer = PoliceOfficer(
                name=data["name"],
                badge_number=data["badge_number"],
                rank=data["rank"],
                email=data["email"],
                phone=data["phone"],
                role=data.get("role", "officer")
            )
            officer.set_password(data["password"])
            db.session.add(officer)
            db.session.commit()
            return officer.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 400

    def patch(self, id):
        officer = PoliceOfficer.query.get_or_404(id)
        data = request.get_json()
        for field, value in data.items():
            if field == "password":
                officer.set_password(value)
            else:
                setattr(officer, field, value)
        db.session.commit()
        return officer.to_dict()

    @rank_required
    def delete(self, id):
        officer = PoliceOfficer.query.get_or_404(id)
        db.session.delete(officer)
        db.session.commit()
        return {"message": "Officer deleted successfully"}, 204


class CrimeReportResource(Resource):
    def get(self, id=None):
        if id:
            report = CrimeReport.query.get_or_404(id)
            return report.to_dict()
        reports = CrimeReport.query.all()
        return [r.to_dict() for r in reports], 200

    @login_required
    def post(self):
        data = request.get_json()
        try:
            report = CrimeReport(
                title=data.get("title"),
                description=data.get("description"),
                location=data.get("location"),
                status=data.get("status", "open"),
                crime_category_id=data["crime_category_id"]
            )
            db.session.add(report)
            db.session.commit()
            return report.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 400

    def patch(self, id):
        report = CrimeReport.query.get_or_404(id)
        data = request.get_json()
        for field, value in data.items():
            setattr(report, field, value)
        db.session.commit()
        return report.to_dict()

    def delete(self, id):
        report = CrimeReport.query.get_or_404(id)
        db.session.delete(report)
        db.session.commit()
        return {"message": "Report deleted"}, 204


class AssignmentResource(Resource):
    def get(self, id=None):
        if id:
            assignment = Assignment.query.get_or_404(id)
            return assignment.to_dict()
        assignments = Assignment.query.all()
        return [a.to_dict() for a in assignments], 200
    
    @rank_required
    def post(self):
        data = request.get_json()
        try:
            assignment = Assignment(
                role_in_case=data["role_in_case"],
                crime_report_id=data["crime_report_id"],
                officer_id=data["officer_id"],
            )
            db.session.add(assignment)
            db.session.commit()
            return assignment.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 400


class CrimeCategoryResource(Resource):
    def get(self, id=None):
        if id:
            category = CrimeCategory.query.get_or_404(id)
            return category.to_dict()
        categories = CrimeCategory.query.all()
        return [c.to_dict() for c in categories], 200

    def post(self):
        data = request.get_json()
        try:
            category = CrimeCategory(name=data["name"])
            db.session.add(category)
            db.session.commit()
            return category.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 400

# Add /api prefix to all API resources
api.add_resource(PoliceOfficerResource, "/api/officers", "/api/officers/<int:id>")
api.add_resource(CrimeReportResource, "/api/reports", "/api/reports/<int:id>")
api.add_resource(AssignmentResource, "/api/assignments", "/api/assignments/<int:id>")
api.add_resource(CrimeCategoryResource, "/api/categories", "/api/categories/<int:id>")


# Debug route to check file paths
@app.route('/debug')
def debug_info():
    server_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(server_dir)
    build_dir = os.path.join(project_root, "client", "build")
    static_dir = os.path.join(build_dir, "static")
    build_exists = os.path.exists(build_dir)
    static_exists = os.path.exists(static_dir)
    
    build_contents = []
    static_contents = []
    
    if build_exists:
        try:
            build_contents = os.listdir(build_dir)
        except:
            build_contents = ["Error reading build directory"]
    
    if static_exists:
        try:
            static_contents = os.listdir(static_dir)
        except:
            static_contents = ["Error reading static directory"]
    
    return {
        "server_dir": server_dir,
        "project_root": project_root,
        "build_dir": build_dir,
        "static_dir": static_dir,
        "build_exists": build_exists,
        "static_exists": static_exists,
        "build_contents": build_contents,
        "static_contents": static_contents,
    }

# Serve static files (CSS, JS, images)
@app.route("/static/<path:filename>")
def serve_static(filename):
    server_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(server_dir)
    build_dir = os.path.join(project_root, "client", "build")
    
    # Serve from build/static/ directory
    return send_from_directory(os.path.join(build_dir, "static"), filename)

# React frontend routes - this should be LAST
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    server_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(server_dir)
    build_dir = os.path.join(project_root, "client", "build")
    
    # Check if build directory exists
    if not os.path.exists(build_dir):
        return f"Build directory not found at: {build_dir}", 404
    
    # Handle static files (CSS, JS, images, etc.)
    if path.startswith('static/'):
        file_path = os.path.join(build_dir, path)
        if os.path.exists(file_path):
            return send_from_directory(build_dir, path)
    
    # Handle other static assets (favicon, manifest, etc.)
    if path != "" and os.path.exists(os.path.join(build_dir, path)):
        return send_from_directory(build_dir, path)
    
    # Serve index.html for all routes (SPA routing)
    index_path = os.path.join(build_dir, "index.html")
    if os.path.exists(index_path):
        return send_from_directory(build_dir, "index.html")
    else:
        return f"index.html not found at: {index_path}", 404


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(port=5555, debug=True)