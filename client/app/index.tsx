import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../hooks";
import { View, ActivityIndicator, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#F2F2F7',
  },
});

export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/(tabs)");
      } else {
        router.replace("/login");
      }
    }
  }, [user, loading, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}