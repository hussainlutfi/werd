import { Platform, StyleSheet } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { dummyUserSession } from "@/data/user";
import { Dimensions } from "react-native";
import { useFont } from "@/hooks/useFont";
import RewayahCard from "@/components/home/rewayahCard";

const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const { fontFamily, boldFontFamily, mediumFontFamily, extraBoldFontFamily } = useFont();
  return (
    <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: extraBoldFontFamily, fontSize: 24 }}>
          {`أهلاً وسهلاً بالمؤمن` +
            (dummyUserSession.gender === "female" ? "ة" : "")}
        </ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedText type="title" style={[styles.nameText,{ fontFamily }]}>
        {dummyUserSession.name ? ` ${dummyUserSession.name}` : ""}
      </ThemedText>
      <RewayahCard />


    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    direction: "rtl",
    paddingTop: height * 0.05,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  nameText: {
    direction: "rtl",
    fontSize: 24,
    textAlign: "center",
  },
});
