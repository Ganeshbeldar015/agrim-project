import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false); // Set to false for dev mode to avoid blocking

  // DEV MODE: Mock Login
  const login = (role) => {
    const mockUser = {
      uid: `dev-${role}-123`,
      email: `${role}@antigravity.com`,
      displayName: `Dev ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      photoURL: null,
      role: role // Attach role to user object for convenience
    };
    setCurrentUser(mockUser);
    localStorage.setItem('dev_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('dev_user');
    // signOut(auth); // Keep firebase logout if needed later
  };

  // Restore session
  useEffect(() => {
    const storedUser = localStorage.getItem('dev_user');
    if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  /* Firebase listener commented out for temporary auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);
  */

  const value = {
    currentUser,
    login, 
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
