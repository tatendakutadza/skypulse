from sqlalchemy import Column, Integer, String, DateTime, JSON
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from datetime import datetime, timedelta
from app.core.database import Base

class WeatherCache(Base):
    __tablename__ = "weather_cache"

    id = Column(Integer, primary_key=True, index=True)
    cache_key = Column(String, unique=True, index=True, nullable=False)
    data = Column(JSON, nullable=False)
    cached_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=False)


class CacheRepository:
    def __init__(self, db: Session):
        self.db = db

    def get(self, key: str):
        entry = self.db.query(WeatherCache).filter(
            WeatherCache.cache_key == key,
            WeatherCache.expires_at > datetime.utcnow()
        ).first()

        if entry:
            return entry.data
        return None

    def set(self, key: str, data: dict, ttl: int = 600):
        expires_at = datetime.utcnow() + timedelta(seconds=ttl)

        existing = self.db.query(WeatherCache).filter(
            WeatherCache.cache_key == key
        ).first()

        if existing:
            existing.data = data
            existing.cached_at = datetime.utcnow()
            existing.expires_at = expires_at
        else:
            entry = WeatherCache(
                cache_key=key,
                data=data,
                expires_at=expires_at
            )
            self.db.add(entry)

        self.db.commit()