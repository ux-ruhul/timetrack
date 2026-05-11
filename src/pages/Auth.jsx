import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase.js'

export default function Auth() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [signupDone, setSignupDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (mode === 'login') {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) {
        setError(err.message)
      } else {
        navigate('/dashboard')
      }
    } else {
      const { error: err } = await supabase.auth.signUp({ email, password })
      if (err) {
        setError(err.message)
      } else {
        setSignupDone(true)
      }
    }

    setLoading(false)
  }

  const switchMode = (next) => {
    setMode(next)
    setError('')
    setSignupDone(false)
  }

  if (signupDone) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✉️</div>
          <h1 style={{ ...styles.title, fontSize: 24, marginBottom: 8 }}>Check your email</h1>
          <p style={styles.sub}>
            We sent a confirmation link to <strong>{email}</strong>.
            Click it to activate your account, then log in.
          </p>
          <button
            style={{ ...styles.link, marginTop: 20 }}
            onClick={() => switchMode('login')}
          >
            Back to log in →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Brand */}
        <div style={styles.brand}>
          <div style={styles.brandIcon}>⏱</div>
          <div>
            <div style={styles.brandName}>TimeTrack</div>
            <div style={styles.brandSub}>Personal time tracking</div>
          </div>
        </div>

        {/* Tab toggle */}
        <div style={styles.tabs}>
          {['login', 'signup'].map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              style={{
                ...styles.tab,
                ...(mode === m ? styles.tabActive : styles.tabInactive),
              }}
            >
              {m === 'login' ? 'Log in' : 'Sign up'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
              style={styles.input}
            />
            {mode === 'signup' && (
              <span style={styles.hint}>Minimum 6 characters</span>
            )}
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" disabled={loading} style={styles.submit}>
            {loading
              ? 'Please wait…'
              : mode === 'login'
              ? 'Log in'
              : 'Create account'}
          </button>
        </form>

        {/* Switch mode link */}
        <p style={styles.switchText}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            style={styles.link}
            onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100svh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
    background: 'var(--bg)',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 16,
    padding: '32px 28px',
    boxShadow: 'var(--shadow)',
    textAlign: 'left',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 28,
  },
  brandIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    background: 'var(--accent-bg)',
    border: '1px solid var(--accent-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
  },
  brandName: {
    fontWeight: 600,
    fontSize: 16,
    color: 'var(--text-h)',
    lineHeight: 1.2,
  },
  brandSub: {
    fontSize: 12,
    color: 'var(--text)',
    lineHeight: 1.2,
  },
  tabs: {
    display: 'flex',
    background: 'var(--code-bg)',
    borderRadius: 10,
    padding: 4,
    marginBottom: 24,
    gap: 4,
  },
  tab: {
    flex: 1,
    padding: '8px 0',
    border: 'none',
    borderRadius: 7,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  tabActive: {
    background: 'var(--bg)',
    color: 'var(--text-h)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  tabInactive: {
    background: 'transparent',
    color: 'var(--text)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--text)',
  },
  input: {
    padding: '10px 14px',
    border: '1px solid var(--border)',
    borderRadius: 10,
    fontSize: 14,
    color: 'var(--text-h)',
    background: 'var(--bg)',
    outline: 'none',
    transition: 'border-color 0.15s',
    fontFamily: 'var(--sans)',
  },
  hint: {
    fontSize: 12,
    color: 'var(--text)',
  },
  error: {
    padding: '10px 14px',
    background: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.25)',
    borderRadius: 10,
    fontSize: 13,
    color: '#dc2626',
  },
  submit: {
    padding: '11px 0',
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 4,
    transition: 'opacity 0.15s',
  },
  switchText: {
    marginTop: 20,
    fontSize: 13,
    color: 'var(--text)',
    textAlign: 'center',
  },
  link: {
    background: 'none',
    border: 'none',
    color: 'var(--accent)',
    cursor: 'pointer',
    fontSize: 'inherit',
    fontFamily: 'inherit',
    padding: 0,
    textDecoration: 'underline',
    textUnderlineOffset: 2,
  },
  title: {
    color: 'var(--text-h)',
    textAlign: 'center',
  },
  sub: {
    fontSize: 14,
    color: 'var(--text)',
    textAlign: 'center',
    lineHeight: 1.6,
  },
}
