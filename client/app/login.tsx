import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../hooks";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import GoogleIcon from "../components/GoogleIcon";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: '#1B4332',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    color: '#FFFFFF',
    opacity: 0.8,
    lineHeight: 24,
  },
  buttonContainer: {
    marginVertical: 8,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#1C1C1E',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  buttonDisabled: {
    backgroundColor: '#F5F5F5',
    opacity: 0.6,
  },
  error: {
    color: '#FF6B6B',
    marginTop: 16,
    textAlign: 'center',
    fontSize: 14,
  },
  logo: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default function LoginScreen() {
  const { user, error, signInWithGoogle, loading } = useAuth();
  const router = useRouter();

  // ログイン成功時にホーム画面に遷移
  useEffect(() => {
    if (user) {
      router.replace("/(tabs)");
    }
  }, [user, router]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google sign in error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>💪</Text>
      <Text style={styles.title}>フィットネスアプリ</Text>
      <Text style={styles.subtitle}>
        あなたのフィットネスライフをサポートします
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleGoogleSignIn}
          disabled={loading}
        >
          <GoogleIcon size={36} />
          <Text style={styles.buttonText}>
            {loading ? "ログイン中..." : "Googleでログイン"}
          </Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}