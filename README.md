# Digital Closet

A full-stack application for managing your digital wardrobe.

## Purpose
People own lots of clothing but lack a simple way to track what they have, find items by attribute (e.g., "black hoodie M"), avoid duplicate purchases, and plan outfits. Existing apps feel heavy or social-first. We need a fast, private, inventory-first web app.

## Technologies Used

- Frontend: React, TypeScript, Tailwind CSS
- Backend: FastAPI, MongoDB
- Authentication: JWT

## Setup

### Backend

```bash
cd fullstack-app/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
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
MONGODB_URL=your_mongodb_url
JWT_SECRET=your_jwt_secret
```

## Features

- User authentication (login/signup)
- [Add other features here]