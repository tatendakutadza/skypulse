from fastapi import APIRouter, Depends, HTTPException, Request, Query
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.core.deps import get_db, get_current_user, get_current_user_optional
from app.services import openweather, cache
from app.models.search_history import SearchHistory
from app.models.user import User
from typing import Optional

limiter = Limiter(key_func=get_remote_address)
router = APIRouter(prefix="/api/weather", tags=["weather"])


@router.get("/current")
@limiter.limit("60/minute")
def get_current_weather(
    request: Request,
    city: Optional[str] = Query(None, max_length=100, pattern=r"^[a-zA-Z\s\-]+$"),
    country: Optional[str] = Query(None, max_length=100),
    lat: Optional[float] = Query(None),
    lon: Optional[float] = Query(None),
    units: str = Query("metric", pattern=r"^(metric|imperial)$"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    if not city and (lat is None or lon is None):
        raise HTTPException(
            status_code=400,
            detail="Provide either 'city' or both 'lat' and 'lon'"
        )

    # Determine geo info based on input type
    if city:
        cache_key = cache.normalize_cache_key("current", city, country or "")
        cached_data = cache.get_cached(db, cache_key)
        if cached_data:
            return {"source": "cache", "data": cached_data}

        geo = openweather.fetch_geocode(city, country)
        if not geo:
            raise HTTPException(status_code=404, detail="City not found")
    else:
        cache_key = cache.normalize_cache_key("current", f"{lat}", f"{lon}")
        cached_data = cache.get_cached(db, cache_key)
        if cached_data:
            return {"source": "cache", "data": cached_data}

        geo = openweather.fetch_reverse_geocode(lat, lon)
        if not geo:
            raise HTTPException(status_code=404, detail="Location not found")

    # Cache miss — fetch live weather
    weather_data = openweather.fetch_current_weather(geo["lat"], geo["lon"], units)

    # Store in cache — 10 min TTL
    cache.set_cached(db, cache_key, weather_data, ttl=600)

    # Save to search history
    history_entry = SearchHistory(
        user_id=current_user.id if current_user else None,
        city=geo["name"],
        country=geo.get("country"),
        lat=geo["lat"],
        lon=geo["lon"],
        search_type="current",
    )
    db.add(history_entry)
    db.commit()

    return {"source": "live", "data": weather_data}


@router.get("/forecast")
@limiter.limit("60/minute")
def get_forecast(
    request: Request,
    city: str = Query(..., max_length=100, pattern=r"^[a-zA-Z\s\-]+$"),
    country: str = Query(None, max_length=100),
    units: str = Query("metric", pattern=r"^(metric|imperial)$"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    cache_key = cache.normalize_cache_key("forecast", city, country or "")

    cached_data = cache.get_cached(db, cache_key)
    if cached_data:
        return {"source": "cache", "data": cached_data}

    geo = openweather.fetch_geocode(city, country)
    if not geo:
        raise HTTPException(status_code=404, detail="City not found")

    forecast_data = openweather.fetch_forecast(geo["lat"], geo["lon"], units)

    # 30 min TTL — forecast changes less frequently
    cache.set_cached(db, cache_key, forecast_data, ttl=1800)

    history_entry = SearchHistory(
        user_id=current_user.id if current_user else None,
        city=geo["name"],
        country=geo.get("country"),
        lat=geo["lat"],
        lon=geo["lon"],
        search_type="forecast",
    )
    db.add(history_entry)
    db.commit()

    return {"source": "live", "data": forecast_data}


@router.get("/search")
@limiter.limit("60/minute")
def search_location(
    request: Request,
    city: str = Query(..., max_length=100, pattern=r"^[a-zA-Z\s\-]+$"),
    country: str = Query(None, max_length=100),
    db: Session = Depends(get_db),
):
    cache_key = cache.normalize_cache_key("geocode", city, country or "")

    cached_data = cache.get_cached(db, cache_key)
    if cached_data:
        return {"source": "cache", "data": cached_data}

    geo = openweather.fetch_geocode(city, country)
    if not geo:
        raise HTTPException(status_code=404, detail="City not found")

    # 24hr TTL — coordinates never change
    cache.set_cached(db, cache_key, geo, ttl=86400)

    return {"source": "live", "data": geo}


@router.get("/history")
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    history = (
        db.query(SearchHistory)
        .filter(SearchHistory.user_id == current_user.id)
        .order_by(SearchHistory.searched_at.desc())
        .limit(10)
        .all()
    )
    return {"history": history}