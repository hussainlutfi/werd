import { dummyRewayatControl } from "@/data/rewayah";
import { useFont } from "@/hooks/useFont";
import { useTokens } from "@/hooks/useTokens";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const { width } = require("react-native").Dimensions.get("window");

export default function RewayahCard() {
  const { fontFamily, boldFontFamily, mediumFontFamily, extraBoldFontFamily } =
    useFont();

  const colors = useTokens();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBackground,
          shadowColor: colors.rewayahCardShadow,
        },
      ]}
    >
      <Text
        style={[
          styles.rawi,
          { fontFamily: mediumFontFamily, color: colors.text },
        ]}
      >
        {dummyRewayatControl.rewayah.rawi || ""}
      </Text>
      <Text
        style={[
          styles.rewayah,
          { fontFamily: boldFontFamily, color: colors.rewayahText },
        ]}
      >
        {dummyRewayatControl.rewayah.rewayah ||
          "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا"}
      </Text>
      <View style={styles.recourseRow}>
        <Text style={styles.bookIcon}>📚</Text>
        <Text
          style={[
            styles.recourse,
            { fontFamily: mediumFontFamily, color: colors.text },
          ]}
        >
          {dummyRewayatControl.rewayah.recourse || "الطلاق - آية 2"}
        </Text>
      </View>
    </View>
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
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: width * 0.9,
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
  bookIcon: {
    fontSize: 20,
  },
  recourse: {
    color: "#000000",
    fontWeight: "500",
    fontSize: 14,
    textAlign: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
  },
});
