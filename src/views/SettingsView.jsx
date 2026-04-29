export default function SettingsView({ theme, setTheme, lang, setLang, syncOn, setSyncOn, bioOn, setBioOn, alertsOn, setAlertsOn, reportsOn, setReportsOn, logsOn, setLogsOn, passkeyMsg, setPasskeyMsg, registerPasskey, currentUser }) {
  return (
    <div className="dash-grid">
      <div className="panel">
        <div className="panel-hd"><h2>🎨 Appearance</h2></div>
        <div className="sf"><label>Theme</label>
          <select value={theme} onChange={e => setTheme(e.target.value)}>
            <option value="dark">Dark Mode</option>
            <option value="light">Light Mode</option>
          </select>
        </div>
        <div className="sf"><label>Language</label>
          <select value={lang} onChange={e => setLang(e.target.value)}>
            <option>English (Kenya)</option>
            <option>Swahili</option>
          </select>
        </div>
      </div>
      <div className="panel">
        <div className="panel-hd"><h2>🔔 Notifications</h2></div>
        <div className="sf"><label>Inventory Alerts</label><input type="checkbox" checked={alertsOn} onChange={e => setAlertsOn(e.target.checked)} /></div>
        <div className="sf"><label>Sales Reports</label><input type="checkbox" checked={reportsOn} onChange={e => setReportsOn(e.target.checked)} /></div>
        <div className="sf"><label>Security Logs</label><input type="checkbox" checked={logsOn} onChange={e => setLogsOn(e.target.checked)} /></div>
      </div>
      <div className="panel">
        <div className="panel-hd"><h2>🔐 Security</h2></div>
        <div className="sf"><label>Cloud Sync</label><input type="checkbox" checked={syncOn} onChange={e => setSyncOn(e.target.checked)} /></div>
        <div className="sf"><label>Biometric Login</label><input type="checkbox" checked={bioOn} onChange={e => setBioOn(e.target.checked)} /></div>
        <button className="btn-p" style={{ marginTop: 10, width: '100%' }} onClick={async () => {
          setPasskeyMsg('Registering passkey…');
          const ok = await registerPasskey();
          setPasskeyMsg(ok ? '✅ Passkey registered!' : '❌ Passkey registration failed');
          setTimeout(() => setPasskeyMsg(''), 3000);
        }}>🔑 Register Passkey</button>
        {passkeyMsg && <div style={{ marginTop: 8, fontSize: 12, color: passkeyMsg.includes('✅') ? 'var(--accent)' : 'var(--red)' }}>{passkeyMsg}</div>}
      </div>
      <div className="panel">
        <div className="panel-hd"><h2>ℹ️ About</h2></div>
        <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>BerylBytes POS v4.2.0<br/>Enterprise LTS<br/>All operations are logged and encrypted.</p>
        <button className="ghost-btn" style={{ marginTop: 10, width: '100%' }}>Check for Updates</button>
      </div>
    </div>
  )
}
