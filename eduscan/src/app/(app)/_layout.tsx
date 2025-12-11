import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ColorBlindModeProvider } from "@core/utils/ColorBlindModeContext";

const AppLayout = () => {
  return (
    <ColorBlindModeProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </ColorBlindModeProvider>
  );
};

export default AppLayout;
