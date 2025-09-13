// screens/GroupsScreen.tsx
import {
  BottomSheetAddGroup,
  BottomSheetAddGroupRef,
} from "@/components/BottomSheetAddGroup";
import { GroupCard } from "@/components/GroupCard";
import { ThemedText } from "@/components/ThemedText";
import { useFont } from "@/hooks/useFont";
import { useTokens } from "@/hooks/useTokens";
import { GroupType, mockGroups } from "@/types/groups";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function GroupsScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [loading, setLoading] = useState(true);

  const colors = useTokens();
  const { extraBoldFontFamily, fontFamily } = useFont();

  const ref = useRef<BottomSheetAddGroupRef>(null);

  // Using dummy data, but keep a tiny delay to show the loader (optional)
  useEffect(() => {
    const t = setTimeout(() => {
      setGroups(mockGroups);
      setLoading(false);
    }, 400);
    return () => clearTimeout(t);
  }, []);

  const filteredGroups = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return groups;
    return groups.filter((g) => g.name?.toLowerCase().includes(term));
  }, [groups, searchTerm]);

  const handleCreateGroup = (name: string, description: string) => {
    const newGroup: GroupType = {
      id: String(Date.now()),
      name,
      description,
      memberCount: 1,
      totalQuartersCompleted: 0,
      averageStreak: 0,
      createdAt: new Date(),
      adminId: "me",
      adminName: "أنا",
      isPublic: true,
      maxMembers: 30,
      groupGoal: "—",
      completedKhatmahs: 0,
      members: [],
    };
    setGroups((prev) => [newGroup, ...prev]);
  };

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#166534" />
        </View>
      );
    }
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyTitle}>لم يتم العثور على مجموعات</Text>
        <Text style={styles.emptySubtitle}>
          جرب البحث بكلمات مختلفة أو أنشئ مجموعة جديدة
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safe]}>
      <View style={styles.page}>
        <View style={styles.header}>
          <ThemedText
            type="title"
            style={{
              fontFamily: extraBoldFontFamily,
              fontSize: 24,
              paddingVertical: 18,
              textAlign: "right",
              color: colors.text,
            }}
          >
            المجموعات
          </ThemedText>
          <Pressable
            onPress={() => ref.current?.expand()}
            style={styles.createBtn}
          >
            <Ionicons name="add-circle" size={40} color={colors.tint} />
          </Pressable>
        </View>

        {/* Search + Create */}
        <View style={styles.searchRow}>
          <View
            style={[
              styles.searchBox,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <Ionicons
              name="search"
              size={18}
              color="#6b7280"
              style={{ marginLeft: 8, transform: [{ scaleX: -1 }] }} // flip to suit RTL
            />
            <TextInput
              placeholder="ابحث عن مجموعة..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              style={[styles.input, { color: colors.text, fontFamily }]}
              textAlign="right"
            />
          </View>
        </View>

        {/* List */}
        <FlatList
          data={filteredGroups}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={renderEmpty}
          renderItem={({ item }) => (
            <GroupCard
              group={item}
              onPress={() => {
                router.push(`/groups/${item.id}`);
              }}
            />
          )}
        />

        {/* Add Group Modal */}
        {/* <AddGroup
          open={isAddGroupOpen}
          onClose={() => setIsAddGroupOpen(false)}
          onCreate={handleCreateGroup}
        /> */}
      </View>
      <BottomSheetAddGroup
        ref={ref}
        onCreated={(groupId) => {
          // e.g., refetch groups / navigate
          // router.replace("/groups");
        }}
        onClose={() => {
          // track dismissal if needed
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  page: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    // backgroundColor: "#fafafa",
  },
  searchRow: {
    flexDirection: "row-reverse",
    gap: 10,
    marginBottom: 16,
    alignItems: "center",
  },
  searchBox: {
    flex: 1,
    flexDirection: "row-reverse",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  createBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  createText: {
    color: "white",
    fontWeight: "700",
  },
  center: {
    paddingTop: 24,
    alignItems: "center",
  },
  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  emptyTitle: {
    color: "#6b7280",
    fontSize: 16,
    marginBottom: 6,
    textAlign: "center",
  },
  emptySubtitle: {
    color: "#9ca3af",
    fontSize: 12,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 16,
    width: 52,
    height: 52,
    backgroundColor: "#2563eb",
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
});
