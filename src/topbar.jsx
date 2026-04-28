<div className="topbar-right">
  <div className="search-box">
    <span>⌕</span>
    <input placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)} />
  </div>
  <div className="live-dot" />
  <div className="topbar-stat">
    <span className="topbar-stat-val">{fKES(totalRev)}</span>
    <span className="topbar-stat-lbl">Revenue</span>
  </div>
  <div className="topbar-stat">
    <span className="topbar-stat-val">{totalOrders}</span>
    <span className="topbar-stat-lbl">Orders</span>
  </div>

  {/* USER SWITCHER */}
  <div className="user-switcher">
    <button className="user-btn" onClick={() => setShowUserMenu(!showUserMenu)}>
      <div className="user-avatar" style={{ background: activeUser.color }}>{activeUser.initial}</div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <span className="user-name">{activeUser.name}</span>
        <span className="user-role">{activeUser.role}</span>
      </div>
      <span className="user-chevron">{showUserMenu ? '▲' : '▼'}</span>
    </button>

    {showUserMenu && (
      <div className="user-dropdown">
        <div className="user-dropdown-header">Switch User</div>
        {USERS.map(u => (
          <div key={u.id}
            className={`user-option ${activeUser.id === u.id ? 'active-user' : ''}`}
            onClick={() => { setActiveUser(u); setShowUserMenu(false); }}>
            <div className="user-option-avatar" style={{ background: u.color }}>{u.initial}</div>
            <div className="user-option-info">
              <span className="user-option-name">{u.name}</span>
              <span className="user-option-role">{u.role}</span>
            </div>
            {activeUser.id === u.id && <div className="user-active-badge" />}
          </div>
        ))}
      </div>
    )}
  </div>
</div>