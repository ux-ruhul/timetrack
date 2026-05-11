import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase.js'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth')
      } else {
        setUser(session.user)
      }
    })
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/auth')
  }

  if (!user) return null

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.brand}>
          <span style={styles.brandIcon}>⏱</span>
          <span style={styles.brandName}>TimeTrack</span>
        </div>
        <div style={styles.userArea}>
          <span style={styles.email}>{user.email}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Log out
          </button>
        </div>
      </header>

      {/* Main content */}
      <main style={styles.main}>
        <div style={styles.placeholder}>
          <div style={styles.placeholderIcon}>🚀</div>
          <h2 style={styles.placeholderTitle}>Time tracking coming soon</h2>
          <p style={styles.placeholderSub}>
            Your dashboard is on its way. Check back shortly.
          </p>
        </div>
      </main>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100svh',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--bg)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    height: 60,
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  brandIcon: {
    fontSize: 20,
  },
  brandName: {
    fontSize: 16,
    fontWeight: 600,
    color: 'var(--text-h)',
  },
  userArea: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },
  email: {
    fontSize: 13,
    color: 'var(--text)',
  },
  logoutBtn: {
    padding: '6px 14px',
    border: '1px solid var(--border)',
    borderRadius: 8,
    background: 'transparent',
    color: 'var(--text)',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'var(--sans)',
    transition: 'border-color 0.15s, color 0.15s',
  },
  main: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  placeholder: {
    textAlign: 'center',
    maxWidth: 360,
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  placeholderTitle: {
    fontSize: 22,
    fontWeight: 500,
    color: 'var(--text-h)',
    margin: '0 0 10px',
  },
  placeholderSub: {
    fontSize: 15,
    color: 'var(--text)',
    lineHeight: 1.6,
    margin: 0,
  },
}
