import { Stack } from "expo-router";
import { apolloClient } from "../lib/apollo-client";
import { ApolloProvider } from "@apollo/client";

export default function RootLayout() {
  return (
    <ApolloProvider client={apolloClient}>
      <Stack />
    </ApolloProvider>
  );
}
