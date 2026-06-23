function WeatherCard({ weather }) {
  if (!weather) return null

  const { main, wind, visibility, weather: weatherDesc, name } = weather
  const description = weatherDesc?.[0]?.description || ''

  const visibilityUnit = typeof localStorage !== 'undefined'
    ? localStorage.getItem('skypulse_visibility_unit') || 'km'
    : 'km'
  const visibilityValue = visibilityUnit === 'mi'
    ? (visibility / 1609.34).toFixed(1)
    : (visibility / 1000).toFixed(1)

  // wind.speed arrives in m/s (metric units from backend)
  const windUnit = typeof localStorage !== 'undefined'
    ? localStorage.getItem('skypulse_wind_unit') || 'kmh'
    : 'kmh'
  const windSpeedMs = wind.speed
  const windDisplay = {
    kmh: `${(windSpeedMs * 3.6).toFixed(0)} km/h`,
    mph: `${(windSpeedMs * 2.23694).toFixed(0)} mph`,
    ms: `${windSpeedMs.toFixed(1)} m/s`,
  }[windUnit]

  // main.pressure arrives in hPa
  const pressureUnit = typeof localStorage !== 'undefined'
    ? localStorage.getItem('skypulse_pressure_unit') || 'hpa'
    : 'hpa'
  const pressureDisplay = pressureUnit === 'inhg'
    ? `${(main.pressure * 0.02953).toFixed(2)} inHg`
    : `${main.pressure} hPa`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <div style={{
          fontSize: '0.7rem', fontWeight: 600,
          letterSpacing: '0.15em', textTransform: 'uppercase',
          color: 'var(--sky-pulse)', marginBottom: '8px',
        }}>
          Current Conditions
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
          lineHeight: 1.0,
          color: 'var(--text-primary)',
          textTransform: 'capitalize',
        }}>
          {name}
        </h1>
        <p style={{
          maxWidth: '420px', fontSize: '0.85rem', lineHeight: 1.6,
          color: 'var(--text-secondary)', marginTop: '10px', textTransform: 'capitalize',
        }}>
          {description}
        </p>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontWeight: 300,
            fontSize: 'clamp(4rem, 8vw, 6rem)', lineHeight: 1,
            color: 'var(--text-primary)', letterSpacing: '-0.04em',
          }}>
            {Math.round(main.temp)}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontWeight: 300,
            fontSize: '1.8rem', color: 'var(--sky-pulse)', marginTop: '8px',
          }}>
            °
          </span>
        </div>
        <div style={{
          display: 'flex', gap: '12px', fontSize: '0.78rem',
          color: 'var(--text-secondary)', marginTop: '4px', fontFamily: 'var(--font-mono)',
        }}>
          <span style={{ color: 'var(--sky-warm)' }}>↑ {Math.round(main.temp_max)}°</span>
          <span style={{ color: 'var(--sky-pulse)' }}>↓ {Math.round(main.temp_min)}°</span>
          <span style={{ color: 'var(--text-dim)' }}>Feels like {Math.round(main.feels_like)}°</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <StatChip label="Humidity" value={`${main.humidity}%`} dotColor="var(--sky-pulse)" />
        <StatChip label="Wind" value={windDisplay} dotColor="var(--sky-warm)" />
        <StatChip label="Pressure" value={pressureDisplay} dotColor="#a78bfa" />
        <StatChip label="Visibility" value={`${visibilityValue} ${visibilityUnit}`} dotColor="var(--sky-safe)" />
      </div>
    </div>
  )
}

function StatChip({ label, value, dotColor }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '7px',
      padding: '8px 14px', borderRadius: 'var(--r-pill)',
      background: 'var(--sky-surface)', border: '1px solid var(--sky-border)',
      fontSize: '0.78rem', color: 'var(--text-secondary)',
    }}>
      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
      <span>{label} <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{value}</strong></span>
    </div>
  )
}

export default WeatherCard
