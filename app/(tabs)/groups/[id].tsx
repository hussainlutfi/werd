import {
  BottomSheetAddMember,
  BottomSheetAddMemberRef,
} from "@/components/BottomSheetAddMember";
import {
  BottomSheetLeave,
  BottomSheetLeaveRef,
} from "@/components/BottomSheetLeave";
import KebabMenuPopover, { KebabMenuItem } from "@/components/KebabMenuPopover";
import { dummyUserSession } from "@/data/user"; // <- replace useAuth() with this
import { useFont } from "@/hooks/useFont";
import { useTokens } from "@/hooks/useTokens";
import { GroupMember, GroupType, mockGroups } from "@/types/groups";
import { getArabicNumber } from "@/utils/convetions";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";

// --- Inline RN MemberCard (replace with your own if you have it) ---
function MemberCard({
  member,
  rank,
  adminId,
}: {
  member: GroupMember;
  rank: number;
  adminId: string;
}) {
  const isAdmin = member.id === adminId;
  const colors = useTokens();
  const { fontFamily, boldFontFamily } = useFont();

  const items: KebabMenuItem[] = [
    {
      title: "تنبيه",
      icon: <Feather name="bell" size={18} color={colors.text} />,
      onPress: () => console.log("edit"),
      color: colors.text,
    },
    {
      title: "حذف",
      icon: <Feather name="trash-2" size={18} color={colors.pointsDown} />,
      color: colors.pointsDown,
      onPress: () => console.log("delete"),
    },
  ];

  const getRankColor = (rank: number) => {
    if (rank === 1) return colors.gold;
    if (rank === 2) return colors.silver;
    if (rank === 3) return colors.bronze;
    return colors.tint;
  };
  const getRank = (rank: number) => {
    if (rank === 1) return ` ${getArabicNumber(rank)}🥇`;
    if (rank === 2) return ` ${getArabicNumber(rank)}🥈`;
    if (rank === 3) return ` ${getArabicNumber(rank)}🥉`;
    return ` ${getArabicNumber(rank)}`;
  };

  const color = member.isPointing ? colors.pointsUp : colors.pointsDown; // Tailwind red-800 ≈ #991B1B
  const iconName = member.isPointing ? "trending-up" : "trending-down";

  return (
    <View style={[mc.card, { backgroundColor: colors.cardBackground }]}>
      <View style={{ flexDirection: "column" }}>
        <View style={mc.row}>
          <Text style={[mc.rank, { color: getRankColor(rank) }]}>
            #{getRank(rank)}
          </Text>
          <Text
            style={[
              mc.name,
              { color: colors.text, fontFamily: boldFontFamily },
            ]}
            numberOfLines={1}
          >
            {member.name}
            {isAdmin ? " • مدير" : ""}
          </Text>
        </View>
      </View>
      <View style={[mc.row, { gap: "10%" }]}>
        <View style={{ alignItems: "center", flexDirection: "column", gap: 5 }}>
          <Text
            style={{ color: colors.text, fontFamily: boldFontFamily }}
          >{`${getArabicNumber(member.strike)} 🔥`}</Text>
          <Text style={{ color: colors.subText, fontFamily }}>{`تتابع`}</Text>
        </View>
        <View style={{ alignItems: "center", flexDirection: "column", gap: 5 }}>
          <Text style={{ color: colors.text, fontFamily: boldFontFamily }}>
            {`${getArabicNumber(member.points)}`}{" "}
            <Feather name={iconName as any} size={12} color={color} />
          </Text>
          <Text style={{ color: colors.subText, fontFamily }}>{`نقاط`}</Text>
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
              name="dots-horizontal"
              size={24}
              color={colors.subText}
            />
          </Pressable>
        )}
      />
      {/* <KebabMenu
        iconColor={colors.subText}
        cardBackground={colors.cardBackground}
        borderColor={"#e5e7eb"}
        items={[
          {
            icon: <MaterialIcons name="edit" size={18} color={colors.text} />,
            title: "تعديل العضو",
            onPress: () => console.log("edit"),
          },
          {
            icon: <Feather name="refresh-ccw" size={18} color={colors.text} />,
            title: "إعادة ضبط النقاط",
            onPress: () => console.log("reset points"),
          },
          {
            icon: (
              <MaterialIcons name="delete-outline" size={18} color="white" />
            ),
            title: "حذف",
            onPress: () => console.log("delete"),
            color: "darkred", // title color (destructive)
          },
        ]}
      /> */}
    </View>
  );
}

const mc = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  row: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  rank: {
    fontWeight: "800",
    fontSize: 16,
  },
  name: {
    // flex: 1,
    textAlign: "right",
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    width: 100,
  },
  points: {
    marginTop: 6,
    textAlign: "right",
    color: "#6b7280",
    fontSize: 12,
  },
});

