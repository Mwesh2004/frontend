import { useState, useEffect } from 'react'
import './Admin.css'

const USERS = {
  admin: { username: 'admin', password: 'bbytes2026', role: 'Super Admin', name: 'User Admin' },
  cashier: { username: 'cashier', password: 'cashier123', role: 'Cashier', name: 'User Cashier' },
}


const mockSales = []
const mockExpenses = []

const mockUsers = [
  { id: 1, name: 'User 1', role: 'Super Admin', status: 'active', lastLogin: 'Today 8:00 AM' },
  { id: 2, name: 'User 2', role: 'Cashier', status: 'active', lastLogin: 'Today 9:00 AM' },
  { id: 3, name: 'User 3', role: 'Accountant', status: 'inactive', lastLogin: 'Yesterday' },

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
  const [expenses, setExpenses] = useState([])
  const [newExp, setNewExp] = useState({ desc: '', amount: '', category: '' })
  const [showEF, setShowEF] = useState(false)
  const [ready, setReady] = useState(false)
  const [users, setUsers] = useState(mockUsers)
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUser, setNewUser] = useState({ name: '', role: 'Cashier', email: '' })
  const [companies] = useState([{ id: 1, name: 'BerylBytes Retail', type: 'Retail', users: 5, revenue: 0 }])
  const [globalSettings, setGlobalSettings] = useState({
    currency: 'KES',
    notifications: true,
    maintenance: false,
    apis: { stripe: 'Pending', whatsapp: 'Pending', maps: 'Pending' }
  })
  const [inventory, setInventory] = useState([])
  const [customers] = useState([])
  const [showAddItem, setShowAddItem] = useState(false)
  const [newItem, setNewItem] = useState({ name: '', sku: '', category: 'General', retailPrice: '', buyingPrice: '', stock: '', minAlert: '', expiry: '', batch: '' })
  const [qrScan, setQrScan] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString())

  useEffect(() => {
    setTimeout(() => setReady(true), 100)
    
    // Auto-refresh interval (updates every 3 seconds when logged in)
    let interval
    if (loggedIn && autoRefresh) {
      interval = setInterval(() => {
        setLastUpdate(new Date().toLocaleTimeString())
      }, 3000)
    }
    return () => clearInterval(interval)
  }, [loggedIn, autoRefresh])

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
    ...(user?.role === 'Super Admin' ? [
      { id: 'users', icon: '◎', label: 'Users' },
      { id: 'companies', icon: '🏢', label: 'Companies' },
      { id: 'user-access', icon: '🔑', label: 'User Access' },
      { id: 'system-settings', icon: '⚙️', label: 'System Settings' },
      { id: 'global-health', icon: '📊', label: 'Global System Health' },
      { id: 'inventory-pharma', icon: '📦', label: 'Inventory & Pharma' },
      { id: 'business-overview', icon: '📈', label: 'Business Overview' },
      { id: 'customer-relationships', icon: '👥', label: 'Customer Relationships' },
      { id: 'ledger', icon: '📋', label: 'Standard Ledger' },
    ] : []),
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

            {/* COMPANIES */}
            {tab === 'companies' && user.role === 'Super Admin' && (
              <div className="fade-in">
                <div className="ph"><div><h2>Companies</h2><p>Manage different businesses.</p></div><button className="primary-btn">+ Add Company</button></div>
                <div className="card">
                  <table className="tbl">
                    <thead><tr><th>Name</th><th>Type</th><th>Users</th><th>Revenue</th></tr></thead>
                    <tbody>{companies.map(c => (<tr key={c.id}><td>{c.name}</td><td>{c.type}</td><td>{c.users}</td><td>KES {c.revenue}</td></tr>))}</tbody>
                  </table>
                </div>
              </div>
            )}

            {/* USER ACCESS */}
            {tab === 'user-access' && user.role === 'Super Admin' && (
              <div className="fade-in">
                <div className="ph"><div><h2>User Access</h2><p>Different user access for different companies.</p></div></div>
                <div className="card">
                  <div className="search-bar"><input placeholder="Search global users..." /></div>
                  <table className="tbl">
                    <thead><tr><th>Name</th><th>Company</th><th>Role</th><th>Status</th></tr></thead>
                    <tbody>{users.map(u => (<tr key={u.id}><td>{u.name}</td><td>BerylBytes</td><td>{u.role}</td><td>{u.status}</td></tr>))}</tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SYSTEM SETTINGS */}
            {tab === 'system-settings' && user.role === 'Super Admin' && (
              <div className="fade-in">
                <div className="ph"><div><h2>System Settings</h2><p>Global System Configuration.</p></div></div>
                <div className="settings-grid">
                  <div className="card">
                    <h3>Global System Configuration</h3>
                    <div className="setting-item">
                      <label>Default Platform Currency</label>
                      <select value={globalSettings.currency} onChange={e => setGlobalSettings({ ...globalSettings, currency: e.target.value })}>
                        <option value="KES">Kenyan Shilling (KES)</option>
                        <option value="USD">US Dollar (USD)</option>
                      </select>
                    </div>
                    <div className="setting-item">
                      <label>System Notifications</label>
                      <input type="checkbox" checked={globalSettings.notifications} onChange={e => setGlobalSettings({ ...globalSettings, notifications: e.target.checked })} />
                    </div>
                    <div className="setting-item">
                      <label>Global Broadcast Access</label>
                      <input type="checkbox" checked={true} />
                    </div>
                    <div className="setting-item">
                      <label>System Maintenance Mode</label>
                      <input type="checkbox" checked={globalSettings.maintenance} onChange={e => setGlobalSettings({ ...globalSettings, maintenance: e.target.checked })} />
                      <p>Restrict all user access</p>
                    </div>
                  </div>
                  <div className="card">
                    <h3>External API Bridge</h3>
                    <p>Connect to Stripe/PayPal</p>
                    <div className="api-status">
                      <div>Stripe: {globalSettings.apis.stripe}</div>
                      <div>PayPal: Pending</div>
                    </div>
                  </div>
                  <div className="card">
                    <h3>Enterprise API Integration</h3>
                    <div>Stripe Payment Provider: {globalSettings.apis.stripe}</div>
                    <div>WhatsApp Business API: {globalSettings.apis.whatsapp}</div>
                    <div>Google Maps Grounding: {globalSettings.apis.maps}</div>
                    <p>Security Notice: Changes affect all companies.</p>
                  </div>
                </div>
              </div>
            )}

            {/* GLOBAL SYSTEM HEALTH */}
            {tab === 'global-health' && user.role === 'Super Admin' && (
              <div className="fade-in">
                <div className="ph"><div><h2>Global System Health</h2><p>Monitoring performance metrics.</p></div></div>
                <div className="metrics-row">
                  <div className="mc g">
                    <div className="mc-icon">💰</div>
                    <div className="mc-label">Total Revenue (Global)</div>
                    <div className="mc-val">KES {rev.toLocaleString()}</div>
                    <div className="mc-sub">Changes when used</div>
                  </div>
                </div>
                <div className="card">
                  <h3>Niche Distribution</h3>
                  <div className="niche-dist">
                    <div>Retail: {Math.round((mockSales.filter(s => s.item.includes('Flour') || s.item.includes('Oil')).length / mockSales.length) * 100)}%</div>
                    <div>Pharma: {Math.round((mockSales.filter(s => s.item.includes('Panadol') || s.item.includes('Amoxicillin')).length / mockSales.length) * 100)}%</div>
                    <div>Hospitality: {Math.round((mockSales.filter(s => s.item.includes('Room')).length / mockSales.length) * 100)}%</div>
                    <div>Medical Counter Sales: 0</div>
                  </div>
                </div>
              </div>
            )}

            {/* INVENTORY & PHARMA */}
            {tab === 'inventory-pharma' && user.role === 'Super Admin' && (
              <div className="fade-in">
                <div className="ph"><div><h2>Inventory & Pharma</h2><p>Stock & pharmaceutical management.</p></div><button className="primary-btn" onClick={() => setShowAddItem(true)}>+ Add Item</button></div>
                {showAddItem && (
                  <div className="ef-form fade-in">
                    <input placeholder="Product name" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
                    <input placeholder="SKU / Code" value={newItem.sku} onChange={e => setNewItem({ ...newItem, sku: e.target.value })} />
                    <select value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })}>
                      <option value="General">General</option>
                      <option value="Pharmaceutical">Pharmaceutical Grade</option>
                    </select>
                    <input placeholder="Retail Price (KES)" value={newItem.retailPrice} onChange={e => setNewItem({ ...newItem, retailPrice: e.target.value })} />
                    <input placeholder="Buying Price (Cost)" value={newItem.buyingPrice} onChange={e => setNewItem({ ...newItem, buyingPrice: e.target.value })} />
                    <input placeholder="Stock Level" value={newItem.stock} onChange={e => setNewItem({ ...newItem, stock: e.target.value })} />
                    <input placeholder="Min. Alert Level" value={newItem.minAlert} onChange={e => setNewItem({ ...newItem, minAlert: e.target.value })} />
                    {newItem.category === 'Pharmaceutical' && (
                      <>
                        <input placeholder="Expiry Date (dd-mm-yyyy)" value={newItem.expiry} onChange={e => setNewItem({ ...newItem, expiry: e.target.value })} />
                        <input placeholder="Batch Number" value={newItem.batch} onChange={e => setNewItem({ ...newItem, batch: e.target.value })} />
                      </>
                    )}
                    <div className="qr-scan">
                      <button className="ghost-btn" onClick={() => setQrScan(!qrScan)}>Scan QR</button>
                      {qrScan && <div>QR Scanner Placeholder - Simulate scan</div>}
                    </div>
                    <button className="primary-btn" onClick={() => { setInventory([...inventory, { ...newItem, id: inventory.length + 1 }]); setNewItem({ name: '', sku: '', category: 'General', retailPrice: '', buyingPrice: '', stock: '', minAlert: '', expiry: '', batch: '' }); setShowAddItem(false); }}>Add to Inventory</button>
                  </div>
                )}
                <div className="card">
                  <table className="tbl">
                    <thead><tr><th>Name</th><th>SKU</th><th>Category</th><th>Stock</th><th>Price</th></tr></thead>
                    <tbody>{inventory.map(i => (<tr key={i.id}><td>{i.name}</td><td>{i.sku}</td><td>{i.category}</td><td>{i.stock}</td><td>KES {i.retailPrice}</td></tr>))}</tbody>
                  </table>
                </div>
              </div>
            )}

            {/* BUSINESS OVERVIEW */}
            {tab === 'business-overview' && user.role === 'Super Admin' && (
              <div className="fade-in">
                <div className="ph"><div><h2>Business Overview</h2><p>Real-time performance metrics.</p></div><button className="ghost-btn">Export Daily Report</button></div>
                <div className="metrics-row">
                  <div className="mc g"><div className="mc-icon">💰</div><div className="mc-label">Total Revenue</div><div className="mc-val">Ksh {rev.toLocaleString()}</div><div className="mc-sub">Month over Month</div></div>
                  <div className="mc b"><div className="mc-icon">📈</div><div className="mc-label">Growth Index</div><div className="mc-val">0.0%</div><div className="mc-sub">Standby</div></div>
                  <div className="mc p"><div className="mc-icon">👥</div><div className="mc-label">Active Customers</div><div className="mc-val">{customers.length}</div><div className="mc-sub">Healthy</div></div>
                  <div className="mc t"><div className="mc-icon">⚠️</div><div className="mc-label">Inventory Alerts</div><div className="mc-val">0</div><div className="mc-sub">All good</div></div>
                </div>
                <div className="card">
                  <h3>Sales Performance</h3>
                  <div>Sales chart placeholder - 7D, 30D</div>
                </div>
                <div className="card">
                  <h3>Recent Sales</h3>
                  {mockSales.slice(0, 5).map(s => <div key={s.id}>{s.item} - KES {s.amount}</div>)}
                </div>
              </div>
            )}

            {/* CUSTOMER RELATIONSHIPS */}
            {tab === 'customer-relationships' && user.role === 'Super Admin' && (
              <div className="fade-in">
                <div className="ph"><div><h2>Customer Relationships</h2><p>Manage loyalty and track lifetime value.</p></div><button className="primary-btn">+ Add Customer</button></div>
                <div className="metrics-row">
                  <div className="mc"><div className="mc-icon">🎫</div><div className="mc-label">Loyalty Program Engine</div><div className="mc-val">0.0k</div><div className="mc-sub">Total Points Issuance</div></div>
                  <div className="mc"><div className="mc-icon">📊</div><div className="mc-label">Conversion</div><div className="mc-val">0%</div><div className="mc-sub">0 Paying</div></div>
                </div>
                <div className="card">
                  <h3>Segmentation</h3>
                  <div>VIP: 0</div>
                  <div>New Member: 0</div>
                  <div>Inactive: 0</div>
                  <div>General: 0</div>
                </div>
              </div>
            )}

            {/* STANDARD LEDGER */}
            {tab === 'ledger' && user.role === 'Super Admin' && (
              <div className="fade-in">
                <div className="ph"><div><h2>Standard Ledger</h2><p>Financial Reconciliation & Audit Trail.</p></div><button className="ghost-btn">Export CSV</button></div>
                <div className="metrics-row">
                  <div className="mc g"><div className="mc-icon">💰</div><div className="mc-label">Net Sales Inflow</div><div className="mc-val">Ksh {rev.toLocaleString()}</div></div>
                  <div className="mc"><div className="mc-icon">📊</div><div className="mc-label">Transaction Count</div><div className="mc-val">{mockSales.length}</div></div>
                  <div className="mc"><div className="mc-icon">📈</div><div className="mc-label">Avg Order Value</div><div className="mc-val">Ksh {(rev / mockSales.length || 0).toFixed(0)}</div></div>
                  <div className="mc"><div className="mc-icon">💳</div><div className="mc-label">E-Payment Ratio</div><div className="mc-val">0%</div></div>
                </div>
                <div className="card">
                  <h3>Transaction Records</h3>
                  <table className="tbl">
                    <thead><tr><th>Date/Time</th><th>Transaction ID</th><th>Payment</th><th>Amount</th><th>Actions</th></tr></thead>
                    <tbody>{mockSales.map(s => (<tr key={s.id}><td>{new Date().toLocaleString()}</td><td>{s.id}</td><td>{s.method}</td><td>KES {s.amount}</td><td>View</td></tr>))}</tbody>
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