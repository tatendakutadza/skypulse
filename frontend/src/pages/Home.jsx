import { useState, useEffect } from 'react'
import api from '../services/api'
import WeatherCard from '../components/WeatherCard'
import useGeolocation from '../hooks/useGeolocation'

function Home() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const { coords, error: geoError, loading: geoLoading, getLocation } = useGeolocation()

  const fetchWeather = async (params) => {
    setError(null)
    setLoading(true)
    try {
      const response = await api.get('/api/weather/current', { params })
      setWeather(response.data.data)
    } catch (err) {
      console.error(err)
      setError('Could not fetch weather. Check the city name and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (!city.trim()) return
    fetchWeather({ city })
  }

  useEffect(() => {
    if (coords) {
      fetchWeather({ lat: coords.lat, lon: coords.lon })
    }
  }, [coords])

  return (
    <div style={{
      position: 'relative',
      minHeight: 'calc(100vh - 60px)',
      background: 'var(--page-gradient)',
      padding: '40px 24px',
    }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>

        <form onSubmit={handleSearch} style={{ position: 'relative', marginBottom: '36px' }}>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search a city — try Harare, Cape Town, London..."
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--sky-border)',
              borderRadius: 'var(--r-pill)',
              padding: '14px 130px 14px 20px',
              fontFamily: 'var(--font-body)',
              fontSize: '0.9rem',
              color: 'var(--text-primary)',
              outline: 'none',
            }}
          />
          <div style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '6px' }}>
            <button
              type="button"
              onClick={getLocation}
              disabled={geoLoading}
              style={{
                padding: '9px 14px',
                borderRadius: 'var(--r-pill)',
                background: 'var(--sky-surface)',
                border: '1px solid var(--sky-border)',
                color: 'var(--text-secondary)',
                fontSize: '0.72rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {geoLoading ? 'Locating…' : '📍 My Location'}
            </button>
            <button
              type="submit"
              style={{
                width: '38px', height: '38px', borderRadius: '50%',
                background: 'var(--sky-blue)', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white',
              }}
              aria-label="Search"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>
        </form>

        {error && (
          <p style={{ color: '#FCA5A5', fontSize: '0.85rem', marginBottom: '20px' }}>{error}</p>
        )}
        {geoError && (
          <p style={{ color: '#FCA5A5', fontSize: '0.85rem', marginBottom: '20px' }}>{geoError}</p>
        )}

        {loading && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Loading weather…</p>
        )}

        {!loading && !weather && !error && (
          <div className="glass" style={{ padding: '40px 24px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Search a city or use your location to see current conditions.
            </p>
          </div>
        )}

        <WeatherCard weather={weather} />
      </div>
    </div>
  )
}

export default Home
