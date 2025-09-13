// theme/AppThemeProvider.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Appearance, ColorSchemeName } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AppThemeCtx = {
  colorScheme: Exclude<ColorSchemeName, null>;
  setColorScheme: (s: "light" | "dark") => void;
  toggleColorScheme: () => void;
};

const ThemeCtx = createContext<AppThemeCtx | null>(null);
const KEY = "app-theme";

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const system = Appearance.getColorScheme() ?? "light";
  const [scheme, setScheme] = useState<"light" | "dark">(system);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(KEY);
      if (saved === "light" || saved === "dark") setScheme(saved);
    })();
  }, []);

  const setColorScheme = (s: "light" | "dark") => {
    setScheme(s);
    AsyncStorage.setItem(KEY, s).catch(() => {});
  };

  const toggleColorScheme = () =>
    setColorScheme(scheme === "dark" ? "light" : "dark");

  const value = useMemo<AppThemeCtx>(
    () => ({ colorScheme: scheme, setColorScheme, toggleColorScheme }),
    [scheme]
  );

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useAppTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useAppTheme must be used within AppThemeProvider");
  return ctx;
}
