import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import UserMenu from './UserMenu'

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

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        width: '34px', height: '34px', borderRadius: '50%',
        background: 'var(--sky-surface)', border: '1px solid var(--sky-border)',
        color: 'var(--text-secondary)', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {isDark ? (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}

function Navbar() {
  const location = useLocation()

  const linkStyle = (path) => ({
    fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.08em',
    textTransform: 'uppercase', textDecoration: 'none',
    color: location.pathname === path ? 'var(--text-primary)' : 'var(--text-secondary)',
    padding: '6px 14px', borderRadius: 'var(--r-pill)',
    border: location.pathname === path ? '1px solid var(--sky-border)' : '1px solid transparent',
    background: location.pathname === path ? 'var(--sky-surface)' : 'transparent',
  })

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 24px', background: 'var(--nav-bg)',
      backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--sky-border)',
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <Logo />
        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
          Sky<span style={{ color: 'var(--sky-pulse)' }}>Pulse</span>
        </span>
      </Link>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Link to="/" style={linkStyle('/')}>Home</Link>
        <ThemeToggle />
        <UserMenu />
      </div>
    </nav>
  )
}

export default Navbar
