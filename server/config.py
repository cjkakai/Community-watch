import os
from dotenv import load_dotenv

# Load variables from .env if present (useful for local testing)
basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, ".env"))


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "super-secret-key")
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")  # Must be set in Render
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class DevelopmentConfig(Config):
    DEBUG = True
    # Optional: fallback to SQLite for local dev
    if not SQLALCHEMY_DATABASE_URI:
        SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(basedir, 'app.db')}"


class ProductionConfig(Config):
    DEBUG = False
    # Ensure database URL exists in production
    if not SQLALCHEMY_DATABASE_URI:
        raise ValueError("DATABASE_URL environment variable not set!")
