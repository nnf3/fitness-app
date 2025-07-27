import { Stack } from "expo-router";
import { AuthProvider } from "../hooks";
import { ApolloWrapper } from "../lib";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ApolloWrapper>
        <Stack>
          <Stack.Screen
            name="login"
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="profile-edit"
            options={{
              headerShown: true,
              title: "設定",
              headerBackTitle: "設定",
              gestureEnabled: true,
            }}
          />
        </Stack>
      </ApolloWrapper>
    </AuthProvider>
  );
}
