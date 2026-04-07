from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth, items, profile, system, assistant, weather, preference
from app.core.config import settings

app = FastAPI()

# get environment variables from env file
# PORT = int(os.getenv("BACKEND_PORT", "8000"))
# HOST = os.getenv("BACKEND_HOST", "localhost")
# another way to get env variable from config.py(settings)

# from dotenv import load_dotenv #dotenv: Loads environment variables from a .env file.
# no need to load env because settings.py already does it

# Configure CORS
# Parse origins and remove empty strings
allowed_origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(system.router)
app.include_router(profile.router)
app.include_router(auth.router)
app.include_router(items.router)
app.include_router(assistant.router)
app.include_router(weather.router)
app.include_router(preference.router)
