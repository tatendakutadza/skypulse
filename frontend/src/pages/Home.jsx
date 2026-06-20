import { useState, useEffect } from 'react'
import api from '../services/api'
import WeatherCard from '../components/WeatherCard'
import useGeolocation from '../hooks/useGeolocation'

function Home() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(null)

  const { coords, error: geoError, loading: geoLoading, getLocation } = useGeolocation()

  const handleSearch = async () => {
    setError(null)
    try {
      const response = await api.get('/api/weather/current', {
        params: { city }
      })
      setWeather(response.data.data)
    } catch (err) {
      console.error(err)
      setError('Could not fetch weather. Try again.')
    }
  }

  const handleUseLocation = () => {
    getLocation()
  }

  // When coords become available, fetch weather automatically
  useEffect(() => {
    if (coords) {
      fetchByCoords(coords.lat, coords.lon)
    }
  }, [coords])

  const fetchByCoords = async (lat, lon) => {
    setError(null)
    try {
      const response = await api.get('/api/weather/current', {
        params: { lat, lon }
      })
      setWeather(response.data.data)
    } catch (err) {
      console.error(err)
      setError('Could not fetch weather for your location.')
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>SkyPulse</h1>

      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter a city"
      />
      <button onClick={handleSearch}>Search</button>
      <button onClick={handleUseLocation} disabled={geoLoading}>
        {geoLoading ? 'Locating...' : 'Use My Location'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {geoError && <p style={{ color: 'red' }}>{geoError}</p>}

      <WeatherCard weather={weather} />
    </div>
  )
}

export default Home