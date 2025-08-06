import { Text, View, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import { useAuth } from "../../hooks";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { GoogleIcon } from "../ui";
import { useTheme } from "../../theme";

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: theme.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: theme.text,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    color: theme.textSecondary,
    opacity: 0.8,
    lineHeight: 24,
  },
  formContainer: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: theme.surface,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: theme.border,
    color: theme.text,
  },
  inputPlaceholder: {
    color: theme.textTertiary,
  },
  buttonContainer: {
    marginVertical: 8,
  },
  button: {
    backgroundColor: theme.surface,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: theme.border,
  },
  buttonText: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  buttonDisabled: {
    backgroundColor: theme.surfaceVariant,
    opacity: 0.6,
  },
  emailButton: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  emailButtonText: {
    color: '#FFFFFF',
    marginLeft: 0,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.divider,
  },
  dividerText: {
    marginHorizontal: 16,
    color: theme.textSecondary,
    fontSize: 14,
  },
  error: {
    color: theme.error,
    marginTop: 16,
    textAlign: 'center',
    fontSize: 14,
  },
  logo: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 20,
  },
  switchModeText: {
    textAlign: 'center',
    marginTop: 16,
    color: theme.secondary,
    fontSize: 14,
  },
});

export function LoginForm() {
  const { user, error, signInWithGoogle, signInWithEmail, signUpWithEmail, loading } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  // ログイン成功時にホーム画面に遷移
  useEffect(() => {
    if (user) {
      router.replace("/(tabs)");
    }
  }, [user, router]);

  const styles = createStyles(theme);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google sign in error:", error);
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert("エラー", "メールアドレスとパスワードを入力してください");
      return;
    }

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (error) {
      console.error("Email auth error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>💪</Text>
      <Text style={styles.title}>Workout Bro.</Text>
      <Text style={styles.subtitle}>
        最高な仲間たちと一緒にワークアウトを楽しもう
      </Text>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="メールアドレス"
          placeholderTextColor={styles.inputPlaceholder.color}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="パスワード"
          placeholderTextColor={styles.inputPlaceholder.color}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={[styles.button, styles.emailButton, loading && styles.buttonDisabled]}
          onPress={handleEmailAuth}
          disabled={loading}
        >
          <Text style={[styles.buttonText, styles.emailButtonText]}>
            {loading ? "処理中..." : (isSignUp ? "アカウント作成" : "ログイン")}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>または</Text>
        <View style={styles.dividerLine} />
      </View>

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

      <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
        <Text style={styles.switchModeText}>
          {isSignUp ? "すでにアカウントをお持ちの方はこちら" : "アカウントをお持ちでない方はこちら"}
        </Text>
      </TouchableOpacity>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}