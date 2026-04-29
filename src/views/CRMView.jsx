import { getTier, TIERS } from '../data/products'

export default function CRMView({ customers, showAddCust, setShowAddCust, newCust, setNewCust, crmQ, setCrmQ, fKES, TODAY }) {
  return (
    <div className="dash-grid">
      <div className="panel full-col">
        <div className="panel-hd"><h2>👥 Customer Management</h2><button className="btn-p btn-sm" onClick={() => setShowAddCust(true)}>+ Add Customer</button></div>
        {showAddCust && (
          <div className="inline-form">
            <div className="form-grid">
              <div className="sf"><label>Full Name</label><input value={newCust.name} onChange={e => setNewCust({ ...newCust, name: e.target.value })} placeholder="Jane Doe" /></div>
              <div className="sf"><label>Email</label><input value={newCust.email} onChange={e => setNewCust({ ...newCust, email: e.target.value })} placeholder="jane@email.com" /></div>
              <div className="sf"><label>Phone</label><input value={newCust.phone} onChange={e => setNewCust({ ...newCust, phone: e.target.value })} placeholder="0712345678" /></div>
            </div>
            <div className="btn-row" style={{ marginTop: 10 }}>
              <button className="btn-p" onClick={() => {
                if (!newCust.name) return;
                setCustomers(p => [...p, { id: Date.now(), ...newCust, points: 0, visits: 0, totalSpent: 0, joined: TODAY }]);
                setNewCust({ name: '', email: '', phone: '' });
                setShowAddCust(false);
              }}>Save</button>
              <button className="btn-g" onClick={() => setShowAddCust(false)}>Cancel</button>
            </div>
          </div>
        )}
        <div className="search-box" style={{ margin: '10px 0', width: '100%' }}>
          <span>⌕</span><input placeholder="Search customers…" value={crmQ} onChange={e => setCrmQ(e.target.value)} />
        </div>
        {customers.length === 0
          ? <div className="empty-state"><div className="e-icon">👥</div><p>No customers yet</p><span>Add customers to earn loyalty points automatically at checkout</span></div>
          : <div className="crm-grid">{customers.filter(c => c.name.toLowerCase().includes(crmQ.toLowerCase())).map(c => {
            const tier = getTier(c.points);
            return (
              <div key={c.id} className="crm-card" style={{ borderTopColor: tier.color }}>
                <div className="crm-avatar" style={{ background: tier.color }}>{c.name[0]}</div>
                <div className="crm-name">{c.name}</div>
                {c.email && <div className="crm-meta">{c.email}</div>}
                {c.phone && <div className="crm-meta">📱 {c.phone}</div>}
                <div className="crm-tier" style={{ color: tier.color }}>⭐ {tier.name} — {tier.disc}% off</div>
                <div className="crm-row"><span>Points</span><strong>{c.points}</strong></div>
                <div className="crm-row"><span>Visits</span><strong>{c.visits}</strong></div>
                <div className="crm-row"><span>Spent</span><strong>{fKES(c.totalSpent || 0)}</strong></div>
              </div>
            )
          })}</div>
        }
      </div>
      <div className="panel full-col">
        <div className="panel-hd"><h2>🏆 Loyalty Tiers</h2></div>
        <div className="tier-grid">{TIERS.map(t => <div key={t.name} className="tier-card" style={{ borderTop: `3px solid ${t.color}` }}><div className="tier-name" style={{ color: t.color }}>{t.name}</div><div className="tier-row">Min Points: <strong>{t.min.toLocaleString()}</strong></div><div className="tier-row">Discount: <strong>{t.disc}%</strong></div></div>)}</div>
      </div>
    </div>
  )
}
