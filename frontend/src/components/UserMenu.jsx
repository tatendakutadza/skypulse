import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function UserMenu() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setOpen(false)
    await logout()
    navigate('/')
  }

  const initial = user?.email?.[0]?.toUpperCase() || null

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        aria-expanded={open}
        style={{
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          border: user ? 'none' : '1px solid var(--sky-border)',
          background: user
            ? 'linear-gradient(135deg, var(--sky-blue), var(--sky-pulse))'
            : 'var(--sky-surface)',
          color: user ? '#fff' : 'var(--text-secondary)',
          fontSize: '0.78rem',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {initial || (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        )}
      </button>

      {open && (
        <div
          className="glass"
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            right: 0,
            minWidth: '190px',
            padding: '8px',
            zIndex: 1100,
          }}
        >
          {user ? (
            <>
              <div style={{ padding: '8px 12px 10px', borderBottom: '1px solid var(--sky-border)', marginBottom: '6px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  {user.email}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--sky-pulse)', marginTop: '2px' }}>
                  Free Plan
                </div>
              </div>
              <MenuLink to="/profile" onClick={() => setOpen(false)}>Profile</MenuLink>
              <MenuLink to="/dashboard" onClick={() => setOpen(false)}>Dashboard</MenuLink>
              <MenuLink to="/settings" onClick={() => setOpen(false)}>Settings</MenuLink>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%', textAlign: 'left', padding: '9px 12px',
                  borderRadius: '8px', border: 'none', background: 'none',
                  color: 'var(--sky-danger)', fontSize: '0.82rem', cursor: 'pointer',
                  marginTop: '4px',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--sky-surface)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <MenuLink to="/login" onClick={() => setOpen(false)}>Log in</MenuLink>
              <MenuLink to="/register" onClick={() => setOpen(false)} accent>Create account</MenuLink>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function MenuLink({ to, children, onClick, accent }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      style={{
        display: 'block', padding: '9px 12px', borderRadius: '8px',
        textDecoration: 'none', fontSize: '0.82rem',
        color: accent ? 'var(--sky-pulse)' : 'var(--text-primary)',
        fontWeight: accent ? 600 : 400,
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--sky-surface)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
    >
      {children}
    </Link>
  )
}

export default UserMenu
