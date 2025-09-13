// components/BottomSheetLeave.tsx
import { useFont } from "@/hooks/useFont";
import { useTokens } from "@/hooks/useTokens";
import { MaterialIcons } from "@expo/vector-icons";
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
  StyleSheet,
  Text,
  View,
} from "react-native";
// If you use expo-router:

type Props = {
  groupId: string;
  onClose?: () => void;
  onLeft?: () => void; // optional callback after leaving
};

export type BottomSheetLeaveRef = {
  expand: () => void;
  close: () => void;
};

export const BottomSheetLeave = forwardRef<BottomSheetLeaveRef, Props>(
  ({ groupId, onClose, onLeft }, ref) => {
    const sheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["40%"], []);
    const [loading, setLoading] = useState(false);

    const colors = useTokens();
    const { fontFamily, boldFontFamily } = useFont();

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

    const handleCancel = () => {
      onClose?.();
      sheetRef.current?.close();
    };

    // const handleLeaveGroup = useCallback(async () => {
    //   if (!user?.uid) return;
    //   setLoading(true);
    //   try {
    //     const res = await fetch(`/api/groups/members/${groupId}`, {
    //       method: "DELETE",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({ userId: user.uid }),
    //     });
    //     const data = await res.json();

    //     if (!res.ok) {
    //       console.error(data?.error || "Failed to leave group");
    //     }
    //   } catch (err) {
    //     console.error("Error leaving group:", err);
    //   } finally {
    //     try {
    //       await fetchUser(user?.uid ?? "");
    //     } catch {}
    //     setLoading(false);
    //     onLeft?.();
    //     sheetRef.current?.close();
    //     // Navigate to groups screen (adjust to your navigation):
    //     try {
    //       router.replace("/groups");
    //     } catch {
    //       // If not using expo-router, you can use Linking:
    //       // Linking.openURL("/groups").catch(() => {});
    //     }
    //   }
    // }, [groupId, user?.uid, fetchUser, onLeft]);

    return (
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: colors.cardBackground, borderRadius: 16 }}
        handleIndicatorStyle={{ backgroundColor: "#D1D5DB", width: 44 }}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={styles.content}>
          {/* Title */}
          <View style={styles.header}>
            <MaterialIcons
              name="exit-to-app"
              size={22}
              color={colors.pointsDown}
            />
            <Text
              style={[
                styles.title,
                { color: colors.pointsDown, fontFamily: boldFontFamily },
              ]}
            >
              مغادرة المجموعة
            </Text>
          </View>
          <Text
            style={{
              fontSize: 13,
              color: colors.subText,
              textAlign: "center",
              fontFamily,
            }}
          >
            من خلال النقر على مغادرة المجموعة، ستتمكن من مغادرة المجموعة
            الحالية.
          </Text>

          {/* Actions */}
          {!loading ? (
            <View style={styles.row}>
              <Pressable
                onPress={handleCancel}
                style={({ pressed }) => [
                  styles.btn,
                  styles.btnLight,
                  pressed ? { opacity: 0.9 } : null,
                ]}
              >
                <Text style={{ fontFamily,  }}>إلغاء</Text>
              </Pressable>

              <Pressable
                onPress={() => {}}
                style={({ pressed }) => [
                  styles.btn,
                  { backgroundColor: colors.pointsDown },
                  pressed ? { opacity: 0.95 } : null,
                ]}
              >
                <Text style={[styles.btnDangerText, { fontFamily }]}>
                  المغادرة
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.loadingBox}>
              <ActivityIndicator color={colors.pointsDown} />
            </View>
          )}
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  title: { fontWeight: "800", fontSize: 16 },

  row: {
    flexDirection: "column-reverse",
    gap: 8,
    width: "100%",
    paddingTop: 12,
  },

  btn: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnLight: {
    backgroundColor: "lightgray",
  },

  
  btnDangerText: {
    color: "#fff",
    fontWeight: "700",
  },

  loadingBox: { paddingVertical: 12, alignItems: "center" },
});
