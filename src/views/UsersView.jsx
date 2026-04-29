export default function UsersView({ users, showAddUser, setShowAddUser, newUser, setNewUser, addUser, removeUser, isSuperAdmin }) {
  if (!isSuperAdmin) return <div className="panel full-col"><div className="empty-state"><div className="e-icon">🔒</div><p>Access Denied</p><span>Only SuperAdmin can manage users</span></div></div>

  return (
    <div className="dash-grid">
      <div className="panel full-col">
        <div className="panel-hd"><h2>👤 User Management</h2><button className="btn-p btn-sm" onClick={() => setShowAddUser(true)}>+ Add User</button></div>
        {showAddUser && (
          <div className="inline-form">
            <div className="form-grid">
              <div className="sf"><label>Full Name</label><input value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} placeholder="John Doe" /></div>
              <div className="sf"><label>Username</label><input value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} placeholder="johndoe" /></div>
              <div className="sf"><label>Password</label><input type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} placeholder="••••••" /></div>
              <div className="sf"><label>Role</label>
                <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                  <option>Super Admin</option>
                  <option>Manager</option>
                  <option>Cashier</option>
                </select>
              </div>
            </div>
            <div className="btn-row" style={{ marginTop: 10 }}>
              <button className="btn-p" onClick={() => {
                if (!newUser.name || !newUser.username || !newUser.password) return;
                addUser(newUser);
                setNewUser({ name: '', username: '', password: '', role: 'Cashier' });
                setShowAddUser(false);
              }}>Save</button>
              <button className="btn-g" onClick={() => setShowAddUser(false)}>Cancel</button>
            </div>
          </div>
        )}
        <table className="data-table">
          <thead><tr><th>Name</th><th>Username</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{users.map(u => (
            <tr key={u.id}>
              <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div className="crm-avatar" style={{ background: u.color, width: 28, height: 28, fontSize: 12 }}>{u.initial}</div>{u.name}</div></td>
              <td>{u.username}</td>
              <td><span className={`pill ${u.role === 'Super Admin' ? 'paid' : 'pending'}`}>{u.role}</span></td>
              <td><span className="pill paid">Active</span></td>
              <td>{u.role !== 'Super Admin' && <button className="btn-g btn-sm" onClick={() => removeUser(u.id)}>Remove</button>}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  )
}
