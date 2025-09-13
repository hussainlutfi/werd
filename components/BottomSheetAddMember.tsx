// components/BottomSheetAddMember.tsx
import { dummyUserSession, UserSession } from "@/data/user";
import { useFont } from "@/hooks/useFont";
import { useTokens } from "@/hooks/useTokens";
import { Group } from "@/types/groups";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Props = {
  groupId: string;
  onAdded?: (user: UserSession) => void; // optional callback after successful add
};

export type BottomSheetAddMemberRef = {
  expand: () => void;
  close: () => void;
};

export const BottomSheetAddMember = forwardRef<BottomSheetAddMemberRef, Props>(
  ({ groupId, onAdded }, ref) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["40%", "75%"], []);

    // UI state
    const [countryCode, setCountryCode] = useState<string>("+966");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [didSearch, setDidSearching] = useState<boolean>(false);

    const colors = useTokens();
    const { fontFamily, boldFontFamily } = useFont();

    // data state
    const [member, setMember] = useState<UserSession | undefined>(undefined);
    const [group, setGroup] = useState<Group | undefined>(undefined);

    useImperativeHandle(ref, () => ({
      expand: () => bottomSheetRef.current?.expand(),
      close: () => bottomSheetRef.current?.close(),
    }));

    // Fetch group once
    useEffect(() => {
      if (!groupId) return;
      let active = true;
      fetch(`https://www.werdq.com/api/groups/${groupId}`)
        .then(async (res) => {
          if (!active) return;
          if (res.ok) {
            const data = await res.json();
            setGroup(data);
          }
        })
        .catch(console.error);
      return () => {
        active = false;
      };
    }, [groupId]);

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
        .finally(() => {
          setLoading(false);
        });
    }, [canSearch, fullPhone]);

    // const handleAddMember = useCallback(() => {
    //   if (!member) return;

    //   setLoading(true);

    //   // Add to group members
    //   fetch(`/api/groups/members/${groupId}`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ userId: member.uid }),
    //   })
    //     .then((res) => {
    //       if (!res.ok) throw new Error("Failed to add member to group");
    //     })
    //     .then(() => {
    //       // Also add group to user
    //       return fetch("/api/users/groups", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ userId: member.uid, groupId }),
    //       });
    //     })
    //     .then(() => {
    //       onAdded?.(member);
    //       // reset the UI
    //       setMember(undefined);
    //       setDidSearching(false);
    //       setPhoneNumber("");
    //       // keep the sheet open (or close if you prefer):
    //       // bottomSheetRef.current?.close();
    //     })
    //     .catch((err) => {
    //       console.error(err);
    //     })
    //     .finally(() => {
    //       setLoading(false);
    //     });
    // }, [member, groupId, onAdded]);

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

    const isSelf =
      member &&
      dummyUserSession?.phone &&
      member.phone === dummyUserSession.phone;
    const isAlreadyInGroup =
      !!member && !!group?.members?.includes?.(member.uid as any);

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: "#D1D5DB", width: 44 }}
        backgroundStyle={{
          backgroundColor: colors.cardBackground,
          borderRadius: 16,
        }}
      >
        <BottomSheetView style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                { color: colors.text, fontFamily: boldFontFamily },
              ]}
            >
              إضافة عضو جديد
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: colors.subText, fontFamily: boldFontFamily },
              ]}
            >
              أدخل رقم الجوال للبحث عن العضو
            </Text>
          </View>

          {/* Phone Step (inline) */}
          <View style={styles.phoneRow}>
            <View
              style={[
                styles.input,
                styles.codeBox,
                { borderColor: colors.cardBorder },
              ]}
            >
              <Text
                style={[styles.label, { color: colors.subText, fontFamily }]}
              >
                رمز الدولة
              </Text>
              <TextInput
                value={countryCode}
                onChangeText={setCountryCode}
                keyboardType="phone-pad"
                placeholder="+966"
                placeholderTextColor={colors.subText}
                style={[styles.textField, { color: colors.text }]}
              />
            </View>

            <View
              style={[
                styles.input,
                { flex: 1, borderColor: colors.cardBorder },
              ]}
            >
              <Text
                style={[styles.label, { color: colors.subText, fontFamily }]}
              >
                رقم الجوال
              </Text>
              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                placeholder="5XXXXXXX"
                placeholderTextColor={colors.subText}
                style={[styles.textField, { color: colors.text }]}
              />
            </View>
          </View>
          <Pressable
            onPress={handleGetMember}
            disabled={!canSearch || loading}
            style={({ pressed }) => [
              styles.searchBtn,
              (!canSearch || loading) && styles.btnDisabled,
              pressed && !loading && canSearch
                ? { transform: [{ translateY: -1 }] }
                : null,
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text
                style={[styles.searchBtnText, { fontFamily: boldFontFamily }]}
              >
                ابحث
              </Text>
            )}
          </Pressable>

          {/* Results / states */}
          {didSearch && (
            <>
              {loading ? (
                <View style={styles.centered}>
                  <ActivityIndicator color={colors.tint} />
                </View>
              ) : member ? (
                <View
                  style={[
                    styles.memberCard,
                    {
                      //   backgroundColor: colors.background,
                      borderColor: colors.cardBorder,
                    },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.memberName, { color: colors.text }]}>
                      {member?.name}
                    </Text>
                    {member?.phone ? (
                      <Text
                        style={[styles.memberPhone, { color: colors.subText }]}
                      >
                        {member.phone}
                      </Text>
                    ) : null}
                  </View>

                  {/* Right side actions / chip */}
                  {isSelf ? (
                    <Text style={styles.pill}>أنت 😎</Text>
                  ) : isAlreadyInGroup ? (
                    <Text style={styles.pill}>موجود 😎</Text>
                  ) : (
                    <Pressable
                      onPress={() => {}}
                      disabled={loading}
                      style={({ pressed }) => [
                        [styles.addBtn, { borderColor: colors.tint }],
                        loading && styles.btnDisabled,
                        pressed && !loading
                          ? { transform: [{ translateY: -1 }] }
                          : null,
                      ]}
                    >
                      {loading ? (
                        <ActivityIndicator color={colors.tint} />
                      ) : (
                        <Text
                          style={[styles.addBtnText, { color: colors.tint }]}
                        >
                          إضافة
                        </Text>
                      )}
                    </Pressable>
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
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingTop: 6, paddingBottom: 16, gap: 12 },
  header: { alignItems: "center", gap: 10, marginTop: 4 },
  title: { fontSize: 18, fontWeight: "800", color: "#1f2937" },
  subtitle: { fontSize: 13, color: "#6b7280" },

  phoneRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
  },
  codeBox: { width: 100 },
  label: { fontSize: 12, color: "#6b7280", marginBottom: 4 },
  textField: { fontSize: 16, paddingVertical: 6 },

  searchBtn: {
    backgroundColor: "#166534",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBtnText: { color: "#fff", fontWeight: "700" },
  btnDisabled: { opacity: 0.5 },

  centered: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },

  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  memberName: { fontWeight: "800", fontSize: 16 },
  memberPhone: { color: "#6b7280", marginTop: 2 },

  pill: {
    backgroundColor: "#F3F4F6",
    color: "#111827",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    fontWeight: "700",
  },

  addBtn: {
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  addBtnText: { color: "#166534", fontWeight: "700" },

  notFoundBox: { alignItems: "center", paddingVertical: 10 },
  notFoundText: { color: "#6b7280" },
});
