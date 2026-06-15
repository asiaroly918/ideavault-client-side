import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile as firebaseUpdateProfile,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import toast from 'react-hot-toast';
import { auth, googleProvider } from '@/lib/firebase';
import {
  getJWT,
  setAuthToken,
  updateUserProfile as apiUpdateUserProfile,
  setDemoUser,
} from '@/lib/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const mapFirebaseUser = (fbUser) => ({
  uid: fbUser.uid,
  email: fbUser.email,
  displayName: fbUser.displayName,
  photoURL: fbUser.photoURL,
});

const useDemo = process.env.NEXT_PUBLIC_USE_DEMO === 'true';

const applyAuthData = async (setUser, setToken) => {
  const data = await getJWT('demo');
  setUser(data.user);
  setToken(data.token);
  setAuthToken(data.token);
  if (typeof window !== 'undefined') {
    localStorage.setItem('ideavault_token', data.token);
  }
};

export const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Demo mode: bypass Firebase and use a sample logged-in user
    if (useDemo) {
      applyAuthData(setUser, setToken)
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
      return;
    }

    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);

      if (fbUser) {
        try {
          const idToken = await fbUser.getIdToken(true);
          const data = await getJWT(idToken);
          const mappedUser = data.user || mapFirebaseUser(fbUser);

          setUser(mappedUser);
          setToken(data.token);
          setAuthToken(data.token);

          if (typeof window !== 'undefined') {
            localStorage.setItem('ideavault_token', data.token);
          }
        } catch (err) {
          toast.error('Authentication sync failed. Please log in again.');
          setUser(null);
          setToken(null);
          setAuthToken(null);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('ideavault_token');
          }
        }
      } else {
        setUser(null);
        setToken(null);
        setAuthToken(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('ideavault_token');
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    if (useDemo) {
      setDemoUser({ email, displayName: 'Demo User' });
      await applyAuthData(setUser, setToken);
      return;
    }
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  };

  const register = async (email, password, name, photoURL = '') => {
    if (useDemo) {
      setDemoUser({ email, displayName: name, photoURL });
      await applyAuthData(setUser, setToken);
      return;
    }
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await firebaseUpdateProfile(credential.user, {
      displayName: name,
      photoURL,
    });
    return credential.user;
  };

  const googleLogin = async () => {
    if (useDemo) {
      await applyAuthData(setUser, setToken);
      return;
    }
    const credential = await signInWithPopup(auth, googleProvider);
    return credential.user;
  };

  const logout = async () => {
    if (useDemo) {
      setUser(null);
      setToken(null);
      setAuthToken(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ideavault_token');
      }
      toast.success('You have been logged out');
      return;
    }
    await signOut(auth);
    toast.success('You have been logged out');
  };

  const updateUserProfile = async (updates) => {
    if (useDemo) {
      setDemoUser(updates);
      const updated = await apiUpdateUserProfile(updates);
      setUser((prev) => ({ ...prev, ...updated }));
      return updated;
    }
    if (firebaseUser) {
      await firebaseUpdateProfile(firebaseUser, {
        displayName: updates.displayName || firebaseUser.displayName,
        photoURL: updates.photoURL || firebaseUser.photoURL,
      });
    }
    const updated = await apiUpdateUserProfile(updates);
    setUser((prev) => ({ ...prev, ...updated }));
    return updated;
  };

  const value = {
    user,
    firebaseUser,
    token,
    loading,
    login,
    register,
    googleLogin,
    logout,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
