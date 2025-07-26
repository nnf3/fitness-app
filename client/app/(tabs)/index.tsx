import { Text, View, Button, StyleSheet } from "react-native";
import { useAuth } from "../../hooks";
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#1C1C1E',
  },
  welcomeText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#1C1C1E',
  },
  buttonContainer: {
    marginVertical: 8,
  },
  userInfo: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default function HomeTab() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  // ログアウト時にログイン画面に遷移
  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (!user) {
    return null; // ログイン画面に遷移中
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ホーム</Text>

      <View style={styles.userInfo}>
        <Text style={styles.welcomeText}>ようこそ！</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="ログアウト" onPress={handleSignOut} />
      </View>
    </View>
  );
}