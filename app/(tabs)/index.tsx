import { StyleSheet, View } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import RewayahCard from "@/components/home/rewayahCard"; 
import { StrikeCard } from "@/components/home/StrikeCard";
import TodayWerd from "@/components/home/TodayWerd";
import UncompletedWerds from "@/components/home/UncompletedWerds";
import { UserPoint } from "@/components/home/UserPoint";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemeToggle } from "@/components/ThemeToggle";
import { dummyUserSession } from "@/data/user";
import { useFont } from "@/hooks/useFont";
import { useTokens } from "@/hooks/useTokens";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const { fontFamily, boldFontFamily, mediumFontFamily, extraBoldFontFamily } =
    useFont();
  const colors = useTokens();
  return (
    <ParallaxScrollView>
      <View style={styles.header}>
        <ThemedView style={{flexDirection: "row", alignItems: "center", justifyContent: "flex-end", paddingHorizontal: 16, }}>
          <ThemeToggle />
        </ThemedView>

        <ThemedView style={styles.titleContainer}>
          <ThemedText
            type="title"
            style={{
              fontFamily: extraBoldFontFamily,
              fontSize: 24,
              paddingTop: 3,
              color: colors.text,
            }}
          >
            {`أهلاً وسهلاً بالمؤمن` +
              (dummyUserSession.gender === "female" ? "ة" : "")}
          </ThemedText>
          <HelloWave />
        </ThemedView>

        <ThemedText
          type="title"
          style={[styles.nameText, { fontFamily, color: colors.subText }]}
        >
          {dummyUserSession.name ? ` ${dummyUserSession.name}` : ""}
        </ThemedText>

        <UserPoint
          points={dummyUserSession.points}
          isPointing={dummyUserSession.isPoniting}
        />
      </View>

      <StrikeCard strike={1} />

      <RewayahCard />

      <TodayWerd />

      <UncompletedWerds />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "column",
    // alignItems: "center",
    justifyContent: "center",
    marginBottom: 26,
  },
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
