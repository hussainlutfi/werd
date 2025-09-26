// ProgressCard.tsx
import { dummyUserSession } from "@/data/user";
import { useAppTheme } from "@/hooks/theme/AppThemeProvider";
import { useFont } from "@/hooks/useFont";
import { useTokens } from "@/hooks/useTokens";
import { getArabicNumber } from "@/utils/convetions";
import {
  getWerdName,
  getWerdStartPoint,
  getWerdTotalDays,
} from "@/utils/werdApi";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  I18nManager,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type ProgressCardProps = {
  /** progress: 0..1 */
  progress: number;
  /** الأيام المتبقية */
  remainingDays: number;
  /** نص العنوان (افتراضي حسب طلبك) */
  title?: string; // "التقدم"
  /** نص العنوان الفرعي (افتراضي حسب طلبك) */
  subtitle?: string; // "نوع الورد (ربع حزب، حزب)"
};

const { width } = require("react-native").Dimensions.get("window");
const clamp = (v: number, min = 0, max = 1) => Math.max(min, Math.min(max, v));

const ProgressCard: React.FC<ProgressCardProps> = ({
  progress,
  remainingDays,
  title = "التقدم",
  subtitle = "نوع الورد (ربع حزب، حزب)",
}) => {
  const colors = useTokens();
  const { fontFamily, boldFontFamily } = useFont();

  const { colorScheme } = useAppTheme();
  const scheme = colorScheme === "dark" ? "dark" : "light";

  // ---- values
  const p = clamp(progress);
  const pct = Math.round(p * 100);
  const arabicPct = useMemo(() => getArabicNumber(pct), [pct]);
  const arabicDays = useMemo(
    () => getArabicNumber(remainingDays),
    [remainingDays]
  );

  // ---- press-scale for main card
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

  // ---- dialog animation state (same strategy/timings as RewayahCard)
  const [visible, setVisible] = useState(false);
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const dialogScale = useRef(new Animated.Value(0.92)).current;
  const [isMomentum, setIsMomentum] = useState(false);

  const openDialog = () => {
    setVisible(true);
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0.6, // white @ 0.6 (your previous note said 0.3 white; visually similar on themed bg)
        duration: 350,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(dialogScale, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  };

  const closeDialog = () => {
    // Close instantly without animation
    backdropOpacity.setValue(0);
    dialogScale.setValue(0.92); // reset for next open
    setVisible(false);
  };

  // Generate quarters grid (1-240)
  const generateQuartersGrid = () => {
    const quarters = [];
    const quantity = dummyUserSession.khatmah?.typeQuantity || 1;
    const type = dummyUserSession.khatmah?.khatmahType || "PAGE";

    for (let i = 1; i <= getWerdTotalDays({ quantity, type }); i++) {
      const quarter = dummyUserSession.khatmah?.quarters
        ? dummyUserSession.khatmah.quarters[i]
        : undefined;
      let status: "waiting" | "inProgress" | "completed" = "waiting";
      let color = colors.progressYellow;

      if (quarter) {
        if (quarter.isDone) {
          status = "completed";
          color = colors.progressGreen;
        } else {
          status = "inProgress";
          color = colors.progressRed;
        }
      }

      quarters.push(
        <View
          key={i}
          style={{
            width: "100%" /* full width for single column */,
            height: 30,
            backgroundColor: color,
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          // onClick={(e) => handleBoxClick(e, label)}
        >
          <Text
            style={{
              fontSize: 12,
              fontFamily: boldFontFamily,
              color: colors.text,
            }}
          >
            {(quarter ? (quarter.isDone ? "✅ " : "❌ ") : "🕘 ") +
              getWerdName({
                startPoint: getWerdStartPoint({
                  startPoint: i,
                  quantity,
                  type,
                }),
                type,
              })}
          </Text>
        </View>
      );
    }

    return quarters;
  };

  return (
    // Outer pressable lets the user tap outside to close if needed (mirrors your RewayahCard composition)
    <Pressable onPress={closeDialog}>
      <Pressable
        onPress={openDialog}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={{ alignSelf: "stretch" }}
        accessible
        accessibilityRole="button"
        accessibilityLabel={`العنوان ${title}، النسبة ${pct}٪، الأيام المتبقية ${remainingDays}. انقر لعرض التفاصيل`}
      >
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.cardBorder,
              shadowColor: colors.rewayahCardShadow,
              transform: [{ scale: pressScale }],
            },
          ]}
        >
          {/* Header: Title + subtitle */}
          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                { color: colors.text, fontFamily: boldFontFamily },
              ]}
            >
              {title}
            </Text>
            <Text
              style={[styles.subtitle, { color: colors.subText, fontFamily }]}
            >
              {subtitle}
            </Text>
          </View>

          {/* Chip: Remaining days */}
          <View style={[styles.row, { marginTop: 2 }]}>
            <View
              style={[
                styles.chip,
                {
                  borderColor: colors.cardBorder,
                },
              ]}
            >
              <MaterialIcons
                name="event"
                size={14}
                color={(colors as any).tint ?? colors.text}
                style={{ marginLeft: 6 }}
              />
              <Text
                style={[
                  styles.chipText,
                  {
                    color: (colors as any).tint ?? colors.text,
                    fontFamily: boldFontFamily,
                  },
                ]}
              >
                الأيام المتبقية: {arabicDays}
              </Text>
            </View>
          </View>

          {/* Progress + percent */}
          <View style={styles.progressRow}>
            <View
              style={[
                styles.percentPill,
                {
                  borderColor: colors.cardBorder,
                  backgroundColor: "transparent",
                },
              ]}
            >
              <Text
                style={[
                  styles.percentText,
                  { color: colors.text, fontFamily: boldFontFamily },
                ]}
              >
                {arabicPct}٪
              </Text>
            </View>

            <View
              style={[
                styles.progressTrack,
                { backgroundColor: withAlpha(colors.cardBorder, 0.5) },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${pct}%`,
                    backgroundColor: (colors as any).tint ?? colors.text,
                  },
                ]}
              />
            </View>
          </View>
        </Animated.View>
      </Pressable>

      {/* Dialog */}
      <Modal
        visible={visible}
        transparent
        statusBarTranslucent
        animationType="none"
        onRequestClose={closeDialog}
      >
        {/* White semi-transparent backdrop */}
        <Pressable style={StyleSheet.absoluteFill} onPress={closeDialog}>
          <Animated.View
            style={[
              styles.backdrop,
              {
                backgroundColor: colors.fadedBackground,
                opacity: backdropOpacity,
              },
            ]}
          />
        </Pressable>

        <View style={styles.centerWrap} pointerEvents="box-none">
          <Animated.View
            style={[
              styles.dialogCard,
              {
                backgroundColor: colors.cardBackground,
                shadowColor: colors.rewayahCardShadow,
                transform: [{ scale: dialogScale }],
              },
            ]}
          >
            {/* Close button (ensures closing even during ScrollView momentum) */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="إغلاق"
              onPress={closeDialog}
              hitSlop={10}
              style={{ position: "absolute", top: 8, left: 8, padding: 6 }}
            >
              <MaterialIcons name="close" size={22} color={colors.subText} />
            </Pressable>

            {/* Expanded header */}
            <Text
              style={[
                styles.titleExpanded,
                { fontFamily: boldFontFamily, color: colors.text },
              ]}
            >
              {title}
            </Text>
            <Text
              style={[
                styles.subtitleExpanded,
                { fontFamily, color: colors.subText },
              ]}
            >
              {subtitle}
            </Text>

            {/* Expanded percent large */}
            <View style={styles.percentLargeWrap}>
              <Text
                style={[
                  styles.daysLine,
                  {
                    fontFamily: boldFontFamily,
                    color: (colors as any).tint ?? colors.text,
                  },
                ]}
              >
                الأيام المتبقية: {arabicDays}
              </Text>
            </View>

            <View
              style={{
                padding: 10,
                marginTop: 20,
                backgroundColor:
                  scheme === "dark"
                    ? colors.background
                    : colors.tabIconDefault + "50",
                borderRadius: 12,
                height: 300,
              }}
            >
              <ScrollView
                horizontal={false}
                showsVerticalScrollIndicator={true}
                onMomentumScrollBegin={() => setIsMomentum(true)}
                onMomentumScrollEnd={() => setIsMomentum(false)}
                onScrollEndDrag={() => setIsMomentum(false)}
                contentContainerStyle={{
                  flexDirection: "column",
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  paddingBottom: 20,
                  gap: 12,
                }}
              >
                {generateQuartersGrid()}
              </ScrollView>
            </View>

            {/* Catch first tap during momentum to close instantly */}
            {isMomentum && (
              <Pressable
                onPress={closeDialog}
                style={StyleSheet.absoluteFill}
                hitSlop={0}
                pointerEvents="auto"
                accessibilityLabel="إغلاق"
                accessibilityRole="button"
              />
            )}
          </Animated.View>
        </View>
      </Modal>
    </Pressable>
  );
};

/** small alpha helper for hex or rgba-ish */
function withAlpha(hexOrRgba: string, alpha: number) {
  if (hexOrRgba.startsWith("rgb")) return hexOrRgba;
  const hex = hexOrRgba.replace("#", "");
  if (hex.length === 8) {
    return `#${hex.slice(0, 6)}${Math.round(alpha * 255)
      .toString(16)
      .padStart(2, "0")}`;
  }
  if (hex.length === 6) {
    return `#${hex}${Math.round(alpha * 255)
      .toString(16)
      .padStart(2, "0")}`;
  }
  return hexOrRgba;
}

const styles = StyleSheet.create({
  // ---- main card (kept from your original with slight tweaks)
  card: {
    borderRadius: 16,
    gap: 16,
    borderWidth: 1,
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 1,
    marginHorizontal: 10,
    marginVertical: 8,
    padding: 16,
    alignSelf: "stretch",
  },
  header: {
    gap: 10,
  },
  title: {
    fontSize: 20,
    textAlign: "right",
  },
  subtitle: {
    fontSize: 13,
    textAlign: "right",
  },
  row: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  chip: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
  },
  progressRow: {
    marginTop: 8,
    flexDirection: "column",
    alignItems: "stretch",
    gap: 10,
  },
  percentPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    // minWidth: 56,
    alignItems: I18nManager.isRTL ? "flex-end" : "flex-start",
    justifyContent: "center",
  },
  percentText: {
    fontSize: 16,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  progressTrack: {
    width: "100%",
    height: 15,
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },

  // ---- dialog/backdrop (same structure/timings as RewayahCard)
  backdrop: { flex: 1 },
  centerWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  dialogCard: {
    maxWidth: Math.min(600, width * 0.95),
    width: width * 0.92,
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 22,
    elevation: 10,
  },

  // ---- expanded content
  titleExpanded: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 4,
  },
  subtitleExpanded: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 6,
  },
  percentLargeWrap: {
    marginTop: 14,
    alignItems: "center",
    gap: 6,
  },
  percentLarge: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 36,
  },
  daysLine: {
    fontSize: 16,
    textAlign: "center",
  },
  progressTrackExpanded: {
    marginTop: 14,
    width: "100%",
    height: 18,
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFillExpanded: {
    height: "100%",
    borderRadius: 999,
  },
});

export default ProgressCard;
