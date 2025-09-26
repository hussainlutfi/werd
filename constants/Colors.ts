/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */
import { useAppTheme } from "@/hooks/theme/AppThemeProvider";

const tintColorLight = "#016630";
const tintColorDark = "#028e43ff";

export const Colors = {
  light: {
    text: "#11181C",
    subText: "#3b3b3bff",
    cardBorder: "#3b3b3b2c",
    background: "#f9fafb",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    cardBackground: "#ffffff",
    rewayahText: tintColorLight,
    rewayahCardShadow: "#000000",
    pointsUp: tintColorLight,
    pointsDown: "#991B1B",
    gold: "#FFD700",
    silver: "#a1a1a1ff",
    bronze: "#CD7F32",
    avatarBackground: "#ecfbf3ff",
    fadedBackground: "#151718",
    progressRed: "#fecaca",
    progressYellow: "#fef3c7",
    progressGreen: "#dcfce7",
  },
  dark: {
    text: "#ECEDEE",
    subText: "#a7a7a7ff",
    cardBorder: "#a7a7a72c",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#d6d8d6ff",
    tabIconSelected: tintColorDark,
    cardBackground: "#292b2dff",
    rewayahText: tintColorDark,
    rewayahCardShadow: "#b6b6b6ff",
    pointsUp: tintColorDark,
    pointsDown: "#d23131ff",
    gold: "#FFD700",
    silver: "#C0C0C0",
    bronze: "#CD7F32",
    avatarBackground: "#017236ff",
    fadedBackground: "#f9fafb",
    progressRed: "#7f1d1d",
    progressYellow: "#9c8400ff",
    progressGreen: "#14532d",
  },
};

export function useTokens() {
  const { colorScheme } = useAppTheme(); // ✅ uses your context
  return colorScheme === "dark" ? Colors.dark : Colors.light;
}

export type Tokens = typeof Colors.light;
