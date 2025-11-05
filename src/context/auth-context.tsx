
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

type User = {
  name: string;
  email: string;
};

type SentRequests = {
  callback: number[];
  message: number[];
}

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => void;
  logout: () => void;
  signup: (name: string, email: string, pass: string) => void;
  hasSentRequest: (type: 'callback' | 'message', experienceId: number) => boolean;
  addSentRequest: (type: 'callback' | 'message', experienceId: number) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sentRequests, setSentRequests] = useState<SentRequests>({ callback: [], message: [] });

  useEffect(() => {
    // Check local storage for user session
    const storedUser = localStorage.getItem('bookit_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // Load sent requests for this user
      const storedRequests = localStorage.getItem(`bookit_sent_requests_${parsedUser.email}`);
      if (storedRequests) {
        setSentRequests(JSON.parse(storedRequests));
      }
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
      // Load requests for newly logged-in user
      const storedRequests = localStorage.getItem(`bookit_sent_requests_${userToStore.email}`);
      if (storedRequests) {
        setSentRequests(JSON.parse(storedRequests));
      } else {
        setSentRequests({ callback: [], message: [] });
      }
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
    setSentRequests({ callback: [], message: [] }); // Reset for new user
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bookit_user');
    setSentRequests({ callback: [], message: [] }); // Clear requests on logout
  };
  
  const addSentRequest = useCallback((type: 'callback' | 'message', experienceId: number) => {
    if (!user) return;
    setSentRequests(prev => {
        const newRequests = { ...prev };
        if (!newRequests[type].includes(experienceId)) {
            newRequests[type] = [...newRequests[type], experienceId];
            localStorage.setItem(`bookit_sent_requests_${user.email}`, JSON.stringify(newRequests));
        }
        return newRequests;
    });
  }, [user]);

  const hasSentRequest = useCallback((type: 'callback' | 'message', experienceId: number): boolean => {
    if (!user) return false;
    return sentRequests[type].includes(experienceId);
  }, [user, sentRequests]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup, hasSentRequest, addSentRequest }}>
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
