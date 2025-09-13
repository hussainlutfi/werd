// PlanCard.tsx
import Feather from "@expo/vector-icons/Feather";
import React from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useFont } from "@/hooks/useFont";
import { useTokens } from "@/hooks/useTokens";
import { getArabicNumber } from "@/utils/convetions";

type PlanCardProps = {
  planType?: string; // e.g. "ربع حزب"
  planDays?: number; // e.g. 240
  onEdit?: () => void;
};

const PlanCard: React.FC<PlanCardProps> = ({
  planType = "ربع حزب",
  planDays = 240,
  onEdit,
}) => {
  const colors = useTokens();
  const { fontFamily, boldFontFamily } = useFont();

  return (
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
      <ImageBackground
        imageStyle={styles.heroImage}
        resizeMode="cover"
        source={require("../assets/images/quranRespect.png")} // keep filling the wrapper
        style={StyleSheet.absoluteFill} // pan + scale the actual bitmap
      >
        {/* Content */}
        <View style={styles.content}>
          <View
            style={{
              flexDirection: "row-reverse",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Text
              style={[
                styles.title,
                { color: colors.text, fontFamily: boldFontFamily },
              ]}
            >
              خطة القراءة
            </Text>

            {/* Edit Icon top-left */}
            <Pressable
              onPress={onEdit}
              accessibilityLabel="تعديل الخطة"
            >
              <Feather name="edit-2" size={20} color={colors.subText} />
            </Pressable>
          </View>

          <View
            style={{
              flexDirection: "row-reverse",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Text
              style={[styles.subtitle, { color: colors.subText, fontFamily: boldFontFamily }]}
            >
              {planType}
            </Text>

            <Text style={[styles.days, { color: colors.text, fontFamily: boldFontFamily }]}>
              {getArabicNumber(planDays)} يوم
            </Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 1,
    marginHorizontal: 10,
    marginVertical: 8,
    padding: 16,
    position: "relative",
    overflow: "hidden",
    height: 90,
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

export default PlanCard;
