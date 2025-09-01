import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [ready, setReady] = useState(false);

  const [loaded] = useFonts({
    TajawalRegular: require("../assets/fonts/Tajawal-Regular.ttf"),
    TajawalBold: require("../assets/fonts/Tajawal-Bold.ttf"),
    TajawalMedium: require("../assets/fonts/Tajawal-Medium.ttf"),
    TajawalExtraBold: require("../assets/fonts/Tajawal-ExtraBold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      setReady(true);
    }
  }, [loaded]);

  if (!ready) {
    return <View style={{ flex: 1, backgroundColor: "#2E86C1" }} />;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
    {/* <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}> */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="splash-screen" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
