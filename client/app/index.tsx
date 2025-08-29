import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../hooks";
import { LoadingState } from "../components/ui";

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
    <LoadingState title="読み込み中..." />
  );
}