import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

function Register() {
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
      await api.post('/api/auth/register', { email, password })
      await api.post('/api/auth/login', { email, password })
      await fetchMe()
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not create that account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 60px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--page-gradient)',
      padding: '24px',
    }}>
      <div className="glass" style={{ width: '100%', maxWidth: '380px', padding: '36px 32px' }}>

        <div style={{ marginBottom: '28px' }}>
          <div style={{
            fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: 'var(--sky-pulse)', marginBottom: '8px',
          }}>
            Get started
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '2rem' }}>
            Create account
          </h1>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%', background: 'var(--sky-surface)',
                border: '1px solid var(--sky-border)', borderRadius: '10px',
                padding: '12px 16px', fontFamily: 'var(--font-body)',
                fontSize: '0.88rem', color: 'var(--text-primary)', outline: 'none',
              }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Password <span style={{ color: 'var(--text-dim)' }}>(min. 8 characters)</span>
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              style={{
                width: '100%', background: 'var(--sky-surface)',
                border: '1px solid var(--sky-border)', borderRadius: '10px',
                padding: '12px 16px', fontFamily: 'var(--font-body)',
                fontSize: '0.88rem', color: 'var(--text-primary)', outline: 'none',
              }}
            />
          </label>

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
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '24px', textAlign: 'center' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--sky-pulse)', textDecoration: 'none', fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
