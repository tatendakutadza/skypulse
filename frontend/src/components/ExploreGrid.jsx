import { useState, useEffect } from 'react'
import api from '../services/api'

const SUGGESTED_CITIES = [
  { city: 'Harare', country: 'ZW', region: 'Zimbabwe · Africa' },
  { city: 'Nairobi', country: 'KE', region: 'Kenya · Africa' },
  { city: 'Lagos', country: 'NG', region: 'Nigeria · Africa' },
  { city: 'Cape Town', country: 'ZA', region: 'South Africa · Africa' },
  { city: 'Johannesburg', country: 'ZA', region: 'South Africa · Africa' },
  { city: 'Dar es Salaam', country: 'TZ', region: 'Tanzania · Africa' },
]

// Map OWM icon codes to a simple emoji — no external icon dependency
function iconFor(owmIcon, description = '') {
  const code = owmIcon?.slice(0, 2)
  const desc = description.toLowerCase()
  if (desc.includes('thunder')) return '⛈️'
  if (desc.includes('snow')) return '❄️'
  if (code === '01') return '☀️'
  if (code === '02') return '🌤️'
  if (code === '03' || code === '04') return '☁️'
  if (code === '09' || code === '10') return '🌧️'
  if (code === '11') return '⛈️'
  if (code === '13') return '❄️'
  if (code === '50') return '🌫️'
  return '🌤️'
}

// Temp → progress bar color, roughly matching the reference (blue=cool, amber=warm, red=hot, purple=windy-cold)
function tempColor(temp) {
  if (temp <= 15) return '#A78BFA'
  if (temp <= 22) return 'var(--sky-pulse)'
  if (temp <= 28) return 'var(--sky-warm)'
  return 'var(--sky-danger)'
}

function tempPercent(temp) {
  // crude visual scale: 0°-40°C mapped to 0-100%
  const pct = ((temp - 0) / 40) * 100
  return Math.min(100, Math.max(8, pct))
}

function ExploreGrid({ onSelectCity }) {
  const [data, setData] = useState({})   // { Harare: { temp, description, icon } | 'error' | undefined }
  const [activeCity, setActiveCity] = useState(null)

  useEffect(() => {
    SUGGESTED_CITIES.forEach(async ({ city }) => {
      try {
        const res = await api.get('/api/weather/current', { params: { city } })
        const w = res.data.data
        setData((prev) => ({
          ...prev,
          [city]: {
            temp: Math.round(w.main.temp),
            description: w.weather?.[0]?.description || '',
            icon: w.weather?.[0]?.icon,
          },
        }))
      } catch (err) {
        setData((prev) => ({ ...prev, [city]: 'error' }))
      }
    })
  }, [])

  const handleClick = (city) => {
    setActiveCity(city)
    onSelectCity(city)
  }

  return (
    <div style={{ marginTop: '56px' }}>
      <div style={{
        fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em',
        textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '14px',
      }}>
        Pinned Cities
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px',
      }}>
        {SUGGESTED_CITIES.map((item) => {
          const w = data[item.city]
          const isLoading = w === undefined
          const isError = w === 'error'

          return (
            <button
              key={item.city}
              onClick={() => handleClick(item.city)}
              disabled={activeCity === item.city && isLoading}
              className="glass"
              style={{
                textAlign: 'left',
                padding: '18px 20px',
                cursor: 'pointer',
                border: 'none',
                outline: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {item.city}
                </div>
                <div style={{
                  fontSize: '0.66rem', color: 'var(--text-dim)',
                  textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px',
                }}>
                  {item.region}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {isLoading && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Loading…</span>
                )}
                {isError && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--sky-danger)' }}>Unavailable</span>
                )}
                {w && !isError && (
                  <>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontWeight: 300,
                      fontSize: '1.9rem', color: 'var(--text-primary)',
                    }}>
                      {w.temp}°
                    </span>
                    <span style={{ fontSize: '1.6rem' }}>
                      {iconFor(w.icon, w.description)}
                    </span>
                  </>
                )}
              </div>

              {w && !isError && (
                <>
                  <div style={{
                    fontSize: '0.74rem', color: 'var(--text-secondary)',
                    textTransform: 'capitalize',
                  }}>
                    {w.description}
                  </div>
                  <div style={{
                    height: '3px', borderRadius: '2px',
                    background: 'var(--sky-border)', overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${tempPercent(w.temp)}%`,
                      background: tempColor(w.temp),
                      borderRadius: '2px',
                    }} />
                  </div>
                </>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ExploreGrid
