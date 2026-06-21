import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Profile() {
  const { user } = useAuth()
  const initial = user?.email?.[0]?.toUpperCase() || '?'

  return (
    <div style={{
      minHeight: 'calc(100vh - 60px)',
      background: 'var(--page-gradient)',
      padding: '40px 24px',
    }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>

        <div style={{ marginBottom: '28px' }}>
          <div style={{
            fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: 'var(--sky-pulse)', marginBottom: '8px',
          }}>
            Your account
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '2rem' }}>
            Profile
          </h1>
        </div>

        <div className="glass" style={{
          display: 'flex', alignItems: 'center', gap: '18px',
          padding: '24px', marginBottom: '20px',
        }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--sky-blue), var(--sky-pulse))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.3rem', fontWeight: 700, flexShrink: 0, color: '#fff',
          }}>
            {initial}
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{user?.email}</h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--sky-pulse)', marginTop: '4px' }}>
              Free Plan
            </p>
          </div>
        </div>

        <div className="glass" style={{ padding: '4px 0' }}>
          <ProfileLink to="/dashboard" label="Dashboard" hint="Favorites and recent searches" />
          <ProfileLink to="/settings" label="Settings" hint="Units and preferences" />
        </div>

        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '20px', lineHeight: 1.6 }}>
          Preferred units: <strong style={{ color: 'var(--text-secondary)' }}>
            {user?.preferred_units === 'imperial' ? 'Fahrenheit (Imperial)' : 'Celsius (Metric)'}
          </strong>. Change this anytime in Settings.
        </p>
      </div>
    </div>
  )
}

function ProfileLink({ to, label, hint }) {
  return (
    <Link
      to={to}
      style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 20px', textDecoration: 'none',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <div>
        <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{hint}</div>
      </div>
      <span style={{ color: 'var(--text-dim)' }}>→</span>
    </Link>
  )
}

export default Profile
