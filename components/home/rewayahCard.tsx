import { dummyRewayatControl } from "@/data/rewayah";
import { useFont } from "@/hooks/useFont";
import { useTokens } from "@/hooks/useTokens";
import Feather from "@expo/vector-icons/Feather";
import React, { useCallback, useMemo, useRef } from "react";
import {
  Alert,
  Animated,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = require("react-native").Dimensions.get("window");

export default function RewayahCard() {
  const content = useMemo(
    () => ({
      rawi: dummyRewayatControl.rewayah.rawi || "",
      rewayah:
        dummyRewayatControl.rewayah.rewayah ||
        "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
      recourse: dummyRewayatControl.rewayah.recourse || "الطلاق - آية 2",
    }),
    []
  );

  const copyedRewayah =
    content.rawi +
    "\n\n" +
    content.rewayah +
    "\n\n" +
    "📚" +
    content.recourse +
    "\n\n" +
    "ابني عادتك القرآنية 🌿" +
    "\n" +
    "werdq.com";

  const { boldFontFamily, mediumFontFamily } = useFont();
  const colors = useTokens();

  const pressScale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(pressScale, {
      toValue: 0.98,
      useNativeDriver: true,
      friction: 8,
      tension: 80,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(pressScale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 80,
    }).start();
  };

  // Minimal alert for error reporting instead of in-app toast
  const showError = (message: string) => Alert.alert("خطأ", message);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: copyedRewayah,
        title: "مشاركة الرواية",
      });
    } catch (e) {
      showError("تعذّرت المشاركة.");
    }
  }, [copyedRewayah]);

  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={{ alignSelf: "stretch" }}
    >
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: colors.cardBackground,
            shadowColor: colors.rewayahCardShadow,
            transform: [{ scale: pressScale }],
          },
        ]}
      >
        <Text
          style={[
            styles.rawi,
            { fontFamily: mediumFontFamily, color: colors.text },
          ]}
        >
          {content.rawi}
        </Text>

        <Text
          style={[
            styles.rewayah,
            { fontFamily: boldFontFamily, color: colors.rewayahText },
          ]}
        >
          {content.rewayah}
        </Text>

        <View style={styles.recourseRow}>
          <Text style={styles.bookIcon}>📚</Text>
          <Text
            style={[
              styles.recourse,
              { fontFamily: mediumFontFamily, color: colors.text },
            ]}
          >
            {content.recourse}
          </Text>
        </View>
        <Pressable
          onPress={handleShare}
          accessibilityRole="button"
          accessibilityLabel="مشاركة الرواية"
          hitSlop={10}
          style={{ position: "absolute", bottom: 16, left: 16 }}
        >
          <Feather name="share" size={18} color={colors.subText} />
        </Pressable>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    padding: 24,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    alignSelf: "center",
    marginTop: 24,
  },
  rawi: {
    color: "#000000",
    fontWeight: "500",
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
  },
  rewayah: {
    color: "#016630",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    marginVertical: 4,
    lineHeight: 24,
  },
  recourseRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  bookIcon: { fontSize: 20 },
  recourse: {
    color: "#000000",
    fontWeight: "500",
    fontSize: 14,
    textAlign: "center",
  },

  // removed modal and related styles
});
