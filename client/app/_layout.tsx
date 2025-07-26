import { Stack } from "expo-router";
import { createApolloClient } from "../lib/apollo-client";
import { ApolloProvider } from "@apollo/client";
import { AuthProvider } from "../hooks";

export default function RootLayout() {
  const client = createApolloClient(async () => null)

  return (
    <AuthProvider>
      <ApolloProvider client={client}>
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
      </ApolloProvider>
    </AuthProvider>
  );
}
