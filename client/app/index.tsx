import { Text, View, Button, StyleSheet, TextInput } from "react-native";
import { useFirebaseAuth } from "../hooks";
import { useState } from "react";

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: { borderBottomWidth: 1, marginBottom: 12 },
  error: { color: "red", marginTop: 8 },
});

export default function Index() {
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
        <Text>こんにちは {user.email}</Text>
        <Button title="ログアウト" onPress={signOut} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="メールアドレス"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="パスワード"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <Button title="ログイン" onPress={() => signInWithEmail(email, password)} />
      <Button title="新規登録" onPress={() => signUpWithEmail(email, password)} />
      <Button title="Googleでログイン" onPress={signInWithGoogle} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}
