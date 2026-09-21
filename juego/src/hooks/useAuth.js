import { useState, useEffect, useCallback } from 'react';
import { getCurrentUser, login as authLogin, logout as authLogout } from '../services/authService';

/**
 * Hook para gestionar el estado reactivo de autenticación y roles
 */
export const useAuth = () => {
  const [user, setUser] = useState(() => getCurrentUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(getCurrentUser());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    const result = await authLogin(username, password);
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

  return {
    user,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'ADMIN',
    isPlayer: user?.role === 'PLAYER',
    loading,
    login,
    logout
  };
};
