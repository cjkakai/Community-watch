#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Installing Node.js dependencies and building React app..."
cd client
npm ci --only=production
npm run build
cd ..

echo "Setting up database..."
# Ensure migrations directory exists
mkdir -p server/migrations

echo "Running database migrations..."
python migrate_db.py

echo "Build completed successfully!"
