import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('student').then((data) => {
      if (data) setStudent(JSON.parse(data));
      setLoading(false);
    });
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    await AsyncStorage.setItem('student', JSON.stringify(data));
    setStudent(data);
    return data;
  };

  const register = async (payload) => {
    const { data } = await api.post('/students', payload);
    return data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    await AsyncStorage.multiRemove(['student', 'token', 'refreshToken']);
    setStudent(null);
  };

  return (
    <AuthContext.Provider value={{ student, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
