import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../services/firebase';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

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
      userData.status = 'pending';
    }

    await setDoc(doc(db, "users", user.uid), userData);

    // Also create entries in the 'sellers' collection for visibility
    if (role === 'seller') {
      await setDoc(doc(db, "sellers", user.uid), {
        sellerId: user.uid,
        email: user.email,
        shopName: additionalData.shopName || 'N/A',
        ownerName: additionalData.displayName || 'N/A',
        phoneNumber: additionalData.phoneNumber || 'N/A',
        status: 'pending',
        joinedAt: new Date(),
        rating: 0,
        totalSales: 0,
        verifiedDocs: {}
      });
    }

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
    let unsubscribeProfile = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);

        // Use real-time listener for the user profile
        const userRef = doc(db, "users", user.uid);
        unsubscribeProfile = onSnapshot(userRef, (snapshot) => {
          if (snapshot.exists()) {
            setUserProfile(snapshot.data());
          } else {
            console.warn("User document not found for:", user.uid);
          }
          setLoading(false);
        }, (error) => {
          console.error("Profile sync error:", error);
          setLoading(false);
        });

      } else {
        if (unsubscribeProfile) {
          unsubscribeProfile();
          unsubscribeProfile = null;
        }

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
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
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
