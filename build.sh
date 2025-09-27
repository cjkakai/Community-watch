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

echo "Running database migrations..."
cd server
flask db upgrade
cd ..

echo "Build completed successfully!"