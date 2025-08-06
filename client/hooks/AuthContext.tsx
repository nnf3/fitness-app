import React, { createContext, useContext, useState, useEffect } from 'react';
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  getAuth,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "@react-native-firebase/auth";
import type { FirebaseAuthTypes } from "@react-native-firebase/auth";

// Google Sign-In設定
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
});

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  error: string;
  signInWithGoogle: () => Promise<string | undefined>;
  signInWithEmail: (email: string, password: string) => Promise<string | undefined>;
  signUpWithEmail: (email: string, password: string) => Promise<string | undefined>;
  signOut: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (u: FirebaseAuthTypes.User | null) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();
      const { data } = signInResult;
      const auth = getAuth();
      const googleCredential = GoogleAuthProvider.credential(data?.idToken ?? "");
      const userCredential = await signInWithCredential(auth, googleCredential);
      const firebaseIdToken = await userCredential.user.getIdToken(true);
      setError("");
      return firebaseIdToken;
    } catch (e: any) {
      setError(e.message);
      return undefined;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseIdToken = await userCredential.user.getIdToken(true);
      setError("");
      return firebaseIdToken;
    } catch (e: any) {
      setError(e.message);
      return undefined;
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseIdToken = await userCredential.user.getIdToken(true);
      setError("");
      return firebaseIdToken;
    } catch (e: any) {
      setError(e.message);
      return undefined;
    }
  };

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const getIdToken = async (): Promise<string | null> => {
    if (user) {
      try {
        return await user.getIdToken();
      } catch (e: any) {
        setError(e.message);
        return null;
      }
    }
    return null;
  };

  const value = {
    user,
    loading,
    error,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut: handleSignOut,
    getIdToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};