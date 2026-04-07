#!/usr/bin/env python
"""
Initialize PostgreSQL database - creates all tables
Run this script once to set up the database schema:
    cd fullstack-app/backend && python ../../init_db.py
"""
import sys
import os

# Add the backend directory to the path
backend_path = os.path.join(os.path.dirname(__file__), "fullstack-app/backend")
sys.path.insert(0, backend_path)
os.chdir(backend_path)

from app.db.database import Base, engine
from app.db.models import User, ClothItem, StylePreference


def init_db():
    """Create all database tables"""
    print("🔄 Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")
    print("\nCreated tables:")
    print("  - users")
    print("  - cloth_items")
    print("  - style_preferences")


if __name__ == "__main__":
    try:
        init_db()
    except Exception as e:
        print(f"❌ Error creating database: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
