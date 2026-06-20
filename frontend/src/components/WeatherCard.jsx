function WeatherCard({ weather }) {
  if (!weather) return null

  const { main, wind, visibility, weather: weatherDesc, name } = weather

  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '12px',
      padding: '20px',
      maxWidth: '320px',
      marginTop: '20px',
    }}>
      <h2>{name}</h2>
      <p style={{ fontSize: '14px', color: '#666', textTransform: 'capitalize' }}>
        {weatherDesc?.[0]?.description}
      </p>

      <div style={{ fontSize: '40px', fontWeight: 'bold' }}>
        {Math.round(main.temp)}°
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px' }}>
        <div>
          <strong>Humidity</strong>
          <p>{main.humidity}%</p>
        </div>
        <div>
          <strong>Pressure</strong>
          <p>{main.pressure} hPa</p>
        </div>
        <div>
          <strong>Wind</strong>
          <p>{wind.speed} m/s</p>
        </div>
        <div>
          <strong>Visibility</strong>
          <p>{(visibility / 1000).toFixed(1)} km</p>
        </div>
      </div>
    </div>
  )
}

export default WeatherCard
