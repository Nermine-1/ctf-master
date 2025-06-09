import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/me`);
      setUser(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      setError(null);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        username,
        password
      });
      
      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      setToken(access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      setUser(user);
      return true;
    } catch (error) {
      setError(error.response?.data?.error || 'Une erreur est survenue lors de la connexion');
      return false;
    }
  };

  const register = async (username, email, password) => {
    try {
      setError(null);
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, {
        username,
        email,
        password
      });
      return true;
    } catch (error) {
      setError(error.response?.data?.error || 'Une erreur est survenue lors de l\'inscription');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data) => {
    try {
      setError(null);
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/users/profile`, data);
      setUser(response.data.user);
      return true;
    } catch (error) {
      setError(error.response?.data?.error || 'Une erreur est survenue lors de la mise à jour du profil');
      return false;
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/change-password`, {
        current_password: currentPassword,
        new_password: newPassword
      });
      return true;
    } catch (error) {
      setError(error.response?.data?.error || 'Une erreur est survenue lors du changement de mot de passe');
      return false;
    }
  };

  const value = {
    user,
    loading,
    error,
    token,
    login,
    register,
    logout,
    updateProfile,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 