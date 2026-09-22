import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getCurrentUser,
  login as authLogin,
  logout as authLogout,
  updateUserProfile
} from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getCurrentUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const syncUser = (event) => {
      if (event?.detail !== undefined) {
        setUser(event.detail);
      } else {
        setUser(getCurrentUser());
      }
    };

    window.addEventListener('poketrivia_auth_change', syncUser);
    window.addEventListener('storage', syncUser);

    return () => {
      window.removeEventListener('poketrivia_auth_change', syncUser);
      window.removeEventListener('storage', syncUser);
    };
  }, []);

  const login = useCallback(async (username, password, selectedRole = null) => {
    setLoading(true);
    const result = await authLogin(username, password, selectedRole);
    setLoading(false);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setUser(null);
  }, []);

  const updateUser = useCallback(async (updates) => {
    if (!user?.id) return null;
    const updated = await updateUserProfile(user.id, updates);
    setUser(updated);
    return updated;
  }, [user?.id]);

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'ADMIN',
    isPlayer: user?.role === 'PLAYER',
    loading,
    login,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Fallback si no está dentro de AuthProvider
    const fallbackUser = getCurrentUser();
    return {
      user: fallbackUser,
      isAuthenticated: Boolean(fallbackUser),
      isAdmin: fallbackUser?.role === 'ADMIN',
      isPlayer: fallbackUser?.role === 'PLAYER',
      loading: false,
      login: authLogin,
      logout: authLogout,
      updateUser: (updates) => (fallbackUser ? updateUserProfile(fallbackUser.id, updates) : null)
    };
  }
  return context;
};
