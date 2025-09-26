import { countryCodes } from "@/constants/countryCodes";
import { useFont } from "@/hooks/useFont";
import { useTokens } from "@/hooks/useTokens";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  TouchableOpacity,
} from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import type React from "react";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface OnboardingSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  handleCloseBottomSheet: () => void | undefined;
}

export default function OnboardingSheet({
  bottomSheetRef,
  handleCloseBottomSheet,
}: OnboardingSheetProps) {
  const [countryCode, setCountryCode] = useState<string>("+966");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const colors = useTokens();
  const { fontFamily, boldFontFamily, extraBoldFontFamily } = useFont();

  function normalizePhoneNumber(code: string, rawPhone: string): string {
    let cleaned = rawPhone.trim().replace(/\D/g, "");
    if (cleaned.startsWith("0")) {
      cleaned = cleaned.substring(1);
    }
    return `${code}${cleaned}`;
  }

  const fullPhone = normalizePhoneNumber(countryCode, phoneNumber);

  const handleLogin = () => {
    if (!phoneNumber) return;
    console.log("Logging in with:", fullPhone);
    router.replace("/(tabs)");
  };

  return (
    <BottomSheet
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="none"
          style={[props.style, { backgroundColor: "rgba(0,0,0,0.6)" }]}
        />
      )}
      backgroundStyle={{ backgroundColor: colors.cardBackground }}
      enableContentPanningGesture={false}
      enableHandlePanningGesture={false}
      enableOverDrag={false}
      enablePanDownToClose={false}
      handleIndicatorStyle={{ backgroundColor: colors.tint }}
      index={-1}
      ref={bottomSheetRef}
      snapPoints={["80%"]}
    >
      <BottomSheetView style={styles.bottomSheetStyle}>
        <Text
          style={[
            styles.bottomSheetTitle,
            { fontFamily: extraBoldFontFamily, color: colors.text },
          ]}
        >
          ادخل رقمك 📱
        </Text>

        {/* Phone Input Row */}
        <View style={styles.phoneRow}>
          {/* Phone Number Input */}
          <TextInput
            style={[styles.phoneInput, { fontFamily, color: colors.text }]}
            placeholder="رقم الجوال"
            placeholderTextColor={colors.tabIconDefault}
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />

          {/* Country Code Selector */}
          <Pressable
            style={styles.codeSelector}
            onPress={() => setShowDropdown((prev) => !prev)}
          >
            <Text
              style={[
                styles.codeText,
                { fontFamily: boldFontFamily, color: colors.tint },
              ]}
            >
              {countryCode}
            </Text>
            <FontAwesome
              name={showDropdown ? "chevron-up" : "chevron-down"}
              size={14}
              color={colors.tint}
            />
          </Pressable>
        </View>

        {/* Floating Dropdown */}
        {showDropdown && (
          <View
            style={[styles.dropdown, { backgroundColor: colors.background }]}
          >
            <FlatList
              data={countryCodes}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.dropdownItem,
                    { borderBottomColor: colors.cardBorder },
                  ]}
                  onPress={() => {
                    setCountryCode(item.code);
                    setShowDropdown(false);
                  }}
                >
                  <Text style={{ fontFamily, color: colors.text }}>
                    {item.flag} {item.country} ({item.code})
                  </Text>
                </Pressable>
              )}
            />
          </View>
        )}

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
          style={[styles.loginButton, { backgroundColor: colors.tint }]}
        >
          <Text
            style={[
              styles.loginText,
              { fontFamily: boldFontFamily, color: colors.cardBackground },
            ]}
          >
            التسجيل
          </Text>
        </TouchableOpacity>

        {/* Back Button */}
        <TouchableOpacity
          onPress={handleCloseBottomSheet}
          style={styles.backButton}
        >
          <Text
            style={{
              color: colors.tabIconDefault,
              fontSize: 16,
              fontFamily: boldFontFamily,
            }}
          >
            عودة
          </Text>
          <FontAwesome
            color={colors.tabIconDefault}
            name="chevron-left"
            size={12}
          />
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  bottomSheetStyle: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: 16,
    paddingTop: 32,
  },
  bottomSheetTitle: {
    color: "#000",
    fontSize: 22,
    marginBottom: 24,
    textAlign: "center",
  },
  phoneRow: {
    flexDirection: "row-reverse", // reversed: input first, code selector last
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 12,
    paddingBottom: 8,
  },
  codeSelector: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
    paddingHorizontal: 8,
  },
  codeText: {
    fontSize: 16,
    color: "#000",
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    textAlign: "left", // since input is before code
  },
  dropdown: {
    position: "absolute",
    top: 120, // adjust based on your design (should float below phoneRow)
    left: 16,
    right: 16,
    maxHeight: 250,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    zIndex: 100,
    elevation: 5,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
  },
  loginButton: {
    paddingVertical: 12,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    marginTop: 40,
    marginBottom: 16,
  },
  loginText: {
    fontSize: 14,
    textAlign: "center",
  },
  backButton: {
    flexDirection: "row-reverse",
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
});
