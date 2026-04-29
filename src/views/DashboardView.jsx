export default function DashboardView({ totalRev, totalOrders, totalExp, netProfit, customers, ledger, expenses, salesData7, salesData30, showAddExp, setShowAddExp, newExp, setNewExp, addExp, fKES, TODAY }) {
  const maxBar7 = Math.max(...salesData7.map(d => d.revenue), 1)
  const maxBar30 = Math.max(...salesData30.map(d => d.revenue), 1)
  const todaySales = salesData7.find(d => d.date === TODAY)?.revenue || 0

  return (
    <div className="dash-grid">
      <div className="panel full-col">
        <div className="panel-hd"><h2>⚡ Live Performance</h2></div>
        <div className="kpi-row">
          {[
            { l: 'Total Revenue', v: fKES(totalRev), c: 'green' },
            { l: 'Orders', v: totalOrders, c: 'blue' },
            { l: 'Net Profit', v: fKES(netProfit), c: 'purple' },
            { l: 'Expenses', v: fKES(totalExp), c: 'red' },
            { l: 'Customers', v: customers.length, c: 'orange' },
            { l: 'Transactions', v: ledger.length, c: 'teal' },
          ].map(k => <div key={k.l} className={`kpi-card ${k.c}`}><div className="kpi-val">{k.v}</div><div className="kpi-lbl">{k.l}</div></div>)}
        </div>
      </div>

      <div className="panel">
        <div className="panel-hd"><h2>📈 Revenue — Last 7 Days</h2></div>
        {totalRev === 0
          ? <div className="empty-state"><div className="e-icon">📊</div><p>No sales yet</p><span>Complete a sale to see revenue here</span></div>
          : <div className="bar-chart">{salesData7.map((d, i) => <div key={i} className="bar-item"><div className="bar" style={{ height: `${(d.revenue / maxBar7) * 100}%` }}><span className="bar-tip">{fKES(d.revenue)}</span></div><span className="bar-lbl">{d.date.slice(-5)}</span></div>)}</div>
        }
      </div>

      <div className="panel">
        <div className="panel-hd"><h2>📊 Revenue — Last 30 Days</h2></div>
        {totalRev === 0
          ? <div className="empty-state"><div className="e-icon">📊</div><p>No sales yet</p><span>Complete a sale to see 30-day trends</span></div>
          : <div className="bar-chart" style={{ gap: 3 }}>{salesData30.map((d, i) => <div key={i} className="bar-item"><div className="bar" style={{ height: `${(d.revenue / maxBar30) * 100}%`, minWidth: 4 }}><span className="bar-tip">{fKES(d.revenue)}</span></div><span className="bar-lbl" style={{ fontSize: 7 }}>{d.date.slice(-2)}</span></div>)}</div>
        }
      </div>

      <div className="panel">
        <div className="panel-hd"><h2>💸 Expense Tracker</h2><button className="btn-p btn-sm" onClick={() => setShowAddExp(true)}>+ Add</button></div>
        {showAddExp && (
          <div className="inline-form">
            <div className="form-grid">
              <div className="sf full"><label>Description</label><input placeholder="e.g. Stock restock" value={newExp.desc} onChange={e => setNewExp({ ...newExp, desc: e.target.value })} /></div>
              <div className="sf"><label>Amount (KES)</label><input type="number" value={newExp.amount} onChange={e => setNewExp({ ...newExp, amount: e.target.value })} /></div>
              <div className="sf"><label>Category</label>
                <select value={newExp.category} onChange={e => setNewExp({ ...newExp, category: e.target.value })}>
                  <option value="">Select…</option>
                  {['Inventory', 'Rent', 'Staff', 'Utilities', 'Marketing', 'Maintenance', 'Other'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="btn-row" style={{ marginTop: 10 }}>
              <button className="btn-p" onClick={addExp}>Save</button>
              <button className="btn-g" onClick={() => setShowAddExp(false)}>Cancel</button>
            </div>
          </div>
        )}
        {expenses.length === 0
          ? <div className="empty-state"><div className="e-icon">💸</div><p>No expenses yet</p></div>
          : <><table className="data-table"><thead><tr><th>Description</th><th>Category</th><th>Amount</th><th>Date</th></tr></thead><tbody>{expenses.map(e => <tr key={e.id}><td>{e.desc}</td><td>{e.category}</td><td>{fKES(e.amount)}</td><td>{e.date}</td></tr>)}</tbody></table><div style={{ padding: '9px 0', fontSize: 12, color: 'var(--text2)', borderTop: '1px solid var(--border)', marginTop: 8 }}>Total: <strong style={{ color: 'var(--red)' }}>{fKES(totalExp)}</strong></div></>
        }
      </div>

      <div className="panel full-col">
        <div className="panel-hd"><h2>🧾 Digital Ledger</h2></div>
        {ledger.length === 0
          ? <div className="empty-state"><div className="e-icon">🧾</div><p>No transactions yet</p><span>Every completed sale appears here automatically</span></div>
          : <table className="data-table"><thead><tr><th>Invoice</th><th>Date</th><th>Customer</th><th>Amount</th><th>Method</th><th>Status</th></tr></thead><tbody>{ledger.map(r => <tr key={r.id}><td style={{ color: 'var(--accent)', fontWeight: 600 }}>{r.id}</td><td>{r.date}</td><td>{r.customer}</td><td><strong>{fKES(r.total)}</strong></td><td>{r.method}</td><td><span className="pill paid">{r.status}</span></td></tr>)}</tbody></table>
        }
      </div>
    </div>
  )
}
