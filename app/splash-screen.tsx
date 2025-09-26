import { useTokens } from "@/hooks/useTokens";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");

export default function SplashScreen() {
  const colors = useTokens();

  useEffect(() => {
    const timer = setTimeout(() => {
      checkLoginStatus();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const checkLoginStatus = () => {
    router.replace("/onboarding");
  };
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: width * 0.75,
    height: width * 0.75,
  },
});
