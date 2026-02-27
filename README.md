# Digital Closet

A full-stack application for managing your digital wardrobe.

## Purpose
People own lots of clothing but lack a simple way to track what they have, find items by attribute (e.g., "black hoodie M"), avoid duplicate purchases, and plan outfits. Existing apps feel heavy or social-first. We need a fast, private, inventory-first web app.

## Architecture Overview

The Digital Closet is a full-stack web application with a decoupled frontend and backend.

- **Frontend**: React + TypeScript for UI and state management
- **Backend**: FastAPI REST API
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Auth**: JWT-based authentication
- **AI Services**: External AI API for outfit recommendations

The frontend communicates with the backend via RESTful JSON APIs.


## Setup

### Backend

```bash
cd fullstack-app/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Create .env in fullstack-app/backend before running init_db.py
# First-time DB init (run from the backend folder)
python ../../init_db.py

uvicorn app.main:app --reload
```

### Frontend

```bash
cd fullstack-app/frontend
npm install
npm start
```

## Authentication

- Users authenticate using email and password
- On successful login, the backend issues a JWT
- The frontend stores the token and includes it in the `Authorization` header
- Protected routes require a valid JWT


## Environment Variables

Create a `.env` file in the backend directory with:

```
DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/closet_db
JWT_SECRET=your_jwt_secret
```

## Selenium E2E Test (Signup Smoke)

This project includes a Selenium smoke test that validates:
- Open login page
- Switch to signup mode
- Register a unique user
- Redirect to `/closet`

### Prerequisites

- Backend running at `http://localhost:8000`
- Frontend running at `http://localhost:3000`
- Google Chrome installed

### Install E2E dependencies

```bash
cd fullstack-app/frontend
npm run test:e2e:install
```

### Run

```bash
cd fullstack-app/frontend
npm run test:e2e
# or run with visible browser
E2E_HEADLESS=false npm run test:e2e
```

Run a single test file:

```bash
cd fullstack-app/frontend
python3 -m pytest tests/e2e/tests/test_home_page_selenium.py -q
```

Optional env vars:
- `E2E_FRONTEND_URL` (default: `http://localhost:3000`)
- `E2E_HEADLESS` (`true` or `false`, default: `true`)

## Features

- User authentication (login/signup)
- Closet inventory with photos, notes, and favorites
- AI stylist assistant for outfit suggestions
- Outfit planning (create and manage looks)

## Screenshots

### Login/Signup
![login](images/login.png)

### Closet
![Closet](images/closet.png)

### AI Assistant
![AI Assistant](images/ai%20assistant.png)

### Outfits
![Outfits](images/outfir.png)


## Roadmap

Planned improvements and future iterations:

### AI Enhancements
- **AI Outfit Feedback**  
  Provide feedback on selected outfits (e.g., color balance, seasonality, formality).
- **AI Style Preferences**  
  Learn and persist user style preferences (colors, fits, occasions, climate) to personalize recommendations.
- **AI Upload Intelligence**  
  Automatically analyze uploaded clothing images to detect:
  - Garment type (e.g., hoodie, jacket)
  - Primary and secondary colors
  - Category and season
  - Suggested tags

### Mobile & UX Improvements
- **Mobile-First Responsive Design**  
  Optimize layouts and interactions for small screens.
- **Mobile Upload Flow**  
  Camera-based uploads with AI-assisted tagging for fast closet updates.
- **Gesture-Friendly Browsing**  
  Swipe and touch-optimized filtering and navigation.

### Core Platform Enhancements
- **Outfit History & Usage Tracking**  
  Track outfit frequency to surface underused items.
