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
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Create .env in fullstack-app/backend before running init_db.py
# First-time DB init
python ../../init_db.py

uvicorn app.main:app --reload
```

Backend runs at `http://localhost:8000`.

Useful URLs:
- Swagger UI: `http://localhost:8000/docs`
- OpenAPI schema: `http://localhost:8000/openapi.json`

### Frontend

```bash
cd fullstack-app/frontend
npm install
npm start
```

Frontend runs at `http://localhost:3000`.

Run backend and frontend in separate terminals.

## Authentication

- Users authenticate using email and password
- On successful login, the backend issues a JWT in an HTTP cookie
- The frontend sends authenticated requests with credentials/cookies
- Protected routes require a valid JWT


## Environment Variables

Create a `.env` file in the backend directory with:

```
DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/closet_db
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
WEATHER_API_KEY=your_weatherapi_key
CORS_ORIGINS=http://localhost:3000
```

Notes:
- `OPENAI_API_KEY` is required for the assistant and outfit suggestion endpoints.
- `WEATHER_API_KEY` is required for `/weather/current`.
- If you change `CORS_ORIGINS`, restart the backend.

## Testing

Run tests from the frontend folder:

```bash
cd fullstack-app/frontend
```

### 1) Unit/Component tests (Jest)

Run once (CI-friendly):

```bash
npm test
```

Watch mode during development:

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:coverage
```

### 2) Selenium E2E tests (Pytest)

This project includes a Selenium smoke test that validates:
- Open login page
- Switch to signup mode
- Register a unique user
- Redirect to `/closet`

### Prerequisites

- Backend running at `http://localhost:8000`
- Frontend running at `http://localhost:3000`
- Google Chrome installed

Install E2E dependencies:

```bash
npm run test:e2e:install
```

Run E2E tests:

```bash
npm run test:e2e
# or run with visible browser
E2E_HEADLESS=false npm run test:e2e
```

Run a single test file:

```bash
python3 -m pytest tests/e2e/tests/test_home_page_selenium.py -q
```

Optional env vars:
- `E2E_FRONTEND_URL` (default: `http://localhost:3000`)
- `E2E_HEADLESS` (`true` or `false`, default: `true`)

### Recommended workflow

- Use `npm run test:watch` while building frontend features.
- Run `npm test` on every PR for fast verification.
- Run `npm run test:e2e` separately for browser flow validation.

## Features

- User authentication (login/signup)
- Closet inventory with photos, notes, and favorites
- AI stylist assistant for outfit suggestions
- Weather-aware outfit suggestions from the closet
- Outfit planning (create and manage looks)

## Screenshots

### Login/Signup
![login](images/login.png)

### Closet
![Closet](images/closet.png)

### AI Assistant
![AI Assistant](images/ai%20assistant.png)

### Outfits
![Outfits](images/outfit.png)


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
