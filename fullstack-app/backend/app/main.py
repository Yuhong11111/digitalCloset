from fastapi import FastAPI,HTTPException, status, Request, Response
from app.api import routes
from fastapi.middleware.cors import CORSMiddleware
# from dotenv import load_dotenv #dotenv: Loads environment variables from a .env file.
from app.core.config import settings
from jose import JWTError, jwt #jwt token
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient #Asynchronous MongoDB driver.
import bcrypt
from datetime import datetime, timedelta
import os
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# no need to load env because settings.py already does it
# load_dotenv()

# Replace CryptContext with direct bcrypt usage
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode(), salt).decode()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())

# Add these constants near the top of the file
# ACCESS_TOKEN_EXPIRE_MINUTES = 30
ACCESS_TOKEN_EXPIRE_MINUTES = 100

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm="HS256")
    return encoded_jwt


# get environment variables from env file
# PORT = int(os.getenv("BACKEND_PORT", "8000"))
# HOST = os.getenv("BACKEND_HOST", "localhost")
# another way to get env variable from config.py(settings)
PORT = settings.BACKEND_PORT
HOST = settings.BACKEND_HOST

# Add MongoDB connection
# MONGODB_URL = os.getenv("MONGODB_URL")
MONGODB_URL = settings.MONGODB_URL
client = AsyncIOMotorClient(MONGODB_URL)
db = client.Closet  # database name

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    # allow_origins=os.getenv("CORS_ORIGINS").split(","),
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# load_dotenv()  # Load environment variables from .env file

app.include_router(routes.router)

# pydantic model for user requests(request from frontend)
class UserRequest(BaseModel):
    username: str
    password: str
    email: str = None  # Optional for login, required for signup

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI backend!"}


@app.get("/profile")
def get_profile(request: Request):
    token = request.cookies.get("token")
    if not token:
        return {"error": "No token provided"}, 401
    try:
        # decode token using the same secret and algorithm used for creation
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        return payload  # or return a subset like {"email": payload["sub"]}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

        
@app.post("/auth/login")
async def login_user(login_data: UserRequest, response: Response):
    try:
        # Find user in MongoDB
        existing_user = await db.users.find_one({"username": login_data.username})
        
        if not existing_user:
            return {
                "status": "error",
                "message": "User not found"
            }

        # Verify password
        if not verify_password(login_data.password, existing_user["password"]):
            return {
                "status": "error",
                "message": "Incorrect password"
            }
            
        # Create JWT token
        token_data = {
            "userId": str(existing_user["_id"]),
            "username": existing_user["username"]
        }
        token = create_access_token(token_data)
        
        # Set cookie
        response.set_cookie(
            key="token", 
            value=token,
            httponly=True,
            secure=True,
            samesite="lax",
            max_age=1800  # 30 minutes
        )
        
        return {
            "message": "Login successful",
            "userId": str(existing_user["_id"]),
            "username": existing_user["username"],
            "status": "success"
        }
    except Exception as e:
        logger.error(f"Login failed: {str(e)}")
        return {
            "status": "error",
            "message": f"Login failed: {str(e)}"
        }

@app.post("/auth/signup")
async def register_user(user_data: UserRequest, response: Response):
    try:
        existing_user = await db.users.find_one({"username": user_data.username})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered"
            )

        hashed_password = hash_password(user_data.password)
        new_user = {
            "username": user_data.username,
            "password": hashed_password,
            "email": user_data.email,
            # "created_at": datetime.utcnow()
        }

        result = await db.users.insert_one(new_user)

        # Create JWT token
        token_data = {
            "userId": str(result.inserted_id),
            "username": user_data.username
        }
        token = create_access_token(token_data)
        # Set cookie and return response
        response.set_cookie(
            key="token", 
            value=token,
            httponly=True,
            secure=True,
            samesite="none",
            max_age=1800  # 30 minutes
        )
        return {
            "message": "User registered successfully",
            "userId": str(result.inserted_id),
            "username": user_data.username,
            "status": "success"
        }
    except Exception as e:
        return {
            "message": f"Registration failed: {str(e)}",
            "status": "error"
        }

@app.post("/auth/logout")
async def logout_user(response: Response):
    response.delete_cookie(key="token")
    return {"message": "Logged out successfully"}

@app.get("/test-db")
async def test_db():
    try:
        # List all collections in the database
        collections = await db.list_collection_names()
        return {
            "database": "Closet",
            "collections": collections,
            "status": "connected"
        }
    except Exception as e:
        logger.error(f"Database operation failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database connection failed: {str(e)}"
        )

# Add this at the bottom of the file
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=HOST, port=PORT)