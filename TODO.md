# POS System Enhancement — Implementation Tracker

## ✅ Phase 1: Unified Authentication & Login Portal
- [ ] Create `src/context/AuthContext.js` — centralized auth with per-user passwords, roles
- [ ] Create `src/components/LoginPortal.jsx` — stylish animated sign-in with passkey/biometric option
- [ ] Update `src/index.js` — remove `/admin` split, single App entry point
- [ ] Refactor `src/App.js` — merge Admin.js features, add role-based routing
- [ ] Ensure subtle background animations (orbs, particles) on login portal

## ⬜ Phase 2: Enhanced Dashboard & Analytics
- [ ] Add 30-day sales chart alongside existing 7-day chart
- [ ] Today's sales overview with real-time metric cards
- [ ] Payment breakdown visualization (pie/donut chart)
- [ ] Initialize all metrics to zero, auto-update on sales
- [ ] Auto-refresh dashboard metrics

## ⬜ Phase 3: Light/Dark Mode & UI Polish
- [ ] CSS custom properties for light theme
- [ ] Global theme toggle in topbar
- [ ] Persist theme to localStorage
- [ ] Smooth transitions between themes

## ⬜ Phase 4: Security — Passkeys & Biometrics
- [ ] WebAuthn integration for passkey registration
- [ ] Biometric login option on sign-in portal
- [ ] Store passkey credentials in localStorage (dev mode)
- [ ] Role-based permission enforcement

## ⬜ Phase 5: User Management (SuperAdmin)
- [ ] "Users" tab in dashboard (SuperAdmin only)
- [ ] Add user dialog (name, role, password)
- [ ] Remove user with confirmation
- [ ] Persist users to localStorage

## ⬜ Final Integration & Testing
- [ ] Verify all roles work correctly
- [ ] Verify charts update on sale completion
- [ ] Verify theme toggle works globally
- [ ] Verify payment methods still function
- [ ] Verify Admin.js features are fully merged
