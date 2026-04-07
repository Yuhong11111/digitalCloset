# Backend README

This backend is a FastAPI app for auth, closet items, assistant chat, weather lookup, and outfit suggestions.

## Setup

```bash
cd fullstack-app/backend
/usr/bin/python3 -m venv .venv
source .venv/bin/activate
python -c "import platform; print(platform.machine())"  # should print arm64 on Apple Silicon
python -m pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
```

If you already created `.venv` from an Intel/Anaconda Python on an Apple Silicon Mac, recreate it with the system Python above before installing packages. A mismatched `x86_64` environment can force `greenlet` to build from source and fail with errors like `'cstdlib' file not found`.

Create `fullstack-app/backend/.env` with:

```env
DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/closet_db
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
WEATHER_API_KEY=your_weatherapi_key
CORS_ORIGINS=http://localhost:3000
```

Initialize the database once:

```bash
python ../../init_db.py
```

## Run

```bash
uvicorn app.main:app --reload
```

The backend listens on `http://localhost:8000`.

## Docs

- Swagger UI: `http://localhost:8000/docs`
- OpenAPI schema: `http://localhost:8000/openapi.json`

## Notes

- Authentication uses a JWT stored in an HTTP cookie.
- `/assistant/outfit/suggest` expects a JSON body with weather data.
- `/weather/current` requires valid `lat` and `lon` query params.
- If you update `.env`, restart the backend.
