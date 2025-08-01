import { Stack } from "expo-router";
import { AuthProvider } from "../hooks";
import { ApolloWrapper } from "../lib";
import { ThemeProvider, useTheme } from "../theme";

function StackNavigator() {
  const { theme } = useTheme();

  return (
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
          title: "プロフィール編集",
          headerBackTitle: "設定",
          gestureEnabled: true,
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTitleStyle: {
            color: theme.text,
            fontWeight: 'bold',
          },
          headerTintColor: theme.text,
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ApolloWrapper>
          <StackNavigator />
        </ApolloWrapper>
      </AuthProvider>
    </ThemeProvider>
  );
}
