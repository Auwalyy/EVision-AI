import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ev_user')); } catch { return null; }
  });

  // Validate stored token on mount — log out if expired
  useEffect(() => {
    const token = localStorage.getItem('ev_token');
    if (!token) return;
    api.get('/auth/profile').catch(() => {
      localStorage.removeItem('ev_token');
      localStorage.removeItem('ev_user');
      setUser(null);
    });
  }, []);
  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('ev_token', res.token);
    localStorage.setItem('ev_user', JSON.stringify(res.user));
    setUser(res.user);
    return res;
  }, []);

  const register = useCallback(async (data) => {
    const res = await api.post('/auth/register', data);
    localStorage.setItem('ev_token', res.token);
    localStorage.setItem('ev_user', JSON.stringify(res.user));
    setUser(res.user);
    return res;
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('ev_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ev_token');
    localStorage.removeItem('ev_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
