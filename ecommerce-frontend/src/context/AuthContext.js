import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setUser(parsedUser);
      API.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      const userData = {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        shareId: data.shareId,
        token: data.token,
      };
      setUser(userData);
      localStorage.setItem('userInfo', JSON.stringify(userData));
      API.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      toast.success('Login successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await API.post('/auth/register', { name, email, password });
      const userData = {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        shareId: data.shareId,
        token: data.token,
      };
      setUser(userData);
      localStorage.setItem('userInfo', JSON.stringify(userData));
      API.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      toast.success(`Registration successful! Your Share ID: ${data.shareId} 🎉`);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    delete API.defaults.headers.common['Authorization'];
    toast.info('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};