/* eslint-disable prettier/prettier */
import React, { createContext, useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import { getUserDetails } from '../utils/api';

interface AuthContext {
  authData: any;
  setUser: (user: any) => void;
}
type Props = {
  children: React.ReactElement;
};

export const AuthContext = createContext<AuthContext>({
  authData: null,
  setUser: () => { },
});

export default function AuthProvider({ children }: Props) {
  const [authData, setAuthData] = useState();

  const setUser = () => {
  };

  async function onAuthStateChanged(user: any) {
    if (user) {
      getUserDetails().then((res) => {
        if (res) {
          let x = JSON.parse(JSON.stringify(user));
          setAuthData({ ...x, ...res });
        } else {
          setAuthData(user);
        }
      });
    } else {
      setAuthData(user);
    }
  }
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <>
      <AuthContext.Provider value={{ authData, setUser }}>
        {children}
      </AuthContext.Provider>
    </>
  );
}
