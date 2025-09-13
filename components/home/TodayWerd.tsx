import { useFont } from "@/hooks/useFont";
import { useTokens } from "@/hooks/useTokens";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import WerdCard, { MainWerdType } from "./WerdCard";

const TodayWerd: React.FC = () => {
  const colors = useTokens();
  const { fontFamily, boldFontFamily } = useFont();
  const isCompleted = false; // Replace with actual logic to determine if the user has completed today's Werd

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.title,
          { color: colors.text, fontFamily: boldFontFamily },
        ]}
      >
        {"وِِرد اليوم"}
      </Text>

      <View style={{ flexDirection: "column" }}>
        <WerdCard
          type={MainWerdType.START}
          ayah="قُل لَو أَنتُم تَملِكونَ خَزائِنَ رَحمَةِ رَبّي إِذًا لَأَمسَكتُم خَشيَةَ الإِنفاقِ وَكانَ الإِنسانُ قَتورًا﴾ [الإسراء: ١٠٠]"
          surah="الفاتحة"
          ayahNumber="1"
          page="1"
        />
        <WerdCard
          type={MainWerdType.END}
          ayah="قُل لَو أَنتُم تَملِكونَ خَزائِنَ رَحمَةِ رَبّي إِذًا لَأَمسَكتُم خَشيَةَ الإِنفاقِ وَكانَ الإِنسانُ قَتورًا﴾ [الإسراء: ١٠٠]"
          surah="الفاتحة"
          ayahNumber="1"
          page="1"
        />
      </View>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.tint }]}
        onPress={() =>
          router.push({
            pathname: "/quran",
            params: {
              start: "1",
              quantity: "4",
              type: "HEZB",
              isFinished: "false",
            },
          })
        }
      >
        <Text
          style={{
            paddingVertical: 6,
            color: "#fff",
            fontSize: 16,
            fontFamily: boldFontFamily,
          }}
        >
          {isCompleted ? "العودة للورد" : "اقرأ الورد"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    direction: "rtl",
    marginTop: 24,
  },
  title: {
    fontSize: 24,
    textAlign: "right",
    padding: 3,
    marginBottom: 24,
  },
  button: {
    marginTop: 32,
    paddingHorizontal: 32,
    paddingVertical: 6,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    alignItems: "center",
    width: "100%",
  },
});

export default TodayWerd;
