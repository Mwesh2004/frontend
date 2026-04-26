import { useState, useEffect } from 'react'
import './Admin.css'

const USERS = {
  admin: { username: 'admin', password: 'bbytes2026', role: 'Super Admin', name: 'Beryl Munyao' },
  cashier: { username: 'cashier', password: 'cashier123', role: 'Cashier', name: 'Jane Wanjiku' },
}

const mockSales = [
  { id: 'INV-001', item: 'Panadol 500mg x8', amount: 50, method: 'M-Pesa', cashier: 'Jane', time: '08:12 AM', status: 'paid' },
  { id: 'INV-002', item: 'Maize Flour 2kg', amount: 220, method: 'Cash', cashier: 'John', time: '09:45 AM', status: 'paid' },
  { id: 'INV-003', item: 'Single Room 1 Night', amount: 2500, method: 'M-Pesa', cashier: 'Jane', time: '10:30 AM', status: 'paid' },
  { id: 'INV-004', item: 'Amoxicillin 250mg', amount: 320, method: 'Card', cashier: 'John', time: '11:00 AM', status: 'pending' },
  { id: 'INV-005', item: 'Cooking Oil 1L', amount: 350, method: 'M-Pesa', cashier: 'Jane', time: '12:15 PM', status: 'paid' },
  { id: 'INV-006', item: 'Double Room 1 Night', amount: 4500, method: 'Card', cashier: 'John', time: '01:30 PM', status: 'paid' },
]

const mockExpenses = [
  { id: 1, desc: 'Stock restock', category: 'Inventory', amount: 5000, date: '26 Apr 2026' },
  { id: 2, desc: 'Monthly rent', category: 'Rent', amount: 3500, date: '25 Apr 2026' },
  { id: 3, desc: 'Staff salary', category: 'Staff', amount: 8000, date: '24 Apr 2026' },
]

const mockUsers = [
  { id: 1, name: 'Beryl Munyao', role: 'Super Admin', status: 'active', lastLogin: 'Today 8:00 AM' },
  { id: 2, name: 'Jane Wanjiku', role: 'Cashier', status: 'active', lastLogin: 'Today 9:00 AM' },
  { id: 3, name: 'John Kamau', role: 'Cashier', status: 'inactive', lastLogin: 'Yesterday' },
]

function BgOrbs({ subtle }) {
  return (
    <div className="bg-layer">
      <div className={`orb o1 ${subtle ? 'subtle' : ''}`}></div>
      <div className={`orb o2 ${subtle ? 'subtle' : ''}`}></div>
      <div className={`orb o3 ${subtle ? 'subtle' : ''}`}></div>
      <div className={`orb o4 ${subtle ? 'subtle' : ''}`}></div>
      <div className="grid-lines"></div>
    </div>
  )
}

