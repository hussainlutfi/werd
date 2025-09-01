import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useTokens } from "@/hooks/useTokens";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabLayout() {
  const colors = useTokens();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabIconSelected,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="profile"
        options={{
          title: "الحساب",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="person-sharp"
              size={28}
              color={focused ? colors.tabIconSelected : colors.tabIconDefault}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "الرئيسية",
          tabBarIcon: ({ focused }) => (
            <IconSymbol
              size={28}
              name="house.fill"
              color={focused ? colors.tabIconSelected : colors.tabIconDefault}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: "المجموعات",
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="group"
              size={28}
              color={focused ? colors.tabIconSelected : colors.tabIconDefault}
            />
          ),
        }}
      />
    </Tabs>
  );
}
