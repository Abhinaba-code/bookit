
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type User = {
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => void;
  logout: () => void;
  signup: (name: string, email: string, pass: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for user session
    const storedUser = localStorage.getItem('bookit_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email: string, pass: string) => {
    const storedUsers = JSON.parse(localStorage.getItem('bookit_users') || '[]');
    const foundUser = storedUsers.find((u: any) => u.email === email && u.password === pass);

    if (foundUser) {
      const { password, ...userToStore } = foundUser;
      setUser(userToStore);
      localStorage.setItem('bookit_user', JSON.stringify(userToStore));
    } else {
      throw new Error('Invalid email or password');
    }
  };

  const signup = (name: string, email: string, pass: string) => {
    const storedUsers = JSON.parse(localStorage.getItem('bookit_users') || '[]');
    const existingUser = storedUsers.find((u: any) => u.email === email);

    if (existingUser) {
      throw new Error('An account with this email already exists.');
    }
    
    const newUser = { name, email, password: pass };
    const updatedUsers = [...storedUsers, newUser];
    localStorage.setItem('bookit_users', JSON.stringify(updatedUsers));
    
    const { password, ...userToStore } = newUser;
    setUser(userToStore);
    localStorage.setItem('bookit_user', JSON.stringify(userToStore));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bookit_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