export default function Admin() {
  const [dark, setDark] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)
  const [u, setU] = useState('')
  const [p, setP] = useState('')
  const [err, setErr] = useState('')
  const [tab, setTab] = useState('dashboard')
  const [user, setUser] = useState(null)
  const [expenses, setExpenses] = useState(mockExpenses)
  const [newExp, setNewExp] = useState({ desc: '', amount: '', category: '' })
  const [showEF, setShowEF] = useState(false)
  const [ready, setReady] = useState(false)
  const [users, setUsers] = useState(mockUsers)
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUser, setNewUser] = useState({ name: '', role: 'Cashier', email: '' })

  useEffect(() => { setTimeout(() => setReady(true), 100) }, [])

  const login = () => {
    const found = Object.values(USERS).find(x => x.username === u && x.password === p)
    if (found) { setUser(found); setLoggedIn(true); setErr('') }
    else setErr('Invalid credentials. Please try again.')
  }

  const rev = mockSales.reduce((s, i) => s + i.amount, 0)
  const exp = expenses.reduce((s, i) => s + i.amount, 0)
  const profit = rev - exp

  const addExp = () => {
    if (!newExp.desc || !newExp.amount) return
    setExpenses([...expenses, { id: expenses.length + 1, ...newExp, amount: parseInt(newExp.amount), date: 'Today' }])
    setNewExp({ desc: '', amount: '', category: '' })
    setShowEF(false)
  }

  const addUser = () => {
    if (!newUser.name || !newUser.email) return
    const newId = Math.max(...users.map(u => u.id)) + 1
    setUsers([...users, { id: newId, ...newUser, status: 'active', lastLogin: 'Never' }])
    setNewUser({ name: '', role: 'Cashier', email: '' })
    setShowAddUser(false)
  }

  const removeUser = (id) => {
    setUsers(users.filter(u => u.id !== id))
  }

  const nav = [
    { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
    { id: 'sales', icon: '◈', label: 'Sales' },
    { id: 'expenses', icon: '◉', label: 'Expenses' },
    ...(user?.role === 'Super Admin' ? [{ id: 'users', icon: '◎', label: 'Users' }] : []),
    { id: 'settings', icon: '◌', label: 'Settings' },
  ]

  if (!loggedIn) return (
    <div className={`root ${dark ? 'dk' : 'lt'}`}>
      <BgOrbs />
      <div className={`login-wrap ${ready ? 'in' : ''}`}>
        <div className="login-card">
          <div className="lc-top">
            <img src="/logo.png" alt="BBytes" className="lc-logo" />
            <div className="lc-brand">
              <div className="lc-name">Beryl<span>Bytes</span></div>
              <div className="lc-sub">SYSTEMS OS · ADMIN PORTAL</div>
            </div>
          </div>
          <div className="lc-divider"></div>
          <div className="lc-form">
            <div className="lc-field">
              <label>Username</label>
              <input value={u} onChange={e => setU(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} placeholder="Enter your username" autoFocus />
            </div>
            <div className="lc-field">
              <label>Password</label>
              <input type="password" value={p} onChange={e => setP(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} placeholder="Enter your password" />
            </div>
            {err && <div className="lc-err">⚠ {err}</div>}
            <button className="lc-btn" onClick={login}>Sign In <span>→</span></button>
          </div>
          <div className="lc-hints">
            <div className="lc-hint"><span className="hint-role">Admin</span><span>admin · bbytes2026</span></div>
            <div className="lc-hint"><span className="hint-role">Cashier</span><span>cashier · cashier123</span></div>
          </div>
          <button className="mode-pill" onClick={() => setDark(!dark)}>{dark ? '☀ Light Mode' : '☽ Dark Mode'}</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className={`root ${dark ? 'dk' : 'lt'}`}>
      <BgOrbs subtle />
      <div className="app-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sb-head">
            <img src="/logo.png" alt="B" className="sb-logo" />
            <div>
              <div className="sb-title">Beryl<span>Bytes</span></div>
              <div className="sb-sub">SYSTEMS OS</div>
            </div>
          </div>
          <nav className="sb-nav">
            {nav.map(n => (
              <button key={n.id} className={`nb ${tab === n.id ? 'act' : ''}`} onClick={() => setTab(n.id)}>
                <span className="nb-ic">{n.icon}</span>
                <span className="nb-lb">{n.label}</span>
                {tab === n.id && <span className="nb-bar"></span>}
              </button>
            ))}
          </nav>
          <div className="sb-foot">
            <div className="sb-user">
              <div className="av">{user?.name?.[0]}</div> 
              <div className="av-info">
                <div className="av-name">{user.name}</div>
                <div className="av-role">{user.role}</div>
              </div>
            </div>
            <button className="lo-btn" onClick={() => setLoggedIn(false)} title="Logout">↩</button>
          </div>
        </aside>

        {/* Main */}
        <main className="main">
          <div className="topbar">
            <div className="tb-left">
              <h1 className="tb-title">{nav.find(n => n.id === tab)?.label}</h1>
              <span className="tb-date">{new Date().toDateString()}</span>
            </div>
            <div className="tb-right">
              <div className="tb-search">
                <span>⌕</span>
                <input placeholder="Search products, customers, invoices..." />
              </div>
              <div className="live-badge"><div className="ld"></div>Live</div>
              <button className="ico-btn" onClick={() => setDark(!dark)}>{dark ? '☀' : '☽'}</button>
              <button className="primary-btn" onClick={() => window.location.href = '/'}>+ New Transaction</button>
            </div>
          </div>

          <div className="page">
            {/* DASHBOARD */}
            {tab === 'dashboard' && (
              <div className="fade-in">
                <div className="ph">
                  <div>
                    <h2>Business Overview</h2>
                    <p>Real-time performance metrics and sales overview.</p>
                  </div>
                  <button className="ghost-btn">↗ Export Daily Report</button>
                </div>
                <div className="metrics-row">
                  {[
                    { label: 'Total Revenue', val: `KES ${rev.toLocaleString()}`, sub: '+12.5% ↑', cls: 'g', icon: '💰' },
                    { label: 'Room Occupancy', val: '0%', sub: 'No Activity', cls: 'b', icon: '🏠' },
                    { label: 'Active Customers', val: '0', sub: 'Standby', cls: 'p', icon: '👥' },
                    { label: 'Net Profit', val: `KES ${profit.toLocaleString()}`, sub: 'After expenses', cls: 't', icon: '📈' },
                  ].map((m, i) => (
                    <div key={i} className={`mc ${m.cls}`}>
                      <div className="mc-glow"></div>
                      <div className="mc-icon">{m.icon}</div>
                      <div className="mc-label">{m.label}</div>
                      <div className="mc-val">{m.val}</div>
                      <div className="mc-sub">{m.sub}</div>
                    </div>
                  ))}
                </div>
                <div className="cards-row">
                  <div className="card">
                    <div className="card-head"><h3>Admin Performance Insights</h3><span className="badge">SYSTEM-WIDE</span></div>
                    {[
                      { l: 'Total System Users', v: mockUsers.length, t: 'Live Meta' },
                      { l: 'Lifetime Revenue', v: `KES ${rev.toLocaleString()}`, t: 'All-time' },
                      { l: 'Total Transactions', v: mockSales.length, t: 'Today' },
                    ].map((r, i) => (
                      <div key={i} className="pi-row">
                        <span className="pi-l">{r.l}</span>
                        <div className="pi-r"><strong>{r.v}</strong><span className="pi-t">{r.t}</span></div>
                      </div>
                    ))}
                  </div>
                  <div className="card">
                    <div className="card-head"><h3>Recent Sales</h3></div>
                    {mockSales.slice(0, 4).map(s => (
                      <div key={s.id} className="sr">
                        <div><div className="sr-item">{s.item}</div><div className="sr-meta">{s.time} · {s.method}</div></div>
                        <div className="sr-r"><span className="sr-amt">KES {s.amount}</span><span className={`pill ${s.status}`}>{s.status}</span></div>
                      </div>
                    ))}
                  </div>
                  <div className="card">
                    <div className="card-head"><h3>Payment Breakdown</h3></div>
                    {['M-Pesa', 'Cash', 'Card'].map(m => {
                      const c = mockSales.filter(s => s.method === m).length
                      const pct = Math.round((c / mockSales.length) * 100)
                      return (
                        <div key={m} className="pb">
                          <span className="pb-l">{m}</span>
                          <div className="pb-t"><div className="pb-f" style={{ width: `${pct}%` }}></div></div>
                          <span className="pb-p">{pct}%</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* SALES */}
            {tab === 'sales' && (
              <div className="fade-in">
                <div className="ph"><div><h2>Sales History</h2><p>All transactions today.</p></div><button className="ghost-btn">↗ Export</button></div>
                <div className="card">
                  <table className="tbl">
                    <thead><tr><th>Invoice</th><th>Item</th><th>Amount</th><th>Method</th><th>Cashier</th><th>Time</th><th>Status</th></tr></thead>
                    <tbody>{mockSales.map(s => (<tr key={s.id}><td className="inv-id">{s.id}</td><td>{s.item}</td><td className="amt">KES {s.amount}</td><td>{s.method}</td><td>{s.cashier}</td><td>{s.time}</td><td><span className={`pill ${s.status}`}>{s.status}</span></td></tr>))}</tbody>
                  </table>
                </div>
              </div>
            )}

            {/* EXPENSES */}
            {tab === 'expenses' && (
              <div className="fade-in">
                <div className="ph"><div><h2>Expense Tracker</h2><p>Monitor business spending.</p></div><button className="primary-btn" onClick={() => setShowEF(!showEF)}>+ Add Expense</button></div>
                {showEF && (
                  <div className="ef-form fade-in">
                    <input placeholder="Description" value={newExp.desc} onChange={e => setNewExp({ ...newExp, desc: e.target.value })} />
                    <input type="number" placeholder="Amount (KES)" value={newExp.amount} onChange={e => setNewExp({ ...newExp, amount: e.target.value })} />
                    <select value={newExp.category} onChange={e => setNewExp({ ...newExp, category: e.target.value })}>
                      <option value="">Category</option>
                      {['Inventory', 'Rent', 'Staff', 'Utilities', 'Transport', 'Marketing'].map(c => <option key={c}>{c}</option>)}
                    </select>
                    <button className="primary-btn" onClick={addExp}>Save</button>
                  </div>
                )}
                <div className="card">
                  <table className="tbl">
                    <thead><tr><th>Description</th><th>Category</th><th>Amount</th><th>Date</th></tr></thead>
                    <tbody>{expenses.map(e => (<tr key={e.id}><td>{e.desc}</td><td><span className="ctag">{e.category}</span></td><td className="amt red">-KES {e.amount.toLocaleString()}</td><td>{e.date}</td></tr>))}</tbody>
                  </table>
                  <div className="exp-total">Total Expenses: <strong>KES {exp.toLocaleString()}</strong></div>
                </div>
              </div>
            )}

            {/* USERS */}
            {tab === 'users' && user.role === 'Super Admin' && (
              <div className="fade-in">
                <div className="ph"><div><h2>User Management</h2><p>Manage access and roles.</p></div><button className="primary-btn" onClick={() => setShowAddUser(!showAddUser)}>+ Add User</button></div>
                {showAddUser && (
                  <div className="ef-form fade-in">
                    <input placeholder="Full Name" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
                    <input placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
                    <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                      <option value="Cashier">Cashier</option>
                      <option value="Employee">Employee</option>
                      <option value="Manager">Manager</option>
                      <option value="Super Admin">Super Admin</option>
                    </select>
                    <button className="primary-btn" onClick={addUser}>Add User</button>
                    <button className="ghost-btn" onClick={() => setShowAddUser(false)}>Cancel</button>
                  </div>
                )}
                <div className="card">
                  <table className="tbl">
                    <thead><tr><th>Name</th><th>Role</th><th>Status</th><th>Last Login</th><th>Actions</th></tr></thead>
                    <tbody>{users.map(u => (<tr key={u.id}><td><div className="urow"><div className="av sm">{u.name[0]}</div>{u.name}</div></td><td><span className={`role-pill ${u.role === 'Super Admin' ? 'admin' : 'cashier'}`}>{u.role}</span></td><td><span className={`pill ${u.status}`}>{u.status}</span></td><td>{u.lastLogin}</td><td><button className="ghost-btn sm" onClick={() => removeUser(u.id)}>Remove</button></td></tr>))}</tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SETTINGS */}
            {tab === 'settings' && (
              <div className="fade-in">
                <div className="ph"><div><h2>Settings</h2><p>Configure your system.</p></div></div>
                <div className="settings-grid">
                  <div className="card">
                    <h3>Appearance</h3>
                    <p>Display Theme</p>
                    <div className="theme-options">
                      <button className={`theme-btn ${!dark ? 'active' : ''}`} onClick={() => setDark(false)}>☀ Light</button>
                      <button className={`theme-btn ${dark ? 'active' : ''}`} onClick={() => setDark(true)}>☽ Dark</button>
                    </div>
                  </div>
                  <div className="card">
                    <h3>Profile & Account</h3>
                    <div className="profile-info">
                      <div className="av large">{user?.name?.[0]}</div>
                      <div>
                        <div className="profile-name">{user?.name}</div>
                        <div className="profile-email">{user?.username}@bbytes.com</div>
                        <div className="profile-role">Role: {user?.role}</div>
                        <div className="profile-org">Org: beryl_bytes_global</div>
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <h3>Access Role Control</h3>
                    <p>Simulate different user perspectives to verify permission gates and UI visibility.</p>
                    <div className="role-switches">
                      {[
                        { label: 'Frontend User', icon: 'F' },
                        { label: 'Cashier', icon: 'C' },
                        { label: 'Employee', icon: 'E' },
                        { label: 'Manager', icon: 'M' },
                        { label: 'Super Admin', icon: 'S' },
                      ].map(r => (
                        <div key={r.label} className="role-switch">
                          <span className="role-icon">{r.icon}</span>
                          <span>{r.label}</span>
                          <button className="switch-btn">Switch view</button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="card">
                    <h3>System & Security</h3>
                    <div className="sf"><label>Language</label><select defaultValue="en-US"><option value="en-US">English (United States)</option></select></div>
                    <div className="sf"><label>Sync Mode</label><span className="sync-status">Cloud Realtime Sync Enabled</span></div>
                    <div className="sf"><label>Biometric Enforcement</label><input type="checkbox" defaultChecked /> <span>Enable hardware-level verification for all high-value transactions (POS &gt; 5k KES).</span></div>
                    <button className="primary-btn">Setup WebAuthn</button>
                  </div>
                  <div className="card">
                    <h3>Notifications</h3>
                    <div className="notif-setting">
                      <input type="checkbox" defaultChecked id="inv-alerts" />
                      <label htmlFor="inv-alerts">Inventory Alerts - Receive pings when stock levels drop below 10% threshold.</label>
                    </div>
                    <div className="notif-setting">
                      <input type="checkbox" defaultChecked id="sales-reports" />
                      <label htmlFor="sales-reports">Sales Reports - Daily EOD summaries sent to connected mobile devices.</label>
                    </div>
                    <div className="notif-setting">
                      <input type="checkbox" defaultChecked id="security-logs" />
                      <label htmlFor="security-logs">Security Logs - Alerts for unauthorized terminal login attempts.</label>
                    </div>
                  </div>
                  <div className="card">
                    <h3>Beryl Bytes Systems OS</h3>
                    <p>You are currently running version <strong>4.2.0 (Enterprise LTS)</strong>. All operations are logged and encrypted.</p>
                    <button className="ghost-btn">Check for Updates</button>
                  </div>
                  <div className="card">
                    <h3>Business Settings</h3>
                    {[['Business Name', 'BBytes System'], ['VAT Rate', '16%'], ['M-Pesa Shortcode', '174379'], ['Currency', 'KES']].map(([l, v]) => (
                      <div key={l} className="sf"><label>{l}</label><input defaultValue={v} /></div>
                    ))}
                    <button className="primary-btn" style={{ marginTop: '8px' }}>Save Changes</button>
                  </div>
                  <div className="card">
                    <h3>Security</h3>
                    <div className="sf"><label>New Password</label><input type="password" placeholder="Enter new password" /></div>
                    <button className="primary-btn" style={{ marginTop: '8px' }}>Update Password</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}