// --- Simple RN Dialogs (replace with your own if you have them) ---
function SimpleDialog({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children?: React.ReactNode;
}) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={dlg.scrim}>
        <View style={dlg.sheet}>
          <Text style={dlg.title}>{title}</Text>
          <View style={{ marginTop: 12 }}>{children}</View>
          <Pressable style={dlg.btn} onPress={onClose}>
            <Text style={dlg.btnText}>إغلاق</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const dlg = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    padding: 20,
  },
  sheet: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
  },
  title: {
    textAlign: "right",
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  btn: {
    marginTop: 16,
    backgroundColor: "#166534",
    paddingVertical: 10,
    borderRadius: 10,
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
  },
});

// --- Screen ---
export default function GroupDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const groupId = String(id);

  const colors = useTokens();
  const { fontFamily, boldFontFamily } = useFont();

  const showError = (message: string) => Alert.alert("خطأ", message);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `https://www.werdq.com/groups/join/${groupId}`,
        title: "مشاركة الرواية",
      });
    } catch (e) {
      showError("تعذّرت المشاركة.");
    }
  }, [groupId]);

  // dialogs
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

  // data
  const [group, setGroup] = useState<GroupType>(mockGroups[0]);
  const [members, setMembers] = useState<GroupMember[]>(group.members);
  const [loading, setLoading] = useState(false);

  if (!group) {
    return (
      <SafeAreaView style={s.safe}>
        <View
          style={[s.card, { alignItems: "center", justifyContent: "center" }]}
        >
          <Text style={s.notFound}>المجموعة غير موجودة</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Sort members by points desc
  const sortedMembers = useMemo(
    () => [...members].sort((a, b) => (b.points ?? 0) - (a.points ?? 0)),
    [members]
  );

  const topThree = sortedMembers.slice(0, 3);
  const others = sortedMembers.slice(3);

  const sheetRef = useRef<BottomSheetAddMemberRef>(null);
  const leaveRef = useRef<BottomSheetLeaveRef>(null);

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={s.scroll}>
        {/* Header */}
        <View style={s.headerRow}>
          <Pressable onPress={() => router.back()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={20} color="#6b7280" />
            <Text style={[s.backText, { color: colors.subText }]}>
              المجموعات
            </Text>
          </Pressable>
        </View>

        {/* Group info card */}
        <View style={[s.card, { backgroundColor: colors.cardBackground }]}>
          <View style={s.cardRow}>
            <View style={s.groupIconBox}>
              <MaterialIcons name="group" size={46} color="#166534" />
            </View>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-end",
              }}
            >
              <Text
                style={[
                  s.groupTitle,
                  {
                    fontSize: 20,
                    color: colors.text,
                    fontFamily: boldFontFamily,
                  },
                ]}
                numberOfLines={2}
              >
                {group.name}
              </Text>

              <Text
                style={[s.groupSubtitle, { color: colors.subText, fontFamily }]}
              >
                <Text
                  style={{ color: colors.subText, fontFamily: boldFontFamily }}
                >
                  {getArabicNumber(group.members?.length) ?? 0}
                </Text>{" "}
                <FontAwesome name="group" size={12} color={colors.subText} />
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Pressable
            style={[
              s.card,
              {
                backgroundColor: colors.cardBackground,
                flexDirection: "row-reverse",
                gap: 8,
                borderWidth: 1,
                borderColor: colors.subText,
                justifyContent: "center",
                alignItems: "center",
                width: "48%",
              },
            ]}
            onPress={handleShare}
          >
            <Text
              style={[
                s.btnTextOutline,
                {
                  fontSize: 12,
                  color: colors.subText,
                  fontFamily: boldFontFamily,
                },
              ]}
            >
              مشاركة المجموعة
            </Text>
            <Ionicons name="share-outline" size={16} color={colors.subText} />
          </Pressable>
          <Pressable
            style={[
              s.card,
              {
                backgroundColor: colors.cardBackground,
                flexDirection: "row-reverse",
                gap: 8,
                borderWidth: 1,
                borderColor: colors.subText,
                justifyContent: "center",
                alignItems: "center",
                width: "48%",
              },
            ]}
            onPress={() => sheetRef.current?.expand()}
          >
            <Text
              style={[
                s.btnTextOutline,
                {
                  fontSize: 12,
                  color: colors.subText,
                  fontFamily: boldFontFamily,
                },
              ]}
            >
              إضافة عضو
            </Text>
            <Ionicons name="person-add" size={16} color={colors.subText} />
          </Pressable>
        </View>

        {/* Top 3 */}
        {topThree.length > 0 && (
          <View style={{ marginBottom: 12 }}>
            <Text
              style={[
                s.sectionTitle,
                { fontSize: 20, color: colors.text, fontFamily },
              ]}
            >
              🏆 المتصدرون
            </Text>
            <View style={{ gap: 12 }}>
              {topThree.map((member, index) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  rank={index + 1}
                  adminId={group.adminId}
                />
              ))}
            </View>
          </View>
        )}

        {/* Others */}
        {others.length > 0 && (
          <View>
            <Text
              style={[
                s.sectionTitle,
                { fontSize: 20, color: colors.text, fontFamily },
              ]}
            >
              باقي الأعضاء
            </Text>
            <View style={{ gap: 10 }}>
              {others.map((member, index) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  rank={index + 4}
                  adminId={group.adminId}
                />
              ))}
            </View>
          </View>
        )}

        {/* Danger actions */}
        <View style={{ marginTop: 16, gap: 8 }}>
          <Pressable
            style={[s.fullBtn, s.dangerBtn]}
            onPress={() => leaveRef.current?.expand()}
          >
            <MaterialCommunityIcons name="exit-run" size={18} color="#fff" />
            <Text style={s.fullBtnText}>مغادرة المجموعة</Text>
          </Pressable>

          {group.adminId === dummyUserSession.uid && (
            <Pressable
              style={[s.fullBtn, s.dangerBtn]}
              onPress={() => setRemoveDialogOpen(true)}
            >
              <MaterialIcons name="delete-outline" size={18} color="#fff" />
              <Text style={s.fullBtnText}>حذف المجموعة</Text>
            </Pressable>
          )}
        </View>

        {/* Loading / Empty */}
        {loading ? (
          <View style={s.center}>
            <ActivityIndicator size="large" color="#166534" />
          </View>
        ) : (
          sortedMembers.length === 0 && (
            <View style={s.emptyCard}>
              <Text style={s.emptyTitle}>
                لا يوجد أعضاء في هذه المجموعة بعد
              </Text>
              <Pressable
                style={[s.btn, s.btnSolid]}
                onPress={() => setAddMemberOpen(true)}
              >
                <Ionicons name="person-add" size={16} color="#fff" />
                <Text style={s.btnTextSolid}>إضافة عضو</Text>
              </Pressable>
            </View>
          )
        )}
      </ScrollView>

      {/* Dialogs */}
      <SimpleDialog
        open={addMemberOpen}
        title="إضافة عضو"
        onClose={() => setAddMemberOpen(false)}
      >
        <Text style={{ textAlign: "right", color: "#6b7280" }}>
          هنا يمكنك بناء نموذج إضافة عضو (RN).
        </Text>
      </SimpleDialog>

      <SimpleDialog
        open={removeDialogOpen}
        title="حذف المجموعة"
        onClose={() => setRemoveDialogOpen(false)}
      >
        <Text style={{ textAlign: "right", color: "#6b7280" }}>
          تأكيد حذف المجموعة (تنبيه لا يمكن التراجع).
        </Text>
      </SimpleDialog>

      <BottomSheetAddMember
        ref={sheetRef}
        groupId="YOUR_GROUP_ID"
        onAdded={() => {
          // e.g. refetch group members list in this screen
        }}
      />
      <BottomSheetLeave ref={leaveRef} groupId={groupId} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fafafa", marginBottom: 60 },
  scroll: { padding: 16, paddingBottom: 32, gap: 16 },
  headerRow: { flexDirection: "row", alignItems: "center" },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  backText: { color: "#6b7280", fontSize: 14, fontWeight: "600" },

  actionsRow: {
    flexDirection: "row-reverse",
    gap: 8,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  btn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnSolid: { backgroundColor: "#166534" },
  btnTextSolid: { color: "#fff", fontWeight: "700", fontSize: 12 },
  btnOutline: {
    borderWidth: 2,
    borderColor: "#166534",
    backgroundColor: "#fff",
  },
  btnTextOutline: { color: "#166534", fontWeight: "700" },

  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    // justifyContent: "space-between",
    gap: 12,
  },
  groupIconBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  groupTitle: {
    textAlign: "right",
    fontWeight: "800",
    color: "#1f2937",
  },
  groupSubtitle: {
    color: "grey",
    paddingRight: 6,
    marginTop: 8,
    textAlign: "right",
  },

  sectionTitle: {
    marginBottom: 12,
    textAlign: "right",
  },

  fullBtn: {
    width: "100%",
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  fullBtnText: { color: "#fff", fontWeight: "700" },
  dangerBtn: { backgroundColor: "darkred" },

  center: { alignItems: "center", marginVertical: 16 },
  emptyCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  emptyTitle: { color: "#6b7280", fontSize: 16, textAlign: "center" },

  notFound: { textAlign: "center", color: "#6b7280", fontSize: 16 },
});
