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
import { CustomerInfo, PurchasesOffering } from 'react-native-purchases';
import {
  configureRevenueCat,
  logInUser,
  logOutUser,
  getCustomerInfo,
  getOfferings,
  checkEntitlement,
  getSubscriptionStatus
} from '../lib/revenuecat';

// Google Sign-In設定
GoogleSignin.configure({
  webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
  iosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
});

interface AuthContextType {
  // Firebase Auth関連
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  error: string;
  signInWithGoogle: () => Promise<string | undefined>;
  signInWithEmail: (email: string, password: string) => Promise<string | undefined>;
  signUpWithEmail: (email: string, password: string) => Promise<string | undefined>;
  signOut: () => Promise<void>;
  getIdToken: () => Promise<string | null>;

  // RevenueCat関連
  customerInfo: CustomerInfo | null;
  offerings: PurchasesOffering[];
  revenueCatLoading: boolean;
  revenueCatError: string | null;
  refreshCustomerInfo: () => Promise<void>;
  refreshOfferings: () => Promise<void>;
  isEntitled: (entitlementId: string) => boolean;
  getSubscriptionInfo: (entitlementId: string) => {
    isActive: boolean;
    willRenew: boolean;
    periodType: string | null;
    expirationDate: string | null;
  };
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
  // Firebase Auth状態
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // RevenueCat状態
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [offerings, setOfferings] = useState<PurchasesOffering[]>([]);
  const [revenueCatLoading, setRevenueCatLoading] = useState(true);
  const [revenueCatError, setRevenueCatError] = useState<string | null>(null);

  // Firebase Authインスタンスを一度だけ作成
  const auth = useMemo(() => getAuth(), []);

  // トークンキャッシュ
  const tokenCache = useRef<{ token: string | null; expiresAt: number }>({
    token: null,
    expiresAt: 0,
  });

  // トークン自動更新のタイマー
  const tokenRefreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // RevenueCatの初期化
  useEffect(() => {
    const initializeRevenueCat = async () => {
      try {
        setRevenueCatLoading(true);
        setRevenueCatError(null);

        await configureRevenueCat();
        await refreshOfferings();

      } catch (err) {
        console.error('RevenueCat initialization failed:', err);
        setRevenueCatError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setRevenueCatLoading(false);
      }
    };

    initializeRevenueCat();
  }, []);

  // RevenueCatの顧客情報を更新
  const refreshCustomerInfo = async () => {
    try {
      const info = await getCustomerInfo();
      setCustomerInfo(info);
    } catch (err) {
      console.error('Failed to refresh customer info:', err);
      setRevenueCatError(err instanceof Error ? err.message : 'Failed to refresh customer info');
    }
  };

  // RevenueCatのオファリングを更新
  const refreshOfferings = async () => {
    try {
      const offeringsData = await getOfferings();
      setOfferings(offeringsData);
    } catch (err) {
      console.error('Failed to refresh offerings:', err);
      setRevenueCatError(err instanceof Error ? err.message : 'Failed to refresh offerings');
    }
  };

  // エンタイトルメントの確認
  const isEntitled = (entitlementId: string): boolean => {
    if (!customerInfo) return false;
    return checkEntitlement(customerInfo, entitlementId);
  };

  // サブスクリプション情報の取得
  const getSubscriptionInfo = (entitlementId: string) => {
    if (!customerInfo) {
      return {
        isActive: false,
        willRenew: false,
        periodType: null,
        expirationDate: null,
      };
    }
    return getSubscriptionStatus(customerInfo, entitlementId);
  };

  // トークンの自動更新を設定
  const setupTokenRefresh = useCallback((user: FirebaseAuthTypes.User) => {
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
  }, []);

  // 認証状態の監視（RevenueCatとの同期を含む）
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (u: FirebaseAuthTypes.User | null) => {
      if (!isMounted) return;

      setUser(u);
      setLoading(false);

      if (u) {
        // ユーザーがログインした場合
        tokenCache.current = { token: null, expiresAt: 0 };
        setupTokenRefresh(u);

        // RevenueCatにログイン
        try {
          const customerInfo = await logInUser(u.uid);
          setCustomerInfo(customerInfo);
        } catch (err) {
          console.error('Failed to log in user to RevenueCat:', err);
          setRevenueCatError(err instanceof Error ? err.message : 'Failed to log in user');
        }
      } else {
        // ログアウト時
        tokenCache.current = { token: null, expiresAt: 0 };
        if (tokenRefreshTimer.current) {
          clearTimeout(tokenRefreshTimer.current);
          tokenRefreshTimer.current = null;
        }

        // RevenueCatからログアウト
        try {
          const customerInfo = await logOutUser();
          setCustomerInfo(customerInfo);
        } catch (err) {
          console.error('Failed to log out user from RevenueCat:', err);
          setRevenueCatError(err instanceof Error ? err.message : 'Failed to log out user');
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
      if (tokenRefreshTimer.current) {
        clearTimeout(tokenRefreshTimer.current);
      }
    };
  }, [auth, setupTokenRefresh]);

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
    // Firebase Auth関連
    user,
    loading,
    error,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut: handleSignOut,
    getIdToken,

    // RevenueCat関連
    customerInfo,
    offerings,
    revenueCatLoading,
    revenueCatError,
    refreshCustomerInfo,
    refreshOfferings,
    isEntitled,
    getSubscriptionInfo,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};