import { Text, View, Button, StyleSheet } from "react-native";
import { useAuth } from "../hooks";
import { useRouter } from "expo-router";
import { useEffect } from "react";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: '#F2F2F7',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#1C1C1E',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
    lineHeight: 24,
  },
  buttonContainer: {
    marginVertical: 8,
  },
  error: {
    color: "red",
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
        <Button
          title={loading ? "ログイン中..." : "Googleでログイン"}
          onPress={handleGoogleSignIn}
          disabled={loading}
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}