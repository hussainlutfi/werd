// components/GroupCard.tsx
import { useFont } from "@/hooks/useFont";
import { useTokens } from "@/hooks/useTokens";
import { getArabicNumber } from "@/utils/convetions";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { GroupType } from "../types/groups";
import KebabMenuPopover, { KebabMenuItem } from "./KebabMenuPopover";

type Props = {
  group: GroupType;
  onPress?: (group: GroupType) => void;
};

export const GroupCard: React.FC<Props> = ({ group, onPress }) => {
  const colors = useTokens();
  const { boldFontFamily } = useFont();
  const items: KebabMenuItem[] = [
    {
      title: "مغادرة",
      icon: <Feather name="log-out" size={18} color={colors.pointsDown} />,
      color: colors.pointsDown,
      onPress: () => console.log("leave"),
    },
    {
      title: "حذف",
      icon: <Feather name="trash-2" size={18} color={colors.pointsDown} />,
      color: colors.pointsDown,
      onPress: () => console.log("delete"),
    },
  ];
  return (
    <Pressable
      onPress={() => onPress?.(group)}
      style={[styles.card, { backgroundColor: colors.background }]}
    >
      <FontAwesome name="group" size={28} color={colors.tint} />
      <View style={{ flex: 1, gap: 8 }}>
        <View style={{ gap: 6 }}>
          <Text style={[styles.title, { color: colors.text }]}>
            {group.name}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <FontAwesome name="group" size={12} color={colors.subText} />
          <Text
            style={[
              styles.meta,
              { color: colors.subText, fontFamily: boldFontFamily },
            ]}
          >
            {getArabicNumber(group.memberCount) + "  عضو"}
          </Text>
        </View>
      </View>

      <KebabMenuPopover
        items={items}
        menuWidth={220}
        renderTrigger={({ onPress }) => (
          <Pressable
            onPress={onPress}
            hitSlop={10}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <MaterialCommunityIcons
              name="dots-vertical"
              size={24}
              color={colors.subText}
            />
          </Pressable>
        )}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 24,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    paddingVertical: 14,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    textAlign: "right",
    writingDirection: "rtl",
  },
  description: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "right",
    writingDirection: "rtl",
  },
  metaRow: {
    marginTop: 10,
    flexDirection: "row-reverse",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 12,
  },
  meta: {
    fontSize: 16,
    color: "#374151",
  },
  footer: {
    marginTop: 12,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  admin: {
    fontSize: 12,
    color: "#6b7280",
  },
  tag: {
    fontSize: 12,
    color: "#166534",
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
});
