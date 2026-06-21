const SUGGESTED_CITIES = [
  { city: 'Harare', country: 'ZW', region: 'Zimbabwe · Africa' },
  { city: 'Nairobi', country: 'KE', region: 'Kenya · Africa' },
  { city: 'Lagos', country: 'NG', region: 'Nigeria · Africa' },
  { city: 'Cape Town', country: 'ZA', region: 'South Africa · Africa' },
  { city: 'London', country: 'GB', region: 'United Kingdom · Europe' },
  { city: 'Tokyo', country: 'JP', region: 'Japan · Asia' },
]

function ExploreGrid({ onSelectCity, loadingCity }) {
  return (
    <div style={{ marginTop: '56px' }}>
      <div style={{
        fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em',
        textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '14px',
      }}>
        Explore
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '10px',
      }}>
        {SUGGESTED_CITIES.map((item) => (
          <button
            key={item.city}
            onClick={() => onSelectCity(item.city)}
            disabled={loadingCity === item.city}
            className="glass"
            style={{
              textAlign: 'left',
              padding: '16px 18px',
              cursor: loadingCity === item.city ? 'default' : 'pointer',
              border: 'none',
              outline: 'inherit',
              opacity: loadingCity === item.city ? 0.55 : 1,
              transition: 'opacity 0.15s, border-color 0.15s',
            }}
          >
            <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {item.city}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
              {loadingCity === item.city ? 'Loading…' : item.region}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ExploreGrid
