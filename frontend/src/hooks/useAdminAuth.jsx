/**
 * useAdminAuth — Auth context + hook untuk admin GeoSlide
 * Menyimpan JWT di sessionStorage agar otomatis keluar saat tab ditutup.
 */
import { createContext, useContext, useState, useCallback } from 'react';

export const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem('gs_admin_token') || null);
  const [user, setUser]   = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('gs_admin_user')); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login gagal.');
      sessionStorage.setItem('gs_admin_token', data.token);
      sessionStorage.setItem('gs_admin_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('gs_admin_token');
    sessionStorage.removeItem('gs_admin_user');
    setToken(null);
    setUser(null);
  }, []);

  const authFetch = useCallback(async (url, options = {}) => {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) { logout(); throw new Error('Sesi berakhir. Silakan login ulang.'); }
    return res;
  }, [token, logout]);

  return (
    <AdminAuthContext.Provider value={{ token, user, loading, error, login, logout, authFetch }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
