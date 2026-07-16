import { createContext, useState } from 'react';
import { authApi } from '../api/authApi';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
    const { data } = await authApi.login(email, password);
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
