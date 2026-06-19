from pydantic import BaseModel, Field
from typing import Optional


class WeatherQuery(BaseModel):
    city: str = Field(..., max_length=100, pattern=r"^[a-zA-Z\s\-]+$")
    country: Optional[str] = Field(None, max_length=100, pattern=r"^[a-zA-Z\s\-]*$")
    units: Optional[str] = Field("metric", pattern=r"^(metric|imperial)$")
