import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Logo() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="17" stroke="#2E7FE8" strokeWidth="1.5" />
      <path d="M4 26 L11 14 L16 20 L20 12 L26 20 L28 16 L32 26 Z" fill="url(#mountFill)" opacity="0.9" />
      <path d="M14 20 L16.5 20 L18 17 L19.5 23 L21 18 L22.5 20 L28 20" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <defs>
        <linearGradient id="mountFill" x1="4" y1="12" x2="32" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E4080" />
          <stop offset="100%" stopColor="#2E7FE8" stopOpacity="0.7" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const linkStyle = (path) => ({
    fontSize: '0.75rem',
    fontWeight: 500,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    textDecoration: 'none',
    color: location.pathname === path ? 'var(--text-primary)' : 'var(--text-secondary)',
    padding: '6px 14px',
    borderRadius: 'var(--r-pill)',
    border: location.pathname === path ? '1px solid var(--sky-border)' : '1px solid transparent',
    background: location.pathname === path ? 'var(--sky-surface)' : 'transparent',
  })

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 24px',
      background: 'rgba(10,14,26,0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--sky-border)',
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <Logo />
        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
          Sky<span style={{ color: 'var(--sky-pulse)' }}>Pulse</span>
        </span>
      </Link>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Link to="/" style={linkStyle('/')}>Home</Link>

        {user ? (
          <>
            <Link to="/dashboard" style={linkStyle('/dashboard')}>Dashboard</Link>
            <Link to="/settings" style={linkStyle('/settings')}>Settings</Link>
            <button
              onClick={logout}
              style={{
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                padding: '6px 14px',
                borderRadius: 'var(--r-pill)',
                border: '1px solid var(--sky-border)',
                background: 'var(--sky-surface)',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle('/login')}>Login</Link>
            <Link to="/register" style={linkStyle('/register')}>Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
