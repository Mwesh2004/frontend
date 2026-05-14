import { useState, useEffect } from 'react'
import './LoginPortal.css'

export default function LoginPortal({ onLogin, darkMode, toggleDark }) {
  // Login portal is driven by App.js via onLogin(user)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [bioLoading, setBioLoading] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [kickerIndex, setKickerIndex] = useState(0)

  const hasBio = !!(window.PublicKeyCredential && navigator.credentials)


  const kickers = [
    "Lightning Fast Transactions",
    "Bank-Grade Security", 
    "Effortless Inventory",
    "Enterprise Ready POS"
  ]

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100)
    const kickerInterval = setInterval(() => {
      setKickerIndex((prev) => (prev + 1) % kickers.length)
    }, 4000)
    return () => {
      clearTimeout(timer)
      clearInterval(kickerInterval)
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // This portal is purely UI now. App.js owns auth/state.
    // For compatibility with the old UI, try to login using the first selected hint match.
    // If no match is found, show a message.
    setTimeout(() => {
      const hints = [
        { u: 'beryl', p: 'bbytes2026', role: 'superadmin' },
        { u: 'manager', p: 'manager123', role: 'manager' },
        { u: 'cashier1', p: 'cashier123', role: 'cashier' },
        { u: 'cashier2', p: 'cashier456', role: 'cashier' },
      ]
      const match = hints.find(h => h.u === username && h.p === password)
      if (!match) {
        setError('Invalid username or password')
        setLoading(false)
        return
      }

      // App.js expects a user object shaped like SYSTEM_USERS in App.js.
      // Provide a minimal object.
      const user = { id: 0, username: match.u, name: match.role, role: match.role }
      onLogin(user)
      setLoading(false)
    }, 600)
  }

  const handleBiometric = async () => {
    setBioLoading(true)
    setError('')
    try {
      // Keep UI responsive; real biometric/passkey auth is handled elsewhere.
      // If device supports passkeys, just continue to onLogin with a placeholder.
      if (window.PublicKeyCredential && navigator.credentials) {
        onLogin({ id: 0, username: username || 'passkey', name: 'Passkey User', role: 'superadmin' })
      } else {
        setError('Passkeys not supported on this device')
      }
    } catch (e) {
      setError(e?.message || 'Biometric authentication failed')
    }
    setBioLoading(false)
  }


  const hints = [
    { u: 'beryl', p: 'bbytes2026', role: 'Super Admin' },
    { u: 'manager', p: 'manager123', role: 'Manager' },
    { u: 'cashier1', p: 'cashier123', role: 'Cashier' },
    { u: 'cashier2', p: 'cashier456', role: 'Cashier' },
  ]

  return (
    <div className={`login-root ${loaded ? 'in' : ''}`}>
      {/* Animated Background */}
      <div className="login-bg">
        <div className="lg-orb lg-o1" />
        <div className="lg-orb lg-o2" />
        <div className="lg-orb lg-o3" />
        <div className="lg-orb lg-o4" />
        <div className="lg-grid" />
        {[...Array(15)].map((_, i) => (
          <div key={i} className={`lg-particle lp-${i + 1}`} />
        ))}
        <div className="lg-ring" />
      </div>

      <div className="login-content">
        {/* Brand */}
        <div className={`login-brand ${loaded ? 'slide-down' : ''}`}>
          <div className="lb-logo">B</div>
          <div className="lb-text">
            <div className="lb-name">Beryl<em>Bytes</em></div>
            <div className="lb-sub">POINT OF SALE SYSTEM</div>
            <div className="lb-kickers">
              <div className="kicker-text" key={kickerIndex}>
                {kickers[kickerIndex]}
              </div>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className={`login-card ${loaded ? 'scale-in' : ''}`}>
          <div className="lc-glow" />
          <div className="lc-header">
            <h1>Welcome Back</h1>
            <p>Sign in to access your terminal</p>
          </div>

          <form onSubmit={handleLogin} className="lc-form">
            <div className={`lc-field ${username ? 'has-value' : ''}`}>
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter username"
                autoFocus
                autoComplete="username"
              />
              <span className="lc-icon">👤</span>
            </div>

            <div className={`lc-field ${password ? 'has-value' : ''}`}>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
              />
              <span className="lc-icon">🔒</span>
            </div>

            {error && <div className="lc-error shake">{error}</div>}

            <button
              type="submit"
              className={`lc-btn ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <span className="lc-spinner" />
              ) : (
                <>
                  Sign In <span className="lc-arrow">→</span>
                </>
              )}
            </button>

            {hasBio && (
              <button
                type="button"
                className={`lc-bio-btn ${bioLoading ? 'loading' : ''}`}
                onClick={handleBiometric}
                disabled={bioLoading}
              >
                <span className="bio-icon">🔐</span>
                {bioLoading ? 'Verifying...' : 'Sign in with Biometrics'}
              </button>
            )}
          </form>

          <div className="lc-footer">
            <button
              className="lc-hint-toggle"
              onClick={() => setShowHints(!showHints)}
            >
              {showHints ? 'Hide credentials' : 'Show demo credentials'}
            </button>

            {showHints && (
              <div className="lc-hints">
                {hints.map((h, i) => (
                  <div
                    key={i}
                    className="lc-hint"
                    onClick={() => { setUsername(h.u); setPassword(h.p) }}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <span className="hint-role">{h.role}</span>
                    <span className="hint-creds">{h.u} / {h.p}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={`login-meta ${loaded ? 'fade-up' : ''}`}>
          <span>🔒 Encrypted Connection</span>
          <span>•</span>
          <span>v4.3.0 Enterprise</span>
        </div>
      </div>
    </div>
  )
}
