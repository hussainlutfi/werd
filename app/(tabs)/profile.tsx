import { StyleSheet, View } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import PlanCard from "@/components/PlanCard";
import ProfileHeader from "@/components/ProfileHeader";
import ProgressCard from "@/components/ProgressCard";
import StatusProfile from "@/components/StatusProfile";

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView>
      <View>
        <ProfileHeader
          userData={{
            name: "حسن علي",
            phone: "+966-123-456-7890",
            points: 100,
          }}
        />
        <StatusProfile />
        <PlanCard />

        <ProgressCard progress={90} remainingDays={23} />
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
