from motor.motor_asyncio import AsyncIOMotorClient

from app.core.config import settings

# Add MongoDB connection
# MONGODB_URL = os.getenv("MONGODB_URL")
client = AsyncIOMotorClient(settings.MONGODB_URL)
db = client.Closet  # database name


async def get_database():
    return db
