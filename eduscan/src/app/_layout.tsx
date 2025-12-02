import AuthProvider from "@functional/auth/AuthProvider";
import useAuth from "@functional/auth/useAuth";
import { ThemeProvider } from "@react-navigation/native";
import { DefaultScreenOptions, Fonts, Theme } from "@style/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const loaded = true;

  // Expo boilerplate code
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}

const client = new QueryClient();

const AuthGate = () => {
  const { isLoggedIn } = useAuth();
  return (
    <ThemeProvider value={Theme}>
      <QueryClientProvider client={client}>
        <Stack screenOptions={{ ...DefaultScreenOptions, headerShown: false }}>
          <Stack.Protected guard={!isLoggedIn}>
            <Stack.Screen name="(auth)" />
          </Stack.Protected>

          <Stack.Protected guard={isLoggedIn}>
            <Stack.Screen name="(app)" />
          </Stack.Protected>
        </Stack>
      </QueryClientProvider>
    </ThemeProvider>
  );
};
