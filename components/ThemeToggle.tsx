// components/ThemeToggle.tsx
import { useTokens } from "@/constants/Colors";
import { useAppTheme } from "@/hooks/theme/AppThemeProvider";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";

export function ThemeToggle({ style }: { style?: ViewStyle }) {
  const { colorScheme, toggleColorScheme } = useAppTheme();
  const isDark = colorScheme === "dark";
  const colors = useTokens();

  return (
    <Pressable
      onPress={toggleColorScheme}
      style={({ pressed }) => [
        styles.btn,
        style,
        { opacity: pressed ? 0.7 : 1 },
      ]}
      hitSlop={10}
    >
      {isDark ? (
        // in dark mode, show "light-up" to hint switching to light
        <Entypo name="light-up" size={32} color={colors.subText} />
      ) : (
        // in light mode, show "dark-mode" to hint switching to dark
        <MaterialIcons name="dark-mode" size={32} color={colors.subText} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    padding: 6,
    borderRadius: 10,
  },
});
