// components/StrikeCard.tsx
import { useFont } from "@/hooks/useFont";
import { useTokens } from "@/hooks/useTokens";
import { getArabicNumber } from "@/utils/convetions";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  I18nManager,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

type StrikeCardProps = {
  strike: number;
};

export const StrikeCard: React.FC<StrikeCardProps> = ({ strike }) => {
  const translateY = useRef(new Animated.Value(16)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const colors = useTokens();
  const { fontFamily, boldFontFamily } = useFont();

  useEffect(() => {
    const delay = 200; // ms
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  if (!strike) return null;

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        {/* Floating 🔥 */}
        <View style={styles.flame}>
          <Text style={styles.flameText}>🔥</Text>
        </View>

        {/* Main Card */}
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ translateY }],
              opacity,
              backgroundColor: colors.cardBackground,
            },
            Platform.select({
              ios: {
                shadowColor: colors.rewayahCardShadow ?? "#000",
                shadowOpacity: 0.08, // tweak to taste
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
              },
              android: {
                // On Android, elevation drives the shadow.
                elevation: 3,
              },
              default: {},
            }),
          ]}
        >
          <View style={styles.textContainer}>
            <Text style={[styles.subtitle, { fontFamily: fontFamily, color: colors.subText }]}>
              القراءات المتتابعة
            </Text>
            <Text
              style={[
                styles.title,
                { color: colors.text, fontFamily: boldFontFamily },
              ]}
            >
              {getArabicNumber(strike)} أيام
            </Text>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // flex w-fit justify-center relative
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  wrapper: {
    justifyContent: "center",
    position: "relative",
  },

  // absolute -bottom-4 -left-4 text-5xl
  flame: {
    position: "absolute",
    zIndex: 1,
    bottom: -6, // -bottom-4
    left: -18, // -left-4
  },
  flameText: {
    fontSize: 40, // text-5xl ≈ 40px
    lineHeight: 44,
  },

  // flex w-fit items-center gap-3 bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24, // px-6
    paddingVertical: 16, // py-4
    borderRadius: 12, // rounded-xl
    // borderWidth: 1,
    // borderColor: "#F3F4F6", // border-gray-100
  },

  // text-center
  textContainer: {
    alignItems: "center",
    writingDirection: I18nManager.isRTL ? "rtl" : "ltr",
  },

  // text-sm text-gray-500 mb-1
  subtitle: {
    fontSize: 14,
    marginBottom: 4,
    textAlign: "center",
  },

  // text-xl font-bold text-gray-900
  title: {
    fontSize: 20,
    paddingVertical: 5,
    color: "#111827",
    textAlign: "center",
  },
});
