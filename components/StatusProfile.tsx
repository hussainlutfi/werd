// PlanCard.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { dummyUserSession } from "@/data/user";
import { useFont } from "@/hooks/useFont";
import { useTokens } from "@/hooks/useTokens";
import { getArabicNumber } from "@/utils/convetions";
import { Feather } from "@expo/vector-icons";

type StatusProfileProps = {
  planType?: string; // e.g. "ربع حزب"
  planDays?: number; // e.g. 240
  onEdit?: () => void;
};

const StatusProfile: React.FC<StatusProfileProps> = ({
  planType = "ربع حزب",
  planDays = 240,
  onEdit,
}) => {
  const colors = useTokens();
  const { fontFamily, boldFontFamily } = useFont();
  const isPointing = dummyUserSession.isPoniting;
  const color = isPointing ? colors.pointsUp : colors.pointsDown; // Tailwind red-800 ≈ #991B1B
  const iconName = isPointing ? "trending-up" : "trending-down";

  return (
    <View style={{ flexDirection: "row-reverse", gap: 1, width: "100%" }}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.cardBorder,
            shadowColor: colors.rewayahCardShadow,
          },
        ]}
      >
        <View
          style={{
            flexDirection: "column",
            alignItems: "center", // RTL: align text to the right
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: boldFontFamily,
              fontSize: 20,
              color: colors.text,
            }}
          >
            {getArabicNumber(5)}
          </Text>
          <Text style={{ fontSize: 16, fontFamily }}>
            <Text style={{ fontSize: 24 }}>🔥</Text>
            يوم
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.cardBorder,
            shadowColor: colors.rewayahCardShadow,
          },
        ]}
      >
        <View
          style={{
            gap: 10,
            flexDirection: "column",
            alignItems: "center", // RTL: align text to the right
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: boldFontFamily,
              fontSize: 20,
              color: colors.text,
            }}
          >
            {getArabicNumber(5)}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Text style={{ fontSize: 16, fontFamily }}>نقطة</Text>
            <Feather name={iconName as any} size={24} color={color} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 1,
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 1,
    marginHorizontal: 10,
    marginVertical: 8,
    position: "relative",
    overflow: "hidden",
    height: 80,
    width: "45%",
  },

  content: {
    padding: 16,
    gap: 20,
    alignItems: "flex-end", // RTL: align text to the right
  },
  title: {
    fontSize: 20,
    textAlign: "right",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "right",
  },
  days: {
    fontSize: 16,
    textAlign: "right",
  },
  heroImage: {
    opacity: 0.15,
    transform: [
      { scale: 1.5 }, // oversize so you have room to pan
      { translateX: -50 }, // move the image to the LEFT by 50px
    ],
    // remove alignSelf/right/left — they affect layout, not pan
  },
});

export default StatusProfile;
