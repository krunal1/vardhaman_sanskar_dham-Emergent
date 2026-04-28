import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('vsd_token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('vsd_token');
    delete axios.defaults.headers.common['Authorization'];
  }
};

const savedToken = localStorage.getItem('vsd_token');
if (savedToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { checkAuth(); }, []); // eslint-disable-line

  const checkAuth = async () => {
    const token = localStorage.getItem('vsd_token');
    if (!token) { setUser(false); setLoading(false); return; }
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/auth/me`);
      setUser(data);
    } catch (error) {
      setAuthToken(null);
      setUser(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${BACKEND_URL}/api/auth/login`, { email, password });
      if (data.access_token) setAuthToken(data.access_token);
      setUser(data);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || 'Login failed';
      return { success: false, error: typeof message === 'string' ? message : JSON.stringify(message) };
    }
  };

  const logout = async () => {
    try { await axios.post(`${BACKEND_URL}/api/auth/logout`, {}); } catch (e) { console.error(e); }
    setAuthToken(null);
    setUser(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
