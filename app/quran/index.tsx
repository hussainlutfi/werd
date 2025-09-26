import { useLocalSearchParams, useRouter } from "expo-router";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

// import { PutUserByIdKhatmah, PutUserByIdStrike } from "@/app/utils/apiClient";
import { dummyUserSession } from "@/data/user";
import { useFont } from "@/hooks/useFont";
import { useTokens } from "@/hooks/useTokens";
import { NewAyah } from "@/types/werd";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getArabicNumber, getInitialWerdStartPoint } from "../../utils/werdApi";

export default function QuranPage() {
  const router = useRouter();
  const { start, quantity, type, isFinished } = useLocalSearchParams<{
    start?: string;
    quantity?: string;
    type?: string;
    isFinished?: string;
  }>();

  const isCompleted = isFinished === "true";
  const [ayahs, setAyahs] = useState<NewAyah[]>([]);
  const [loadingAyahs, setLoadingAyahs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const user = dummyUserSession;
  const { hafsFontFamily, fontFamily, boldFontFamily } = useFont();
  const colors = useTokens();

  // Redirect if params are missing
  useEffect(() => {
    if (!start || !quantity || !type) {
      router.replace("/");
    }
  }, [router, start, quantity, type]);

  // Compute current quarter
  const current = useMemo(
    () =>
      getInitialWerdStartPoint({
        startPoint: Number(start ?? 0),
        quantity: Number(quantity ?? 0),
        type: type ?? "PAGE",
      }),
    [start, quantity, type]
  );

  // Split ayahs into sections by surah
  const sections = useMemo(() => {
    const out: { surahName: string; verses: NewAyah[] }[] = [];
    let currentSec: { surahName: string; verses: NewAyah[] } | null = null;

    for (const a of ayahs) {
      if (!currentSec || a.numberInSurah === 1) {
        currentSec = { surahName: a.surahName, verses: [] };
        out.push(currentSec);
      }
      currentSec.verses.push(a);
    }
    return out;
  }, [ayahs]);

  //   const handleCompleteReading = async () => {
  //     setOpen(false);

  //     const completedQuarter: Quarter = {
  //       isDone: true,
  //       date: new Date().toISOString(),
  //     };

  //     if (!user?.khatmah?.khatmahType) {
  //       throw new Error("User khatmahType is undefined");
  //     }

  //     await PutUserByIdKhatmah(user?.uid || "", {
  //       ...user?.khatmah,
  //       khatmahType: user.khatmah.khatmahType,
  //       quarters: {
  //         ...user?.khatmah?.quarters,
  //         [current]: completedQuarter,
  //       },
  //     });

  //     if (user?.khatmah?.currentQuarter === current) {
  //       await PutUserByIdStrike({
  //         userId: user?.uid || "",
  //         strike: (user?.strike ?? 0) + 1,
  //         wasting: 0,
  //         points:
  //           (user?.points ?? 0) +
  //           getWerdPoints({ quantity: Number(quantity ?? 0), type: type! }),
  //         isPoniting: true,
  //       });
  //     }

  //     await fetchUser(user?.uid || "");
  //     router.replace("/");
  //   };

  const fetchQuarterAyas = async () => {
    const endpoint =
      type === "HEZB"
        ? "https://www.werdq.com/api/quran/quarter-hezb"
        : "https://www.werdq.com/api/quran/page";
    const url = `${endpoint}?start=${start}&quantity=${quantity}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch quarter data");

    const data = (await response.json()) as NewAyah[];
    return data;
  };

  const [showSizeBar, setShowSizeBar] = useState(false);
  const [fontSize, setFontSize] = useState(20);

  // Fetch ayahs on mount
  useEffect(() => {
    const getAyahs = async () => {
      if (!start || !quantity || !type) return;
      try {
        setLoadingAyahs(true);
        setError(null);
        const result = await fetchQuarterAyas();
        setAyahs(result);
      } catch (e) {
        setError(String(e) ?? "حدث خطأ أثناء جلب البيانات");
      } finally {
        setLoadingAyahs(false);
      }
    };
    getAyahs();
  }, [start, quantity, type]);

  if (!start || !quantity || !type) {
    return null;
  }
  // Load font size on mount
  useEffect(() => {
    (async () => {
      try {
        const storedFontSize = await AsyncStorage.getItem("fontSize");
        if (storedFontSize !== null) {
          setFontSize(Number(storedFontSize));
        } else {
          await AsyncStorage.setItem("fontSize", "20");
          setFontSize(20);
        }
      } catch (e) {
        console.error("Failed to load fontSize:", e);
        setFontSize(20);
      }
    })();
  }, []);

  // Save font size whenever it changes
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem("fontSize", fontSize.toString());
      } catch (e) {
        console.error("Failed to save fontSize:", e);
      }
    })();
  }, [fontSize]);

  return (
    <View style={{ flex: 1, paddingTop: 40 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
      >
        {/* Back button */}
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color="#6b7280" />
            <Text style={[styles.backText, { color: colors.subText }]}>
              الرئيسية
            </Text>
          </Pressable>
          <Pressable onPress={() => setShowSizeBar((prev) => !prev)}>
            <MaterialIcons name="format-size" size={32} color={colors.tint} />
          </Pressable>
        </View>
        {loadingAyahs && (
          <Text
            style={{
              textAlign: "center",
              color: colors.text,
              marginBottom: 12,
            }}
          >
            ...جاري التحميل
          </Text>
        )}
        {error && (
          <Text
            style={{
              textAlign: "center",
              color: colors.pointsDown,
              marginBottom: 12,
            }}
          >
            {"حدث خطأ في التحميل، الرجاء المحاولة لاحقاً."}
          </Text>
        )}

        {sections.map((section, idx) => (
          <Fragment key={idx}>
            {section.verses[0].numberInSurah === 1 && (
              <View style={{ alignItems: "center", marginBottom: 16, gap: 12 }}>
                <Text
                  style={{
                    fontSize: 28,
                    fontFamily: hafsFontFamily,
                    color: colors.text,
                  }}
                >
                  {section.surahName}
                </Text>
                <Text
                  style={{
                    fontSize: 26,
                    fontFamily: hafsFontFamily,
                    color: colors.text,
                  }}
                >
                  {"﷽"}
                </Text>
              </View>
            )}

            <Text
              style={[
                styles.ayahText,
                { fontFamily: hafsFontFamily, fontSize: fontSize },
              ]}
            >
              {section.verses.map((ayah, i) => (
                <Text
                  key={ayah.number}
                  style={{ color: colors.text, textAlign: "justify" }}
                >
                  {i === 0 && ayah.numberInSurah === 1
                    ? ayah.text.replace(
                        /^\uFEFF?بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/u,
                        ""
                      )
                    : ayah.text}{" "}
                  <Text
                    style={[
                      styles.ayahNumber,
                      { fontFamily: hafsFontFamily, color: colors.text },
                    ]}
                  >
                    {getArabicNumber(ayah.numberInSurah)}
                  </Text>{" "}
                </Text>
              ))}
            </Text>
          </Fragment>
        ))}
      </ScrollView>

      {/* Bottom action */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        {showSizeBar && (
          <View
            style={{
              backgroundColor: colors.cardBackground,
              padding: 12,
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row", gap: 16 }}>
              <Pressable
                onPress={() => setFontSize((s) => Math.max(12, s - 4))}
                style={{ padding: 8 }}
              >
                <Ionicons name="remove" size={24} color={colors.tint} />
              </Pressable>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: boldFontFamily,
                  color: colors.tint,
                  alignSelf: "center",
                }}
              >
                {fontSize}
              </Text>
              <Pressable
                onPress={() => setFontSize((s) => Math.min(40, s + 4))}
                style={{ padding: 8 }}
              >
                <Ionicons name="add" size={24} color={colors.tint} />
              </Pressable>
            </View>
          </View>
        )}
        <Pressable
          onPress={() => {
            if (isCompleted) {
              router.replace("/");
              return;
            }
            setOpen(true);
            // handleCompleteReading();
          }}
          style={({ pressed }) => [
            [styles.actionBtn, { backgroundColor: colors.tint }],
            pressed && { opacity: 0.9, transform: [{ translateY: -1 }] },
          ]}
        >
          <Text style={styles.actionText}>
            {isCompleted ? "العودة" : "أتممت القراءة"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ayahText: {
    lineHeight: 50,
    textAlign: "right",
    writingDirection: "rtl",
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    paddingRight: 20,
    paddingVertical: 20,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  backText: { color: "#6b7280", fontSize: 14, fontWeight: "600" },

  ayahNumber: {
    marginHorizontal: 4,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    borderTopWidth: 0.5,
    borderColor: "#e5e7eb",
    alignItems: "center",
    paddingVertical: 12,
    paddingBottom: 24,
  },
  actionBtn: {
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    minWidth: "70%",
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
