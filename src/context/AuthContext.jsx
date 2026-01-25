import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../services/firebase';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Real Firebase Auth Functions
  async function signup(email, password, role = 'customer', additionalData = {}) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user document in Firestore
    const userData = {
      uid: user.uid,
      email: user.email,
      role: role,
      createdAt: new Date(),
      ...additionalData
    };

    if (role === 'seller') {
        userData.status = 'pending'; // Sellers start as pending
    }

    await setDoc(doc(db, "users", user.uid), userData);
    setUserProfile(userData);
    return userCredential;
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    localStorage.removeItem('dev_user');
    setUserProfile(null);
    return signOut(auth);
  }

  // DEV MODE: Mock Login
  const devLogin = (role) => {
    const mockUser = {
      uid: `dev-${role}-123`,
      email: `${role}@antigravity.com`,
      displayName: `Dev ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      photoURL: null,
      role: role
    };
    setCurrentUser(mockUser);
    setUserProfile({ ...mockUser, status: 'approved' }); // Mock users are approved
    localStorage.setItem('dev_user', JSON.stringify(mockUser));
  };

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in with Firebase
        setCurrentUser(user);
        
        // Fetch user profile from Firestore
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                setUserProfile(userDoc.data());
            } else {
                console.warn("User document not found for:", user.uid);
                // Handle case where auth exists but db doc doesn't (legacy/edge case)
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }

      } else {
        // No Firebase user, check for local dev user
        const storedUser = localStorage.getItem('dev_user');
        if (storedUser) {
           const parsedUser = JSON.parse(storedUser);
           setCurrentUser(parsedUser);
           setUserProfile({ ...parsedUser, status: 'approved' });
        } else {
           setCurrentUser(null);
           setUserProfile(null);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    login,
    signup, 
    logout,
    devLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
