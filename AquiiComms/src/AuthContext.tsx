import React, { createContext, useState, useContext, useEffect } from 'react';
import type { AuthContextType, UserInfo } from './types';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(() => {
  const savedUser = localStorage.getItem('userInfo'); 
  if (savedUser) {
    return JSON.parse(savedUser);
  } else {
    return null;
  }
});

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  const login = (userData: UserInfo) => {
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUser(userData); 
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};