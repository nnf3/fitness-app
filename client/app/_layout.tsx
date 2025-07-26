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
        </Stack>
      </ApolloWrapper>
    </AuthProvider>
  );
}
