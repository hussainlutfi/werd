// hooks/useTokens.ts
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "./theme/AppThemeProvider";

export function useTokens() {
  const { colorScheme } = useAppTheme();

  const scheme = colorScheme === "dark" ? "dark" : "light";
  return Colors[scheme]; // returns the whole palette
}
