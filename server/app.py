#!/usr/bin/env python3

# Standard library imports
import os

# Remote library imports
from flask import Flask, request, make_response, jsonify, send_from_directory
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_cors import CORS

# Local imports
from config import app, db, api
from models import PoliceOfficer, CrimeReport, Assignment, CrimeCategory

# Add CORS
CORS(app)

# Get the absolute path to the client build directory
build_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "client", "build")

# Configure Flask to serve static files
app.static_folder = build_dir
app.static_url_path = ''

# Health check
@app.route('/health')
def health_check():
    return make_response(jsonify({"status": "healthy", "message": "Community Watch API is running"}), 200)

# Authentication routes
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return make_response(jsonify({"error": "Email and password required"}), 400)
    
    officer = PoliceOfficer.query.filter_by(email=email).first()
    
    if officer and officer.authenticate(password):
        return make_response(jsonify({
            "message": "Login successful",
            "officer": officer.to_dict()
        }), 200)
    else:
        return make_response(jsonify({"error": "Invalid credentials"}), 401)

@app.route('/logout', methods=['POST'])
def logout():
    return make_response(jsonify({"message": "Logout successful"}), 200)

# Serve React App - this should be last
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    if path != "" and os.path.exists(os.path.join(build_dir, path)):
        return send_from_directory(build_dir, path)
    else:
        return send_from_directory(build_dir, "index.html")

# Resource classes
class PoliceOfficerResource(Resource):
    def get(self, id=None):
        if id:
            officer = PoliceOfficer.query.get_or_404(id)
            return make_response(jsonify(officer.to_dict()), 200)
        else:
            officers = [officer.to_dict() for officer in PoliceOfficer.query.all()]
            return make_response(jsonify(officers), 200)
    
    def post(self):
        data = request.get_json()
        
        try:
            new_officer = PoliceOfficer(
                name=data['name'],
                badge_number=data['badge_number'],
                rank=data['rank'],
                email=data['email'],
                phone=data['phone'],
                role=data.get('role', 'officer')
            )
            new_officer.password_hash = data['password']
            
            db.session.add(new_officer)
            db.session.commit()
            
            return make_response(jsonify(new_officer.to_dict()), 201)
        except Exception as e:
            return make_response(jsonify({"error": str(e)}), 400)
    
    def patch(self, id):
        officer = PoliceOfficer.query.get_or_404(id)
        data = request.get_json()
        
        for key, value in data.items():
            if hasattr(officer, key) and key != 'id':
                setattr(officer, key, value)
        
        db.session.commit()
        return make_response(jsonify(officer.to_dict()), 200)
    
    def delete(self, id):
        officer = PoliceOfficer.query.get_or_404(id)
        db.session.delete(officer)
        db.session.commit()
        return make_response(jsonify({"message": "Officer deleted"}), 200)

class CrimeReportResource(Resource):
    def get(self, id=None):
        if id:
            report = CrimeReport.query.get_or_404(id)
            return make_response(jsonify(report.to_dict()), 200)
        else:
            reports = [report.to_dict() for report in CrimeReport.query.all()]
            return make_response(jsonify(reports), 200)
    
    def post(self):
        data = request.get_json()
        
        try:
            new_report = CrimeReport(
                title=data['title'],
                description=data['description'],
                location=data['location'],
                crime_category_id=data['crime_category_id'],
                status=data.get('status', 'open')
            )
            
            db.session.add(new_report)
            db.session.commit()
            
            return make_response(jsonify(new_report.to_dict()), 201)
        except Exception as e:
            return make_response(jsonify({"error": str(e)}), 400)
    
    def patch(self, id):
        report = CrimeReport.query.get_or_404(id)
        data = request.get_json()
        
        for key, value in data.items():
            if hasattr(report, key) and key != 'id':
                setattr(report, key, value)
        
        db.session.commit()
        return make_response(jsonify(report.to_dict()), 200)
    
    def delete(self, id):
        report = CrimeReport.query.get_or_404(id)
        db.session.delete(report)
        db.session.commit()
        return make_response(jsonify({"message": "Report deleted"}), 200)

class AssignmentResource(Resource):
    def get(self, id=None):
        if id:
            assignment = Assignment.query.get_or_404(id)
            return make_response(jsonify(assignment.to_dict()), 200)
        else:
            assignments = [assignment.to_dict() for assignment in Assignment.query.all()]
            return make_response(jsonify(assignments), 200)
    
    def post(self):
        data = request.get_json()
        
        try:
            new_assignment = Assignment(
                officer_id=data['officer_id'],
                crime_report_id=data['crime_report_id'],
                role_in_case=data['role_in_case']
            )
            
            db.session.add(new_assignment)
            db.session.commit()
            
            return make_response(jsonify(new_assignment.to_dict()), 201)
        except Exception as e:
            return make_response(jsonify({"error": str(e)}), 400)
    
    def patch(self, id):
        assignment = Assignment.query.get_or_404(id)
        data = request.get_json()
        
        for key, value in data.items():
            if hasattr(assignment, key) and key != 'id':
                setattr(assignment, key, value)
        
        db.session.commit()
        return make_response(jsonify(assignment.to_dict()), 200)
    
    def delete(self, id):
        assignment = Assignment.query.get_or_404(id)
        db.session.delete(assignment)
        db.session.commit()
        return make_response(jsonify({"message": "Assignment deleted"}), 200)

class CrimeCategoryResource(Resource):
    def get(self, id=None):
        if id:
            category = CrimeCategory.query.get_or_404(id)
            return make_response(jsonify(category.to_dict()), 200)
        else:
            categories = [category.to_dict() for category in CrimeCategory.query.all()]
            return make_response(jsonify(categories), 200)

# Add resources to API
api.add_resource(PoliceOfficerResource, "/officers", "/officers/<int:id>")
api.add_resource(CrimeReportResource, "/reports", "/reports/<int:id>")
api.add_resource(AssignmentResource, "/assignments", "/assignments/<int:id>")
api.add_resource(CrimeCategoryResource, "/categories", "/categories/<int:id>")

if __name__ == '__main__':
    app.run(port=5555, debug=True)
