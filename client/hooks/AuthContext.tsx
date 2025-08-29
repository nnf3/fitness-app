import React, { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
  webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
  iosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
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

  // Firebase Authインスタンスを一度だけ作成
  const auth = useMemo(() => getAuth(), []);

  // トークンキャッシュ
  const tokenCache = useRef<{ token: string | null; expiresAt: number }>({
    token: null,
    expiresAt: 0,
  });

  // トークン自動更新のタイマー
  const tokenRefreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // トークンの自動更新を設定
  const setupTokenRefresh = (user: FirebaseAuthTypes.User) => {
    // 既存のタイマーをクリア
    if (tokenRefreshTimer.current) {
      clearTimeout(tokenRefreshTimer.current);
    }

    // 50分後にトークンを更新（Firebaseのデフォルト有効期限は1時間）
    tokenRefreshTimer.current = setTimeout(async () => {
      try {
        const token = await user.getIdToken(true);
        if (token) {
          const now = Date.now();
          tokenCache.current = {
            token,
            expiresAt: now + 55 * 60 * 1000, // 55分後に期限切れ
          };
          // 次の更新を設定
          setupTokenRefresh(user);
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
      }
    }, 50 * 60 * 1000); // 50分
  };

  // 認証状態の監視を最適化
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, (u: FirebaseAuthTypes.User | null) => {
      if (!isMounted) return;

      setUser(u);
      setLoading(false);
      if (u) {
        // ユーザーがログインした場合、トークンキャッシュをクリアして自動更新を設定
        tokenCache.current = { token: null, expiresAt: 0 };
        setupTokenRefresh(u);
      } else {
        // ログアウト時はキャッシュとタイマーをクリア
        tokenCache.current = { token: null, expiresAt: 0 };
        if (tokenRefreshTimer.current) {
          clearTimeout(tokenRefreshTimer.current);
          tokenRefreshTimer.current = null;
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
      // クリーンアップ時にタイマーをクリア
      if (tokenRefreshTimer.current) {
        clearTimeout(tokenRefreshTimer.current);
      }
    };
  }, [auth]);

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();
      const { data } = signInResult;
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
      await signOut(auth);
      // ログアウト時にトークンキャッシュとタイマーをクリア
      tokenCache.current = { token: null, expiresAt: 0 };
      if (tokenRefreshTimer.current) {
        clearTimeout(tokenRefreshTimer.current);
        tokenRefreshTimer.current = null;
      }
    } catch (e: any) {
      setError(e.message);
    }
  };

  const getIdToken = useCallback(async (): Promise<string | null> => {
    if (!user) {
      return null;
    }

    try {
      const now = Date.now();

      // キャッシュされたトークンが有効な場合はそれを返す
      if (tokenCache.current.token && now < tokenCache.current.expiresAt) {
        return tokenCache.current.token;
      }

      // トークンを取得（強制更新は行わない）
      const token = await user.getIdToken(false);

      if (token) {
        // トークンの有効期限を設定
        tokenCache.current = {
          token,
          expiresAt: now + 55 * 60 * 1000, // 55分後に期限切れ
        };
      }

      return token;
    } catch (e: any) {
      setError(e.message);
      // エラー時はキャッシュをクリア
      tokenCache.current = { token: null, expiresAt: 0 };
      return null;
    }
  }, [user]);

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