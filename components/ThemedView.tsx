import { View, type ViewProps } from "react-native";

import { useTokens } from "@/constants/Colors";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const colors = useTokens();

  const backgroundColor = colors.background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
