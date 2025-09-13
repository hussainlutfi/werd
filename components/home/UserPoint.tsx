// components/UserPoint.tsx
import { useTokens } from "@/hooks/useTokens";
import { getArabicNumber } from "@/utils/convetions";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type UserPointProps = {
  points?: number;
  isPointing?: boolean;
};

export const UserPoint: React.FC<UserPointProps> = ({
  points = 0,
  isPointing,
}) => {
  const colors = useTokens();
  const color = isPointing ? colors.pointsUp : colors.pointsDown; // Tailwind red-800 ≈ #991B1B
  const iconName = isPointing ? "trending-up" : "trending-down";

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color }]}>
        عدد النقاط: {getArabicNumber(points)}
      </Text>
      <Feather name={iconName as any} size={24} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // flex items-center
    alignItems: "center", // center vertically
    justifyContent: "center", // justify-center
    gap: 6, // space between icon and text (RN 0.71+)
  },
  text: {
    fontSize: 18, // md:text-lg ≈ 18px
    fontWeight: "500", // font-medium
    marginLeft: 6, // fallback if gap not supported
  },
});
