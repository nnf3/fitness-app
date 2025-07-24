import { Text, View, Button, StyleSheet, TextInput } from "react-native";
import { useFirebaseAuth } from "../../hooks";
import { useState } from "react";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: '#F2F2F7',
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  error: {
    color: "red",
    marginTop: 8,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#1C1C1E',
  },
  buttonContainer: {
    marginVertical: 8,
  },
  welcomeText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#1C1C1E',
  },
});

export default function HomeTab() {
  const {
    user,
    error,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
  } = useFirebaseAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>フィットネスアプリ</Text>
        <Text style={styles.welcomeText}>こんにちは {user.email}</Text>
        <View style={styles.buttonContainer}>
          <Button title="ログアウト" onPress={signOut} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>フィットネスアプリ</Text>
      <TextInput
        placeholder="メールアドレス"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="パスワード"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <View style={styles.buttonContainer}>
        <Button title="ログイン" onPress={() => signInWithEmail(email, password)} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="新規登録" onPress={() => signUpWithEmail(email, password)} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Googleでログイン" onPress={signInWithGoogle} />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}