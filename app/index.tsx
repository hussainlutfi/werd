import { router } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

export default function Index() {
  useEffect(() => {
    // Simulate splash delay, animations, etc.
    const timeout = setTimeout(() => {
      router.replace("/splash-screen");
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  return <View style={{ flex: 1, backgroundColor: "#2E86C1" }} />;
}
