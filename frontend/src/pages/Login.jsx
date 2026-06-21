import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { fetchMe } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await api.post('/api/auth/login', { email, password })
      await fetchMe()
      navigate('/dashboard')
    } catch (err) {
      setError('That email and password combination doesn\u2019t match our records')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-grid" style={{
      minHeight: 'calc(100vh - 60px)',
      background: 'var(--page-gradient)',
    }}>
      {/* Left — brand panel, hidden on mobile via inline media query workaround */}
      <BrandPanel
        eyebrow="Welcome back"
        line1="Conditions change."
        line2="Stay ahead of them."
      />

      {/* Right — form */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: '360px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.9rem', marginBottom: '6px' }}>
            Sign in
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '28px' }}>
            Pick up your saved cities and alerts.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Field type="email" value={email} onChange={setEmail} label="Email" required />
            <Field type="password" value={password} onChange={setPassword} label="Password" required />

            {error && <p style={{ fontSize: '0.78rem', color: '#FCA5A5' }}>{error}</p>}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '8px', padding: '13px', borderRadius: 'var(--r-pill)',
                background: 'var(--sky-blue)', border: 'none', color: 'white',
                fontSize: '0.85rem', fontWeight: 600,
                cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '24px' }}>
            New to SkyPulse?{' '}
            <Link to="/register" style={{ color: 'var(--sky-pulse)', textDecoration: 'none', fontWeight: 600 }}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function BrandPanel({ eyebrow, line1, line2 }) {
  return (
    <div className="auth-brand-panel" style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '60px',
      overflow: 'hidden',
      borderRight: '1px solid var(--sky-border)',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 30% 30%, rgba(56,189,248,0.12) 0%, transparent 60%)',
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.15em',
          textTransform: 'uppercase', color: 'var(--sky-pulse)', marginBottom: '16px',
        }}>
          {eyebrow}
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontStyle: 'italic',
          fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', lineHeight: 1.25,
          color: 'var(--text-primary)', maxWidth: '320px',
        }}>
          {line1}<br />{line2}
        </h2>
      </div>
    </div>
  )
}

function Field({ type, value, onChange, label, required, minLength }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        minLength={minLength}
        style={{
          width: '100%', background: 'var(--sky-surface)',
          border: '1px solid var(--sky-border)', borderRadius: '10px',
          padding: '12px 16px', fontFamily: 'var(--font-body)',
          fontSize: '0.88rem', color: 'var(--text-primary)', outline: 'none',
        }}
      />
    </label>
  )
}

export default Login
