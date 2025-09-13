// ProgressCard.tsx
import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { I18nManager, StyleSheet, Text, View } from "react-native";

import { useFont } from "@/hooks/useFont";
import { useTokens } from "@/hooks/useTokens";
import { getArabicNumber } from "@/utils/convetions";

type ProgressCardProps = {
  /** progress: 0..1 */
  progress: number;
  /** الأيام المتبقية */
  remainingDays: number;
  /** نص العنوان (افتراضي حسب طلبك) */
  title?: string; // "االتقدم"
  /** نص العنوان الفرعي (افتراضي حسب طلبك) */
  subtitle?: string; // "تقدم ربع الحزب"
};

const clamp = (v: number, min = 0, max = 1) => Math.max(min, Math.min(max, v));

const ProgressCard: React.FC<ProgressCardProps> = ({
  progress,
  remainingDays,
  title = "التقدم",
  subtitle = "نوع الورد (ربع حزب، حزب)",
}) => {
  const colors = useTokens();
  const { fontFamily, boldFontFamily } = useFont();

  const p = clamp(progress);
  const pct = Math.round(p * 100);

  const arabicPct = useMemo(() => getArabicNumber(pct), [pct]);
  const arabicDays = useMemo(
    () => getArabicNumber(remainingDays),
    [remainingDays]
  );

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
      accessible
      accessibilityLabel={`العنوان ${title}، النسبة ${pct}٪، الأيام المتبقية ${remainingDays}`}
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
        <Text style={[styles.subtitle, { color: colors.subText, fontFamily }]}>
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
            color={colors.tint}
            style={{ marginLeft: 6 }}
          />
          <Text
            style={[
              styles.chipText,
              { color: colors.tint, fontFamily: boldFontFamily },
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
              backgroundColor: I18nManager.isRTL
                ? "transparent"
                : "transparent",
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
                // استخدم لون التينت إذا متاح (من ثيمك)، وإلا النص
                backgroundColor: (colors as any).tint ?? colors.text,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

/** small alpha helper for hex or rgba-ish */
function withAlpha(hexOrRgba: string, alpha: number) {
  // If rgba already, just return it (keep it simple)
  if (hexOrRgba.startsWith("rgb")) return hexOrRgba;
  // Expect #RRGGBB[AA] or #RRGGBB
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
  // Fallback
  return hexOrRgba;
}

const styles = StyleSheet.create({
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
    padding: 16, // tighter than before
  },
  header: {
    gap: 10,
  },
  title: {
    fontSize: 20, // bigger, clearer
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
    // textAlign: "center",
  },
  progressRow: {
    marginTop: 8,
    flexDirection: "column",
    alignItems: "stretch", // <-- stretch children to full width
    gap: 10,
  },
  percentPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    minWidth: 56,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  percentText: {
    fontSize: 16,
    textAlign: "left",
  },
  progressTrack: {
    width: "100%", // <-- give the track width
    height: 15,
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
});

export default ProgressCard;
