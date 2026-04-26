import { useState, useEffect } from 'react'
import './Admin.css'

const ADMIN_USER = { username: 'admin', password: 'bbytes2026', role: 'Super Admin' }
const CASHIER_USER = { username: 'cashier', password: 'cashier123', role: 'Cashier' }

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

export default function Admin() {
  const [darkMode, setDarkMode] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [user, setUser] = useState(null)
  const [expenses, setExpenses] = useState(mockExpenses)
  const [newExp, setNewExp] = useState({ desc: '', amount: '', category: '' })
  const [showExpForm, setShowExpForm] = useState(false)
  const [animIn, setAnimIn] = useState(false)

  useEffect(() => {
    setTimeout(() => setAnimIn(true), 100)
  }, [])

  const handleLogin = () => {
    if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
      setUser(ADMIN_USER)
      setLoggedIn(true)
      setLoginError('')
    } else if (username === CASHIER_USER.username && password === CASHIER_USER.password) {
      setUser(CASHIER_USER)
      setLoggedIn(true)
      setLoginError('')
    } else {
      setLoginError('Invalid username or password')
    }
  }

  const totalRevenue = mockSales.reduce((s, i) => s + i.amount, 0)
  const totalExpenses = expenses.reduce((s, i) => s + i.amount, 0)
  const netProfit = totalRevenue - totalExpenses
  const mpesaSales = mockSales.filter(s => s.method === 'M-Pesa').length

  const addExpense = () => {
    if (!newExp.desc || !newExp.amount) return
    setExpenses([...expenses, {
      id: expenses.length + 1,
      desc: newExp.desc,
      category: newExp.category || 'Other',
      amount: parseInt(newExp.amount),
      date: 'Today'
    }])
    setNewExp({ desc: '', amount: '', category: '' })
    setShowExpForm(false)
  }

  if (!loggedIn) {
    return (
      <div className={`admin-wrap ${darkMode ? 'dark' : 'light'}`}>
        <div className="login-bg">
          <div className="orb orb1"></div>
          <div className="orb orb2"></div>
          <div className="orb orb3"></div>
        </div>
        <div className={`login-card ${animIn ? 'anim-in' : ''}`}>
          <div className="login-logo">
            <img src="/logo.png" alt="BBytes" className="admin-logo" />
            <h1>BBytes System</h1>
            <p>Admin Portal</p>
          </div>
          <div className="login-form">
            <div className="input-group">
              <span className="input-icon">👤</span>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <div className="input-group">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>
            {loginError && <div className="login-error">{loginError}</div>}
            <button className="login-btn" onClick={handleLogin}>
              Sign In →
            </button>
          </div>
          <div className="login-hint">
            <p>Admin: admin / bbytes2026</p>
            <p>Cashier: cashier / cashier123</p>
          </div>
          <button className="theme-toggle-login" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`admin-wrap ${darkMode ? 'dark' : 'light'}`}>
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <img src="/logo.png" alt="BBytes" className="admin-logo-sm" />
          <span>BBytes</span>
        </div>
        <nav className="sidebar-nav">
          {[
            { id: 'dashboard', icon: '📊', label: 'Dashboard' },
            { id: 'sales', icon: '🧾', label: 'Sales' },
            { id: 'expenses', icon: '💰', label: 'Expenses' },
            ...(user.role === 'Super Admin' ? [{ id: 'users', icon: '👥', label: 'Users' }] : []),
            { id: 'settings', icon: '⚙️', label: 'Settings' },
          ].map(tab => (
            <button
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="nav-icon">{tab.icon}</span>
              <span className="nav-label">{tab.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="user-badge">
            <div className="user-avatar">{user.name[0]}</div>
            <div>
              <div className="user-name">{user.name || 'Admin'}</div>
              <div className="user-role">{user.role}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={() => setLoggedIn(false)}>↩ Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-title">
            {activeTab === 'dashboard' && '📊 Dashboard'}
            {activeTab === 'sales' && '🧾 Sales History'}
            {activeTab === 'expenses' && '💰 Expense Tracker'}
            {activeTab === 'users' && '👥 User Management'}
            {activeTab === 'settings' && '⚙️ Settings'}
          </div>
          <div className="topbar-right">
            <div className="live-dot"></div>
            <span className="live-text">Live</span>
            <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="tab-content">
            <div className="metrics-grid">
              <div className="metric-card green">
                <div className="metric-icon">💰</div>
                <div className="metric-info">
                  <div className="metric-label">Today's Revenue</div>
                  <div className="metric-value">KES {totalRevenue.toLocaleString()}</div>
                  <div className="metric-sub">↑ 12% vs yesterday</div>
                </div>
              </div>
              <div className="metric-card red">
                <div className="metric-icon">📉</div>
                <div className="metric-info">
                  <div className="metric-label">Total Expenses</div>
                  <div className="metric-value">KES {totalExpenses.toLocaleString()}</div>
                  <div className="metric-sub">This month</div>
                </div>
              </div>
              <div className="metric-card blue">
                <div className="metric-icon">📈</div>
                <div className="metric-info">
                  <div className="metric-label">Net Profit</div>
                  <div className="metric-value">KES {netProfit.toLocaleString()}</div>
                  <div className="metric-sub">After expenses</div>
                </div>
              </div>
              <div className="metric-card purple">
                <div className="metric-icon">📱</div>
                <div className="metric-info">
                  <div className="metric-label">M-Pesa Transactions</div>
                  <div className="metric-value">{mpesaSales}</div>
                  <div className="metric-sub">Today</div>
                </div>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="dash-card">
                <h3>Recent Sales</h3>
                {mockSales.slice(0, 4).map(sale => (
                  <div key={sale.id} className="dash-row">
                    <div>
                      <div className="dash-name">{sale.item}</div>
                      <div className="dash-sub">{sale.time} · {sale.cashier}</div>
                    </div>
                    <div className="dash-right">
                      <span className="dash-amount">KES {sale.amount}</span>
                      <span className={`status-badge ${sale.status}`}>{sale.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="dash-card">
                <h3>Payment Methods</h3>
                <div className="pay-breakdown">
                  {['M-Pesa', 'Cash', 'Card'].map(method => {
                    const count = mockSales.filter(s => s.method === method).length
                    const pct = Math.round((count / mockSales.length) * 100)
                    return (
                      <div key={method} className="pay-row">
                        <span className="pay-label">{method}</span>
                        <div className="pay-bar-wrap">
                          <div className="pay-bar" style={{ width: `${pct}%` }}></div>
                        </div>
                        <span className="pay-pct">{pct}%</span>
                      </div>
                    )
                  })}
                </div>

                <h3 style={{ marginTop: '24px' }}>Top Categories</h3>
                {['Pharmacy', 'General Shop', 'Airbnb'].map((cat, i) => (
                  <div key={cat} className="dash-row">
                    <div className="dash-name">{cat}</div>
                    <div className="dash-amount">KES {[3200, 2100, 7000][i].toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sales Tab */}
        {activeTab === 'sales' && (
          <div className="tab-content">
            <div className="table-card">
              <div className="table-header">
                <h3>All Transactions</h3>
                <span className="badge">{mockSales.length} today</span>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Invoice</th>
                    <th>Item</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Cashier</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockSales.map(sale => (
                    <tr key={sale.id}>
                      <td className="inv-id">{sale.id}</td>
                      <td>{sale.item}</td>
                      <td className="amount">KES {sale.amount}</td>
                      <td>{sale.method}</td>
                      <td>{sale.cashier}</td>
                      <td>{sale.time}</td>
                      <td><span className={`status-badge ${sale.status}`}>{sale.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Expenses Tab */}
        {activeTab === 'expenses' && (
          <div className="tab-content">
            <div className="table-card">
              <div className="table-header">
                <h3>Expense Tracker</h3>
                <button className="add-btn" onClick={() => setShowExpForm(!showExpForm)}>
                  + Add Expense
                </button>
              </div>
              {showExpForm && (
                <div className="exp-form">
                  <input placeholder="Description" value={newExp.desc} onChange={e => setNewExp({ ...newExp, desc: e.target.value })} />
                  <input placeholder="Amount (KES)" type="number" value={newExp.amount} onChange={e => setNewExp({ ...newExp, amount: e.target.value })} />
                  <select value={newExp.category} onChange={e => setNewExp({ ...newExp, category: e.target.value })}>
                    <option value="">Category</option>
                    <option>Inventory</option>
                    <option>Rent</option>
                    <option>Staff</option>
                    <option>Utilities</option>
                    <option>Transport</option>
                    <option>Marketing</option>
                  </select>
                  <button className="save-btn" onClick={addExpense}>Save</button>
                </div>
              )}
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map(exp => (
                    <tr key={exp.id}>
                      <td>{exp.desc}</td>
                      <td><span className="cat-tag">{exp.category}</span></td>
                      <td className="amount red">-KES {exp.amount.toLocaleString()}</td>
                      <td>{exp.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="exp-total">
                Total Expenses: <strong>KES {expenses.reduce((s, e) => s + e.amount, 0).toLocaleString()}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab - Super Admin only */}
        {activeTab === 'users' && user.role === 'Super Admin' && (
          <div className="tab-content">
            <div className="table-card">
              <div className="table-header">
                <h3>User Management</h3>
                <button className="add-btn">+ Add User</button>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.map(u => (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div className="user-avatar sm">{u.name[0]}</div>
                          {u.name}
                        </div>
                      </td>
                      <td><span className={`role-badge ${u.role === 'Super Admin' ? 'admin' : 'cashier'}`}>{u.role}</span></td>
                      <td><span className={`status-badge ${u.status}`}>{u.status}</span></td>
                      <td>{u.lastLogin}</td>
                      <td><button className="edit-btn">Edit</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="tab-content">
            <div className="settings-grid">
              <div className="settings-card">
                <h3>Business Settings</h3>
                <div className="setting-row">
                  <label>Business Name</label>
                  <input defaultValue="BBytes System" />
                </div>
                <div className="setting-row">
                  <label>VAT Rate</label>
                  <input defaultValue="16%" />
                </div>
                <div className="setting-row">
                  <label>M-Pesa Shortcode</label>
                  <input defaultValue="174379" />
                </div>
                <div className="setting-row">
                  <label>Currency</label>
                  <input defaultValue="KES" />
                </div>
                <button className="save-btn">Save Changes</button>
              </div>
              <div className="settings-card">
                <h3>Appearance</h3>
                <div className="setting-row">
                  <label>Theme</label>
                  <button className="theme-toggle-btn" onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? '☀️ Switch to Light Mode' : '🌙 Switch to Dark Mode'}
                  </button>
                </div>
                <h3 style={{ marginTop: '24px' }}>Security</h3>
                <div className="setting-row">
                  <label>Change Password</label>
                  <input type="password" placeholder="New password" />
                </div>
                <button className="save-btn">Update Password</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}