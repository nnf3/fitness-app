import { Stack } from "expo-router";
import { AuthProvider } from "../hooks";
import { ApolloWrapper, AdMobProvider } from "../lib";
import { ThemeProvider, useTheme } from "../theme";

function StackNavigator() {
  const { theme } = useTheme();

  return (
    <Stack>
      <Stack.Screen
        name="(auth)/login"
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
        name="(profile)/profile-edit"
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
      <Stack.Screen
        name="workout-form"
        options={{
          headerShown: true,
          title: "記録追加",
          headerBackTitle: "筋トレ",
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
          <AdMobProvider>
            <StackNavigator />
          </AdMobProvider>
        </ApolloWrapper>
      </AuthProvider>
    </ThemeProvider>
  );
}
