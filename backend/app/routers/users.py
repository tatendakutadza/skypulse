from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.deps import get_db, get_current_user
from app.models.favorite_location import FavoriteLocation
from app.models.user import User
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/user", tags=["users"])


class FavoriteCreate(BaseModel):
    label: Optional[str] = None
    city: str
    country: Optional[str] = None
    lat: Optional[float] = None
    lon: Optional[float] = None


@router.get("/favorites")
def get_favorites(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    favorites = (
        db.query(FavoriteLocation)
        .filter(FavoriteLocation.user_id == current_user.id)
        .all()
    )
    return {"favorites": favorites}


@router.post("/favorites")
def add_favorite(
    payload: FavoriteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    favorite = FavoriteLocation(
        user_id=current_user.id,
        label=payload.label,
        city=payload.city,
        country=payload.country,
        lat=payload.lat,
        lon=payload.lon,
    )
    db.add(favorite)
    db.commit()
    db.refresh(favorite)
    return favorite


@router.delete("/favorites/{favorite_id}")
def remove_favorite(
    favorite_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    favorite = (
        db.query(FavoriteLocation)
        .filter(
            FavoriteLocation.id == favorite_id,
            FavoriteLocation.user_id == current_user.id,
        )
        .first()
    )
    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite not found")

    db.delete(favorite)
    db.commit()
    return {"message": "Favorite removed"}


@router.patch("/settings")
def update_settings(
    preferred_units: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if preferred_units not in ["metric", "imperial"]:
        raise HTTPException(status_code=400, detail="Invalid units")

    current_user.preferred_units = preferred_units
    db.commit()
    return {"message": "Settings updated", "preferred_units": preferred_units}
