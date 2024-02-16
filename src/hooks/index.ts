import { useContext } from 'react';
import { AuthContext } from '../context/auth-context';

import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useLocalStorage = () => {
  const [value, setValue] = useState<string | null>(null);

  const setItem = async (key: string, value: string) => {
    setValue(value);
    await AsyncStorage.setItem(key, value);
  };

  const getItem = async (key: string) => {
    const value = await AsyncStorage.getItem(key);
    setValue(value);
    return value;
  };

  const removeItem = async (key: string) => {
    setValue(null);
    await AsyncStorage.removeItem(key);
  };

  return { value, setItem, getItem, removeItem };
};
