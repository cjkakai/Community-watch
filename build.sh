#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Installing Node.js dependencies and building React app..."
cd client
npm ci --only=production
npm run build

# Debug: Show build directory structure
echo "=== BUILD DIRECTORY STRUCTURE ==="
ls -la build/
echo "=== STATIC DIRECTORY ==="
ls -la build/static/ 2>/dev/null || echo "No static directory found"
echo "=== CSS FILES ==="
find build/static -name "*.css" 2>/dev/null || echo "No CSS files found"
echo "=== JS FILES ==="
find build/static -name "*.js" 2>/dev/null || echo "No JS files found"
echo "================================="

cd ..

echo "Setting up database..."
mkdir -p server/migrations

echo "Running database migrations..."
python migrate_db.py

echo "Build completed successfully!"
