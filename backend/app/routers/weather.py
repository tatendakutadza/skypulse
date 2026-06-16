from fastapi import APIRouter
from fastapi import APIRouter, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

router = APIRouter(prefix="/api/weather", tags=["weather"])
limiter = Limiter(key_func=get_remote_address)

@router.get("/current")
@limiter.limit("60/minute")
def get_current_weather(request: Request):
    return {"message": "current weather endpoint - coming soon"}


@router.get("/forecast")
@limiter.limit("60/minute")
def get_forecast(request: Request):
    return {"message": "forecast endpoint - coming soon"}

@router.get("/search")
@limiter.limit("60/minute")
def search_location(request: Request):
    return {"message": "search endpoint - coming soon"}

@router.get("/history")
@limiter.limit("60/minute")
def get_history(request: Request):
    return {"message": "history endpoint - coming soon"}