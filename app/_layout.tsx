// app/_layout.tsx
import { AppThemeProvider, useAppTheme } from "@/hooks/theme/AppThemeProvider";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

function RootStack() {
  // get current scheme from our app theme
  const { colorScheme } = useAppTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="splash-screen" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [loaded] = useFonts({
    TajawalRegular: require("../assets/fonts/Tajawal-Regular.ttf"),
    TajawalBold: require("../assets/fonts/Tajawal-Bold.ttf"),
    TajawalMedium: require("../assets/fonts/Tajawal-Medium.ttf"),
    TajawalExtraBold: require("../assets/fonts/Tajawal-ExtraBold.ttf"),
    Hafs: require("../assets/fonts/Hafs.ttf"),
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

  // wrap the whole app once
  return (
    <AppThemeProvider>
      <RootStack />
    </AppThemeProvider>
  );
}
