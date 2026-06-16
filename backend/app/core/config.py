import os
from dotenv import load_dotenv

load_dotenv()

ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
COOKIE_SECURE = os.getenv("COOKIE_SECURE", "False") == "True"
JWT_SECRET = os.getenv("JWT_SECRET", "")
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")
DATABASE_URL = os.getenv("DATABASE_URL", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")