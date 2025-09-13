// components/BottomSheetShare.tsx
import { useFont } from "@/hooks/useFont";
import { useTokens } from "@/hooks/useTokens";
import { MaterialIcons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import * as Clipboard from "expo-clipboard";
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
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Props = {
  groupId?: string;
  baseUrl?: string; // default: https://www.werdq.com
};

export type BottomSheetShareRef = {
  expand: () => void;
  close: () => void;
};

export const BottomSheetShare = forwardRef<BottomSheetShareRef, Props>(
  ({ groupId, baseUrl = "https://www.werdq.com" }, ref) => {
    const sheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["35%"], []);
    const link = `${baseUrl}/groups/join/${groupId ?? ""}`;

    const colors = useTokens();
    const { fontFamily, boldFontFamily } = useFont();

    // simple inline toast
    const [toastMsg, setToastMsg] = useState<string | null>(null);
    const [isWarn, setIsWarn] = useState(false);
    const fade = useRef(new Animated.Value(0)).current;
    const [copying, setCopying] = useState(false);

    useImperativeHandle(ref, () => ({
      expand: () => sheetRef.current?.expand(),
      close: () => sheetRef.current?.close(),
    }));

    const showToast = useCallback(
      (msg: string, warn = false) => {
        setToastMsg(msg);
        setIsWarn(warn);
        Animated.timing(fade, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }).start(() => {
          setTimeout(() => {
            Animated.timing(fade, {
              toValue: 0,
              duration: 150,
              useNativeDriver: true,
            }).start(() => setToastMsg(null));
          }, 2000);
        });
      },
      [fade]
    );

    const handleCopy = useCallback(async () => {
      if (!groupId) {
        showToast("لا يمكن النسخ: المعرّف غير متوفر.", true);
        return;
      }
      try {
        setCopying(true);
        await Clipboard.setStringAsync(link);
        showToast("تم نسخ الرابط ✅");
      } catch (e) {
        showToast("تعذّر نسخ الرابط تلقائيًا. انسخه يدويًا.", true);
      } finally {
        setCopying(false);
      }
    }, [groupId, link, showToast]);

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
        <BottomSheetView style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                { color: colors.text, fontFamily: boldFontFamily },
              ]}
            >
              نشر المجموعة
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: colors.subText, fontFamily: boldFontFamily },
              ]}
            >
              انسخ رابط الدعوة وشاركه
            </Text>
          </View>

          {/* Link row */}
          <View style={styles.row}>
            <View
              style={[
                styles.inputBox,
                { flex: 1, borderColor: colors.cardBorder },
              ]}
            >
              <TextInput
                value={link}
                editable={false}
                selectTextOnFocus
                style={[
                  styles.input,
                  { color: colors.text, borderColor: colors.cardBorder, fontFamily },
                ]}
              />
            </View>

            <Pressable
              onPress={handleCopy}
              disabled={copying}
              style={({ pressed }) => [
                [
                  styles.copyBtn,
                  { color: colors.text, borderColor: colors.cardBorder },
                ],
                copying && styles.disabled,
                pressed && !copying
                  ? { transform: [{ translateY: -1 }] }
                  : null,
              ]}
              accessibilityLabel="نسخ الرابط"
            >
              {copying ? (
                <ActivityIndicator size="small" color={colors.tint} />
              ) : (
                <MaterialIcons
                  name="content-copy"
                  size={18}
                  color={colors.tint}
                />
              )}
            </Pressable>
          </View>

          {/* Inline toast */}
          {toastMsg ? (
            <Animated.View
              style={[
                styles.toast,
                { backgroundColor: isWarn ? colors.pointsDown : "#028e43ff" },
                { opacity: fade },
              ]}
            >
              <Text style={[styles.toastText, { color: "white", fontFamily }]}>
                {toastMsg}
              </Text>
            </Animated.View>
          ) : null}
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16, gap: 12 },
  header: { alignItems: "center", gap: 10, marginTop: 4 },
  title: { fontSize: 18, fontWeight: "800", color: "#1f2937" },
  subtitle: { fontSize: 13, color: "#6b7280" },

  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  inputBox: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: { fontSize: 14, color: "#111827" },

  copyBtn: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 44,
  },
  disabled: { opacity: 0.5 },

  hint: { textAlign: "center", color: "#9CA3AF", marginTop: 6, fontSize: 12 },

  toast: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: -30,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  toastText: { color: "#fff", fontWeight: "700" },
});
