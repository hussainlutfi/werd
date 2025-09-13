// components/BottomSheetAddGroup.tsx
import { dummyUserSession, UserSession } from "@/data/user";
import { useFont } from "@/hooks/useFont";
import { useTokens } from "@/hooks/useTokens";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
// If you use expo-router for navigation, you can navigate after creation:
// import { router } from "expo-router";

type Props = {
  onClose?: () => void;
  onCreated?: (groupId: string) => void; // callback after successful creation
};

export type BottomSheetAddGroupRef = {
  expand: () => void;
  close: () => void;
};

export const BottomSheetAddGroup = forwardRef<BottomSheetAddGroupRef, Props>(
  ({ onClose, onCreated }, ref) => {
    const sheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["55%", "85%"], []);
    // const { user, fetchUser } = useAuth();

    const user = dummyUserSession;

    const colors = useTokens();
    const { fontFamily, boldFontFamily } = useFont();

    // state
    const [loading, setLoading] = useState(false);
    const [didSearch, setDidSearching] = useState(false);
    const [member, setMember] = useState<UserSession | undefined>(undefined);
    const [members, setMembers] = useState<UserSession[]>([]);
    const [groupName, setGroupName] = useState("");
    const [countryCode, setCountryCode] = useState("+966");
    const [phoneNumber, setPhoneNumber] = useState("");

    useImperativeHandle(ref, () => ({
      expand: () => sheetRef.current?.expand(),
      close: () => sheetRef.current?.close(),
    }));

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          opacity={0.4}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      ),
      []
    );

    function normalizePhoneNumber(code: string, rawPhone: string): string {
      let cleaned = rawPhone.trim().replace(/\D/g, "");
      if (cleaned.startsWith("0")) cleaned = cleaned.substring(1);
      return `${code}${cleaned}`;
    }

    const fullPhone = normalizePhoneNumber(countryCode, phoneNumber);
    const canSearch = countryCode.length >= 2 && phoneNumber.trim().length >= 7;

    const handleGetMember = useCallback(() => {
      if (!canSearch) return;
      setLoading(true);
      setDidSearching(true);
      setMember(undefined);

      fetch(`https://www.werdq.com/api/users/by-phone/${fullPhone}`)
        .then(async (res) => {
          if (res.status === 404) {
            setMember(undefined);
            return;
          }
          const data = await res.json();
          setMember(data);
        })
        .catch(() => {
          setMember(undefined);
        })
        .finally(() => setLoading(false));
    }, [canSearch, fullPhone]);

    const handleAddMember = useCallback(() => {
      if (!member) return;
      if (!members.some((m) => m.uid === member.uid)) {
        setMembers((prev) => [...prev, member]);
      }
    }, [member, members]);

    const removeMember = (uid: string) => {
      setMembers((prev) => prev.filter((m) => m.uid !== uid));
    };

    const resetForm = () => {
      setGroupName("");
      setMembers([]);
      setPhoneNumber("");
      setCountryCode("+966");
      setMember(undefined);
      setDidSearching(false);
    };

    // const handleCreate = useCallback(async () => {
    //   if (!groupName || members.length === 0) return;
    //   setLoading(true);

    //   try {
    //     const groupId = generateUUID();

    //     // Create group
    //     const res = await fetch("/api/groups", {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({
    //         id: groupId,
    //         name: groupName,
    //         adminId: user?.uid,
    //         members: [...members.map((m) => m.uid), user?.uid],
    //       }),
    //     });
    //     if (!res.ok) throw new Error("Failed to create group");

    //     // Add group to all members (including admin)
    //     await Promise.all(
    //       [...members.map((m) => m.uid), user?.uid].map((uid) =>
    //         fetch("/api/users/groups", {
    //           method: "POST",
    //           headers: { "Content-Type": "application/json" },
    //           body: JSON.stringify({ userId: uid, groupId }),
    //         }).catch((err) => {
    //           console.error(`Failed to add group to user ${uid}`, err);
    //         })
    //       )
    //     );

    //     await fetchUser(user?.uid || "");

    //     // Optional: navigate
    //     // router.replace("/groups");

    //     onCreated?.(groupId);
    //     resetForm();
    //     sheetRef.current?.close();
    //   } catch (error) {
    //     console.error("Error creating group:", error);
    //   } finally {
    //     setLoading(false);
    //     onClose?.();
    //   }
    // }, [groupName, members, user?.uid, fetchUser, onClose, onCreated]);

    const handleCancel = () => {
      onClose?.();
      sheetRef.current?.close();
    };

    return (
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={{
          backgroundColor: colors.cardBackground,
          borderRadius: 16,
        }}
        handleIndicatorStyle={{ backgroundColor: "#D1D5DB", width: 44 }}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={[styles.content, {}]}>
          {/* Title */}
          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                {
                  fontFamily: boldFontFamily,
                  color: colors.text,
                  paddingTop: 5,
                },
              ]}
            >
              إنشاء مجموعة جديدة
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: colors.subText,
                textAlign: "center",
                fontFamily: boldFontFamily,
                paddingVertical: 5,
              }}
            >
              اختر اسماً للمجموعة وأضف الأعضاء
            </Text>
          </View>

          {/* Scrollable content */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 12, gap: 12 }}
            bounces={false}
          >
            {/* Group name */}
            <View
              style={[styles.inputField, { borderColor: colors.cardBorder }]}
            >
              <Text style={[styles.label, { color: colors.text }]}>
                اسم المجموعة
              </Text>
              <TextInput
                value={groupName}
                onChangeText={setGroupName}
                placeholderTextColor={colors.subText}
                placeholder="اسم المجموعة"
                style={[styles.textInput, { color: colors.text }]}
              />
            </View>

            {/* Selected members chips */}
            {members.length > 0 && (
              <View style={styles.chipsWrap}>
                {members.map((m) => (
                  <View key={m.uid} style={styles.chip}>
                    <Text style={styles.chipText}>{m.name}</Text>
                    <Pressable onPress={() => removeMember(m.uid)} hitSlop={8}>
                      <Text style={styles.chipClose}>×</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            )}

            {/* Phone inputs */}
            <View style={{ gap: 10 }}>
              <Text style={[styles.label, { color: colors.text }]}>
                أضف أعضاء المجموعة
              </Text>
              <View style={styles.phoneRow}>
                <View
                  style={[
                    styles.inputField,
                    styles.codeBox,
                    { borderColor: colors.cardBorder },
                  ]}
                >
                  <Text style={styles.labelSmall}>رمز الدولة</Text>
                  <TextInput
                    value={countryCode}
                    onChangeText={setCountryCode}
                    keyboardType="phone-pad"
                    placeholder="+966"
                    placeholderTextColor={colors.subText}
                    style={[styles.textInput, { color: colors.text }]}
                  />
                </View>
                <View
                  style={[
                    styles.inputField,
                    { flex: 1, borderColor: colors.cardBorder },
                  ]}
                >
                  <Text style={[styles.labelSmall, { color: colors.subText }]}>
                    رقم الجوال
                  </Text>
                  <TextInput
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    placeholder="5XXXXXXX"
                    placeholderTextColor={colors.subText}
                    style={[styles.textInput, { color: colors.text }]}
                  />
                </View>
              </View>

              {/* Search button */}
              {!loading && (
                <Pressable
                  onPress={handleGetMember}
                  disabled={!canSearch}
                  style={({ pressed }) => [
                    [styles.primaryBtn, { backgroundColor: colors.tint }],
                    { marginTop: 18 },
                    !canSearch && styles.disabled,
                    pressed && canSearch
                      ? { transform: [{ translateY: -1 }] }
                      : null,
                  ]}
                >
                  <Text
                    style={{ fontFamily: boldFontFamily, color: colors.text }}
                  >
                    ابحث
                  </Text>
                </Pressable>
              )}
            </View>

            {/* Search states */}
            {didSearch && (
              <>
                {loading ? (
                  <View style={styles.centered}>
                    <ActivityIndicator color="#166534" />
                  </View>
                ) : member ? (
                  <View style={styles.memberCard}>
                    <Text style={styles.memberName}>{member?.name}</Text>
                    {member.phone !== user?.phone ? (
                      <Pressable
                        onPress={handleAddMember}
                        style={({ pressed }) => [
                          pressed ? { opacity: 0.9 } : null,
                        ]}
                      >
                        <Text>إضافة</Text>
                      </Pressable>
                    ) : (
                      <Text style={{ color: "#6b7280" }}>أنت 😎</Text>
                    )}
                  </View>
                ) : (
                  <View style={styles.notFoundBox}>
                    <Text style={styles.notFoundText}>
                      لم يتم العثور على عضو بهذا الرقم
                    </Text>
                  </View>
                )}
              </>
            )}
          </ScrollView>

          {/* Actions footer */}
          <View style={styles.footerRow}>
            <Pressable
              onPress={handleCancel}
              style={({ pressed }) => [
                styles.cancelBtn,
                pressed ? { opacity: 0.9 } : null,
              ]}
            >
              <Text style={[styles.cancelText, { fontFamily: boldFontFamily }]}>
                إلغاء
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {}}
              disabled={!groupName || members.length === 0 || loading}
              style={({ pressed }) => [
                [styles.createBtn, { backgroundColor: colors.tint }],

                (loading || !groupName || members.length === 0) &&
                  styles.disabled,
                pressed && !loading && groupName && members.length > 0
                  ? { transform: [{ translateY: -1 }] }
                  : null,
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  style={{
                    fontFamily: boldFontFamily,
                    color: colors.text,
                    paddingVertical: 5,
                  }}
                >
                  إنشاء
                </Text>
              )}
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 8,
    flex: 1,
  },
  header: { alignItems: "center", marginTop: 2, gap: 5, marginBottom: 18 },
  title: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },

  inputField: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  label: {
    fontWeight: "700",
    marginBottom: 6,
    textAlign: "right",
  },
  labelSmall: {
    color: "#6b7280",
    fontSize: 12,
    marginBottom: 4,
    textAlign: "right",
  },
  textInput: {
    fontSize: 16,
    textAlign: "right",
    paddingVertical: 4,
  },

  phoneRow: { flexDirection: "row", gap: 8 },
  codeBox: { width: 100 },

  primaryBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
  },
  disabled: { opacity: 0.5 },

  centered: { alignItems: "center", paddingVertical: 12 },

  memberCard: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  memberName: { fontWeight: "800", color: "#166534", fontSize: 16 },

  notFoundBox: { alignItems: "center", paddingVertical: 10 },
  notFoundText: { color: "#6b7280" },

  chipsWrap: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 6,
  },
  chipText: { fontWeight: "700", color: "#166534" },
  chipClose: { color: "#ef4444", fontSize: 16, fontWeight: "800" },

  footerRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  cancelText: { color: "#6b7280", fontWeight: "700" },

  createBtn: {
    flex: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
