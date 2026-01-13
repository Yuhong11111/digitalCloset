# Digital Closet

A full-stack application for managing your digital wardrobe.

## Purpose
People own lots of clothing but lack a simple way to track what they have, find items by attribute (e.g., "black hoodie M"), avoid duplicate purchases, and plan outfits. Existing apps feel heavy or social-first. We need a fast, private, inventory-first web app.

## Technologies Used

- Frontend: React, TypeScript, Chakra
- Backend: FastAPI, PostgreSQL (SQLAlchemy)
- Authentication: JWT

## Setup

### Backend

```bash
cd fullstack-app/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cd /Users/yuhong/Desktop/sl/digitalCloset
python init_db.py
uvicorn app.main:app --reload
```

### Frontend

```bash
cd fullstack-app/frontend
npm install
npm start
```

## Environment Variables

Create a `.env` file in the backend directory with:

```
DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/closet_db
JWT_SECRET=your_jwt_secret
```

## Features

- User authentication (login/signup)
- [Add other features here]
