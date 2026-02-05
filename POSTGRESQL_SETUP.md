# PostgreSQL Database Module Setup

## Files Created/Modified

### 1. **app/db/database.py** (NEW)
- SQLAlchemy engine configuration
- Session factory setup
- Database dependency for FastAPI routes
- Connection pooling configured

### 2. **app/db/models.py** (NEW)
- `User` model - stores user accounts
  - Fields: id, username, password, email, created_at, updated_at
  - Relationships: items (one-to-many with ClothItem)

- `ClothItem` model - stores clothing items
  - Fields: id, owner_id, name, category, color, size, season, image_url, notes, favorite, created_at, updated_at
  - Relationships: owner (many-to-one with User)

### 3. **app/core/config.py** (MODIFIED)
- Added `DATABASE_URL` from environment variables

### 4. **app/db/__init__.py** (MODIFIED)
- Export database utilities for easy importing

### 5. **init_db.py** (NEW - at project root)
- Script to initialize database tables

---

## Setup Instructions

### 1. Ensure PostgreSQL is Running
```bash
# On macOS (if using Homebrew)
brew services start postgresql

# Or start manually
psql postgres
```

### 2. Create the Database
```bash
createdb closet_db
```

### 3. Initialize Tables
```bash
cd /Users/yuhong/Desktop/sl/digitalCloset
python init_db.py
```

Expected output:
```
🔄 Creating database tables...
✅ Database tables created successfully!

Created tables:
  - users
  - cloth_items
```

### 4. Verify Database
```bash
psql closet_db
\dt  # List all tables
```

---

## Environment Variables (Already in .env)

```
DATABASE_URL=postgresql+psycopg2://yuhong@localhost:5432/closet_db
```

---

## Status

All core endpoints and services now use PostgreSQL. 🚀

## Quick Reference

### Using the Database in Routes

```python
from fastapi import Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import User

@router.get("/users/{user_id}")
async def get_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    return user
```

---

## Useful SQL Commands

```bash
# Connect to database
psql closet_db

# List tables
\dt

# Show table schema
\d users
\d cloth_items

# Drop all tables (if needed)
DROP TABLE cloth_items;
DROP TABLE users;
```
