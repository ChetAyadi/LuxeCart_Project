import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.post('/users/login/', { username, password });
      setUserInfo(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.detail || 'Invalid username or password';
      setError(message);
      return { success: false, message };
    }
  };

  const register = async (name, username, email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.post('/users/register/', { name, username, email, password });
      setUserInfo(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.detail || 'Registration failed';
      setError(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem('userInfo');
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.put('/users/profile/update/', userData);
      
      // Preserve current tokens when updating profile info
      const updated = {
        ...data,
        token: userInfo?.token,
        refresh: userInfo?.refresh,
      };

      setUserInfo(updated);
      localStorage.setItem('userInfo', JSON.stringify(updated));
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.detail || 'Failed to update profile';
      setError(message);
      return { success: false, message };
    }
  };

  const changePassword = async (old_password, new_password) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.post('/users/change-password/', { old_password, new_password });
      setLoading(false);
      return { success: true, message: data.detail };
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.detail || 'Failed to change password';
      setError(message);
      return { success: false, message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
