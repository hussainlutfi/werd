// PersonScreen.tsx
"use client";
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

const colors = {
  background: "#f9fafb",
  main: "#016630",
  text: "#000000",
  lightText: "#6b7280",
};

function ProfileTab() {
  return (
    <View style={styles.tabContainer}>
      <View style={styles.center}>
        <View style={styles.avatar}>
          <Text style={styles.avatarEmoji}>👤</Text>
        </View>
        <Text style={styles.h2}>أحمد محمد</Text>
        <Text style={styles.subtitleMain}>مؤمن</Text>
      </View>
    </View>
  );
}

function KhatmahProgressTab() {
  return (
    <View style={styles.tabContainer}>
      <View style={styles.center}>
        <Text style={styles.h3}>تقدم الختمة</Text>
        <View style={styles.circle}>
          <Text style={styles.circlePct}>65%</Text>
        </View>
        <Text style={styles.lightText}>مكتمل من الختمة الحالية</Text>
      </View>
    </View>
  );
}

function LanguageTab() {
  return (
    <View style={styles.tabContainer}>
      <Text style={styles.h3}>اللغة</Text>

      <TouchableOpacity activeOpacity={0.8} style={[styles.btn, styles.btnPrimaryOutline]}>
        <Text style={styles.btnText}>العربية</Text>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.8} style={[styles.btn, styles.btnNeutral]}>
        <Text style={styles.btnText}>English</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function PersonScreen() {
  const [activeTab, setActiveTab] = useState<"profile" | "khatmah" | "language">("profile");

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Top Tabs */}
        <View style={styles.tabsRow}>
          <View style={styles.tabHeaderCell}>
            <View style={[styles.tabUnderline, activeTab === "profile" ? styles.underlineActive : styles.underlineInactive]} />
            <TouchableOpacity onPress={() => setActiveTab("profile")} activeOpacity={0.7}>
              <Text style={[styles.tabLabel, activeTab === "profile" ? styles.tabLabelActive : styles.tabLabelInactive]}>
                الملف الشخصي
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tabHeaderCell}>
            <View style={[styles.tabUnderline, activeTab === "khatmah" ? styles.underlineActive : styles.underlineInactive]} />
            <TouchableOpacity onPress={() => setActiveTab("khatmah")} activeOpacity={0.7}>
              <Text style={[styles.tabLabel, activeTab === "khatmah" ? styles.tabLabelActive : styles.tabLabelInactive]}>
                تقدم الختمة
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tabHeaderCell}>
            <View style={[styles.tabUnderline, activeTab === "language" ? styles.underlineActive : styles.underlineInactive]} />
            <TouchableOpacity onPress={() => setActiveTab("language")} activeOpacity={0.7}>
              <Text style={[styles.tabLabel, activeTab === "language" ? styles.tabLabelActive : styles.tabLabelInactive]}>
                اللغة
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={styles.content}>
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "khatmah" && <KhatmahProgressTab />}
          {activeTab === "language" && <LanguageTab />}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  tabHeaderCell: {
    flex: 1,
    alignItems: "center",
  },
  tabUnderline: {
    height: 2,
    alignSelf: "stretch",
    marginBottom: 10,
  },
  underlineActive: {
    backgroundColor: colors.main,
  },
  underlineInactive: {
    backgroundColor: "#e5e7eb",
  },
  tabLabel: {
    fontSize: 14,
  },
  tabLabelActive: {
    color: colors.main,
    fontWeight: "600",
  },
  tabLabelInactive: {
    color: colors.lightText,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  tabContainer: {
    flex: 1,
    paddingVertical: 20,
  },
  center: {
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.main,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: {
    fontSize: 30,
    color: "#fff",
  },
  h2: {
    fontSize: 20,
    color: colors.text,
    marginBottom: 5,
  },
  subtitleMain: {
    fontSize: 16,
    color: colors.main,
  },
  h3: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 20,
    textAlign: "center",
  },
  lightText: {
    fontSize: 16,
    color: colors.lightText,
    textAlign: "center",
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: colors.main,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  circlePct: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.main,
  },

  btn: {
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 15,
  },
  btnPrimaryOutline: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.main,
  },
  btnNeutral: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  btnText: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
  },
});
