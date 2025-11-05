
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

type User = {
  name: string;
  email: string;
};

type UserWithPassword = User & { password?: string; oldPassword?: string };

type SentRequests = {
  callback: { experienceId: number; email: string; }[];
  message: { experienceId: number; email: string; }[];
}

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => void;
  logout: () => void;
  signup: (name: string, email: string, pass: string) => void;
  updateUser: (currentEmail: string, updates: Partial<UserWithPassword>) => void;
  hasSentRequest: (type: 'callback' | 'message', experienceId: number) => boolean;
  addSentRequest: (type: 'callback' | 'message', experienceId: number, userEmail: string) => void;
  removeSentRequest: (type: 'callback' | 'message', experienceId: number, userEmail: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getInitialSentRequests = (): SentRequests => {
    if (typeof window === 'undefined') {
        return { callback: [], message: [] };
    }
    const stored = localStorage.getItem('bookit_all_sent_requests');
    try {
        if(stored) return JSON.parse(stored);
    } catch(e) {
        console.error("Failed to parse sent requests from localStorage", e);
    }
    return { callback: [], message: [] };
}


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sentRequests, setSentRequests] = useState<SentRequests>(getInitialSentRequests);

  useEffect(() => {
    // Check local storage for user session
    const storedUser = localStorage.getItem('bookit_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
    setSentRequests(getInitialSentRequests()); // Always load from one source of truth
    setLoading(false);
  }, []);

  const login = (email: string, pass: string) => {
    const storedUsers: UserWithPassword[] = JSON.parse(localStorage.getItem('bookit_users') || '[]');
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

  const updateUser = (currentEmail: string, updates: Partial<UserWithPassword>) => {
    const storedUsers: UserWithPassword[] = JSON.parse(localStorage.getItem('bookit_users') || '[]');
    const userIndex = storedUsers.findIndex(u => u.email === currentEmail);

    if (userIndex === -1) {
        throw new Error('Could not find user to update.');
    }

    const userToUpdate = storedUsers[userIndex];

    // Verify old password
    if (userToUpdate.password !== updates.oldPassword) {
        throw new Error('Incorrect current password.');
    }
    
    // Check if new email is already taken by another user
    if (updates.email && updates.email !== currentEmail) {
        const existingUser = storedUsers.find(u => u.email === updates.email);
        if (existingUser) {
            throw new Error('This email address is already in use.');
        }
    }

    // Update user in the full list
    const updatedUser = { ...userToUpdate, ...updates };
    // oldPassword is not part of the user model, so don't save it
    delete updatedUser.oldPassword;
    storedUsers[userIndex] = updatedUser;
    localStorage.setItem('bookit_users', JSON.stringify(storedUsers));
    
    // Update the current session user
    const { password, ...userToStore } = updatedUser;
    setUser(userToStore);
    localStorage.setItem('bookit_user', JSON.stringify(userToStore));

    // If email was changed, we need to update sent requests as well
    if (updates.email && updates.email !== currentEmail) {
      setSentRequests(prev => {
        const newRequests: SentRequests = JSON.parse(JSON.stringify(prev)); // deep copy
        newRequests.callback.forEach(req => {
          if (req.email === currentEmail) req.email = updates.email!;
        });
        newRequests.message.forEach(req => {
          if (req.email === currentEmail) req.email = updates.email!;
        });
        localStorage.setItem('bookit_all_sent_requests', JSON.stringify(newRequests));
        return newRequests;
      });
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bookit_user');
  };
  
  const addSentRequest = useCallback((type: 'callback' | 'message', experienceId: number, userEmail: string) => {
    setSentRequests(prev => {
        const newRequests = { ...prev };
        const alreadyExists = newRequests[type].some(req => req.experienceId === experienceId && req.email === userEmail);
        
        if (!alreadyExists) {
            newRequests[type] = [...newRequests[type], { experienceId, email: userEmail }];
            localStorage.setItem('bookit_all_sent_requests', JSON.stringify(newRequests));
        }
        return newRequests;
    });
  }, []);

  const removeSentRequest = useCallback((type: 'callback' | 'message', experienceId: number, userEmail: string) => {
      setSentRequests(prev => {
          const newRequests = { ...prev };
          newRequests[type] = newRequests[type].filter(req => !(req.experienceId === experienceId && req.email === userEmail));
          localStorage.setItem('bookit_all_sent_requests', JSON.stringify(newRequests));
          return newRequests;
      });
  }, []);

  const hasSentRequest = useCallback((type: 'callback' | 'message', experienceId: number): boolean => {
    if (!user) return false;
    return sentRequests[type].some(req => req.experienceId === experienceId && req.email === user.email);
  }, [user, sentRequests]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup, updateUser, hasSentRequest, addSentRequest, removeSentRequest }}>
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
