import { Stack } from "expo-router";
import React from "react";

export default function GroupsStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "المجموعات", headerShown: false }}
      />
      <Stack.Screen
        name="[id]"
        options={{ title: "تفاصيل المجموعة", headerShown: false }}
      />
    </Stack>
  );
}
