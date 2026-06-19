import httpx
from app.core.config import OPENWEATHER_API_KEY

BASE_URL = "https://api.openweathermap.org/data/2.5"
GEO_URL = "https://api.openweathermap.org/geo/1.0/direct"
ONECALL_URL = "https://api.openweathermap.org/data/3.0/onecall"
REVERSE_GEO_URL = "https://api.openweathermap.org/geo/1.0/reverse"


def fetch_geocode(city: str, country: str = None):
    """Convert a city name into lat/lon coordinates."""
    query = city if not country else f"{city},{country}"
    params = {
        "q": query,
        "limit": 1,
        "appid": OPENWEATHER_API_KEY
    }
    response = httpx.get(GEO_URL, params=params, timeout=10)
    response.raise_for_status()
    data = response.json()

    if not data:
        return None

    return {
        "lat": data[0]["lat"],
        "lon": data[0]["lon"],
        "name": data[0]["name"],
        "country": data[0].get("country")
    }


def fetch_current_weather(lat: float, lon: float, units: str = "metric"):
    """Fetch current weather for a given lat/lon."""
    params = {
        "lat": lat,
        "lon": lon,
        "units": units,
        "appid": OPENWEATHER_API_KEY
    }
    response = httpx.get(f"{BASE_URL}/weather", params=params, timeout=10)
    response.raise_for_status()
    return response.json()


def fetch_forecast(lat: float, lon: float, units: str = "metric"):
    """Fetch hourly + 7-day forecast using One Call API."""
    params = {
        "lat": lat,
        "lon": lon,
        "units": units,
        "exclude": "minutely",
        "appid": OPENWEATHER_API_KEY
    }
    response = httpx.get(ONECALL_URL, params=params, timeout=10)
    response.raise_for_status()
    return response.json()


def fetch_reverse_geocode(lat: float, lon: float):
    """Convert lat/lon into a city name."""
    params = {
        "lat": lat,
        "lon": lon,
        "limit": 1,
        "appid": OPENWEATHER_API_KEY
    }
    response = httpx.get(REVERSE_GEO_URL, params=params, timeout=10)
    response.raise_for_status()
    data = response.json()

    if not data:
        return None

    return {
        "lat": lat,
        "lon": lon,
        "name": data[0]["name"],
        "country": data[0].get("country")
    }