import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

export const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  MANAGER: 'Manager',
  CASHIER: 'Cashier',
}

export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: ['pos', 'dashboard', 'crm', 'inventory', 'add_item', 'settings', 'users', 'reports', 'business_overview', 'expenses', 'ledger', 'companies', 'system_health'],
  [ROLES.MANAGER]: ['pos', 'dashboard', 'crm', 'inventory', 'add_item', 'settings', 'reports', 'expenses', 'ledger'],
  [ROLES.CASHIER]: ['pos', 'settings'],
}

const DEFAULT_USERS = [
  { id: 1, username: 'beryl', name: 'Beryl Munyao', password: 'bbytes2026', role: ROLES.SUPER_ADMIN, color: '#00f0a0', initial: 'B', passkey: null },
  { id: 2, username: 'manager', name: 'Admin User', password: 'manager123', role: ROLES.MANAGER, color: '#38beff', initial: 'A', passkey: null },
  { id: 3, username: 'cashier1', name: 'Cashier One', password: 'cashier123', role: ROLES.CASHIER, color: '#b57bff', initial: 'C', passkey: null },
  { id: 4, username: 'cashier2', name: 'Cashier Two', password: 'cashier456', role: ROLES.CASHIER, color: '#ff9248', initial: 'D', passkey: null },
]

const STORAGE_KEY = 'berylbytes_pos_users'
const AUTH_KEY = 'berylbytes_pos_auth'

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : DEFAULT_USERS
    } catch {
      return DEFAULT_USERS
    }
  })

  const [currentUser, setCurrentUser] = useState(null)

  const [isAuthenticated, setIsAuthenticated] = useState(!!currentUser)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
  }, [users])

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_KEY, JSON.stringify({ id: currentUser.id, timestamp: Date.now() }))
      setIsAuthenticated(true)
    } else {
      localStorage.removeItem(AUTH_KEY)
      setIsAuthenticated(false)
    }
  }, [currentUser])

  const login = useCallback((username, password) => {
    const user = users.find(u => u.username === username && u.password === password)
    if (user) {
      setCurrentUser(user)
      return { success: true, user }
    }
    return { success: false, error: 'Invalid username or password' }
  }, [users])

  const logout = useCallback(() => {
    setCurrentUser(null)
  }, [])

  const hasAccess = useCallback((viewId) => {
    if (!currentUser) return false
    const perms = ROLE_PERMISSIONS[currentUser.role] || []
    return perms.includes(viewId)
  }, [currentUser])

  const isSuperAdmin = useCallback(() => {
    return currentUser?.role === ROLES.SUPER_ADMIN
  }, [currentUser])

  const addUser = useCallback((userData) => {
    const newUser = {
      id: Date.now(),
      ...userData,
      color: getRandomColor(),
      initial: userData.name?.[0]?.toUpperCase() || 'U',
      passkey: null,
    }
    setUsers(prev => [...prev, newUser])
    return newUser
  }, [])

  const removeUser = useCallback((id) => {
    setUsers(prev => prev.filter(u => u.id !== id))
  }, [])

  const updateUserPassword = useCallback((id, newPassword) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, password: newPassword } : u))
  }, [])

  // Passkey / WebAuthn support
  const registerPasskey = useCallback(async () => {
    if (!currentUser || !window.PublicKeyCredential) {
      return { success: false, error: 'Passkeys not supported on this device' }
    }

    try {
      const challenge = new Uint8Array(32)
      crypto.getRandomValues(challenge)

      const publicKeyCredentialCreationOptions = {
        challenge,
        rp: { name: 'BerylBytes POS', id: window.location.hostname },
        user: {
          id: new TextEncoder().encode(String(currentUser.id)),
          name: currentUser.username,
          displayName: currentUser.name,
        },
        pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
        },
        timeout: 60000,
        attestation: 'none',
      }

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      })

      // Store credential ID for this user
      setUsers(prev => prev.map(u =>
        u.id === currentUser.id
          ? { ...u, passkey: { id: credential.id, rawId: Array.from(new Uint8Array(credential.rawId)) } }
          : u
      ))

      return { success: true, message: 'Passkey registered successfully' }
    } catch (err) {
      return { success: false, error: err.message || 'Passkey registration failed' }
    }
  }, [currentUser])

  const authenticateWithPasskey = useCallback(async () => {
    if (!window.PublicKeyCredential) {
      return { success: false, error: 'Passkeys not supported' }
    }

    try {
      const usersWithPasskeys = users.filter(u => u.passkey)
      if (usersWithPasskeys.length === 0) {
        return { success: false, error: 'No passkeys registered' }
      }

      const challenge = new Uint8Array(32)
      crypto.getRandomValues(challenge)

      const publicKeyCredentialRequestOptions = {
        challenge,
        allowCredentials: usersWithPasskeys.map(u => ({
          type: 'public-key',
          id: new Uint8Array(u.passkey.rawId),
        })),
        userVerification: 'required',
        timeout: 60000,
      }

      const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      })

      // Find user by credential ID
      const credentialId = assertion.id
      const user = usersWithPasskeys.find(u => u.passkey.id === credentialId)

      if (user) {
        setCurrentUser(user)
        return { success: true, user }
      }

      return { success: false, error: 'Passkey not recognized' }
    } catch (err) {
      return { success: false, error: err.message || 'Biometric authentication failed' }
    }
  }, [users])

  const checkBiometricSupport = useCallback(() => {
    return !!(window.PublicKeyCredential && navigator.credentials)
  }, [])

  return (
    <AuthContext.Provider value={{
      currentUser,
      users,
      isAuthenticated,
      login,
      logout,
      hasAccess,
      isSuperAdmin,
      addUser,
      removeUser,
      updateUserPassword,
      registerPasskey,
      authenticateWithPasskey,
      checkBiometricSupport,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

function getRandomColor() {
  const colors = ['#00f0a0', '#38beff', '#b57bff', '#ff9248', '#ff6b6b', '#00e5ff', '#ffd166', '#ff73fa']
  return colors[Math.floor(Math.random() * colors.length)]
}
