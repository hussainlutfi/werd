import { useFont } from "@/hooks/useFont";
import { useTokens } from "@/hooks/useTokens";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

export enum MainWerdType {
  START = "من",
  END = "إلى",
}

interface MainWerdProps {
  type: MainWerdType;
  ayah: string;
  surah: string;
  ayahNumber: string;
  page: string;
}

export default function WerdCard({
  type,
  ayah,
  surah,
  ayahNumber,
  page,
}: MainWerdProps) {
  const { fontFamily, boldFontFamily, hafsFontFamily } = useFont();
  const colors = useTokens();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBackground,
          shadowColor: colors.rewayahCardShadow,
        },
        type === MainWerdType.START && {
          borderTopRightRadius: 12,
          borderTopLeftRadius: 12,
          borderBottomWidth: 0.5,
          borderColor: colors.cardBorder,
        },
        type === MainWerdType.END && {
          borderBottomRightRadius: 12,
          borderBottomLeftRadius: 12,
        },
      ]}
    >
      {/* Surah Info */}
      <View style={styles.surahInfo}>
        <Text
          style={[
            styles.surahText,
            { fontFamily: fontFamily, color: colors.subText },
          ]}
        >{`${type} ${surah} آية ${ayahNumber}`}</Text>
        <Text
          style={[
            styles.surahText,
            { fontFamily: fontFamily, color: colors.subText },
          ]}
        >{`صفحة ${page}`}</Text>
      </View>

      {/* Verse */}
      <View style={styles.verseFrame}>
        <View style={styles.verseContainer}>
          <Text
            style={[
              styles.verse,
              { fontFamily: hafsFontFamily, color: colors.text },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {ayah}
          </Text>
          <LinearGradient
            colors={["transparent", colors.cardBackground]}
            start={{ x: 8, y: 0 }}
            end={{ x: 8, y: 0 }}
            style={styles.fadeOverlay}
            pointerEvents="none"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    padding: 16,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  type: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "#f3f4f6",
    color: "#374151",
    borderRadius: 16,
    fontSize: 14,
    fontWeight: "500",
    // textAlign: "center",
  },
  surahInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: "center",
    // marginBottom: 12,
  },
  surahText: {
    fontWeight: "500",
    fontSize: 16,
    textAlign: "left",
  },
  verseFrame: {
    // alignItems: "center",
  },
  verseContainer: {
    position: "relative",
    overflow: "hidden",
  },
  verse: {
    fontSize: 18,
    textAlign: "right", // RTL alignment for Arabic
    color: "#111827",
    lineHeight: 32,
    paddingVertical: 8,
    writingDirection: "rtl", // Ensure RTL text direction
  },
  fadeOverlay: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 60, // Width of the fade effect
  },
});
