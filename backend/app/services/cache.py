from sqlalchemy.orm import Session
from app.models.weather_cache import CacheRepository

def normalize_cache_key(prefix: str, city: str, country: str = "") -> str:
    """
    Normalizes city/country into a consistent cache key.
    Prevents 'Harare', 'harare', 'HARARE' from creating separate cache entries.
    """
    city_clean = city.strip().lower()
    country_clean = country.strip().lower() if country else ""
    return f"{prefix}:{city_clean}:{country_clean}"


def get_cached(db: Session, key: str):
    repo = CacheRepository(db)
    return repo.get(key)


def set_cached(db: Session, key: str, data: dict, ttl: int = 600):
    repo = CacheRepository(db)
    repo.set(key, data, ttl)
