import { dummyUserSession } from "@/data/user";
import { useFont } from "@/hooks/useFont";
import { useTokens } from "@/hooks/useTokens";
import { NewAyah } from "@/types/werd";
import React, { useMemo, useState } from "react";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import {
  formatDate,
  getWerdName,
  getWerdStartPoint,
} from "../../utils/convetions";
import Accordion from "../Accordion";
import WerdCard, { MainWerdType } from "./WerdCard";

type WerdDetail = {
  start: NewAyah;
  end: NewAyah;
  loading: boolean;
};
interface MainWerdProps {
  type: MainWerdType;
  ayah: string;
  surah: string;
  ayahNumber: string;
  page: string;
}

export default function UncompletedWerds() {
  const missedQuarters = useMemo(
    () =>
      Object.entries(dummyUserSession?.khatmah?.quarters || {})
        .filter(([, q]: any) => q.isDone === false)
        .map(([qNum, q]: any) => ({ quarterNumber: Number(qNum), ...q })),
    [dummyUserSession]
  );

  const [expanded, setExpanded] = useState<number | null>(null);
  const [werdDetails, setWerdDetails] = useState<Record<string, WerdDetail>>(
    {}
  );

  const isMobile = true; // Expo mobile by default; keep for width-based tweaks if needed
  const { width } = useWindowDimensions();
  const type = dummyUserSession?.khatmah?.khatmahType || "HEZB";
  const quantity = dummyUserSession?.khatmah?.typeQuantity || 1;

  const colors = useTokens();
  const { boldFontFamily } = useFont();

  const isCompleted = false; // Replace with actual logic to determine if the user has completed today's Werd

  const details1: MainWerdProps = {
    type: MainWerdType.START,
    ayah: "وَقاتِلوهُم حَتّى لا تَكونَ فِتنَةٌ وَيَكونَ الدّينُ لِلَّهِ فَإِنِ انتَهَوا فَلا عُدوانَ إِلّا عَلَى الظّالِمينَ",
    surah: "سورة الفاتحة",
    ayahNumber: "1",
    page: "1",
  };

  const details2: MainWerdProps = {
    type: MainWerdType.END,
    ayah: "وَقاتِلوهُم حَتّى لا تَكونَ فِتنَةٌ وَيَكونَ الدّينُ لِلَّهِ فَإِنِ انتَهَوا فَلا عُدوانَ إِلّا عَلَى الظّالِمينَ",
    surah: "سورة الناس",
    ayahNumber: "6",
    page: "604",
  };

  const handleToggle = async (panelId: number) => {
    const willExpand = expanded !== panelId;
    setExpanded(willExpand ? panelId : null);

    if (willExpand && !werdDetails[String(panelId)]) {
      // initialize loading
      setWerdDetails((prev) => ({
        ...prev,
        [panelId]: {
          start: { surah: "", ayahNumber: "", page: "", text: "" } as any,
          end: { surah: "", ayahNumber: "", page: "", text: "" } as any,
          loading: true,
        },
      }));

      //   try {
      //     const startPoint = getWerdStartPoint({
      //       startPoint: panelId,
      //       quantity,
      //       type,
      //     });

      //     const details = await getWerdEnds({
      //       startPoint,
      //       quantity,
      //       type,
      //     });

      //     setWerdDetails((prev) => ({
      //       ...prev,
      //       [panelId]: { ...(details as any), loading: false },
      //     }));
      //   } catch (e) {
      //     console.error("Error loading werd details:", e);
      //     setWerdDetails((prev) => ({
      //       ...prev,
      //       [panelId]: {
      //         start: {
      //           surah: "خطأ",
      //           ayahNumber: "",
      //           page: "",
      //           text: "حدث خطأ في التحميل",
      //         } as any,
      //         end: {
      //           surah: "خطأ",
      //           ayahNumber: "",
      //           page: "",
      //           text: "حدث خطأ في التحميل",
      //         } as any,
      //         loading: false,
      //       },
      //     }));
      //   }
    }
  };

  const openReadWerd = (qNum: number) => {
    const start = getWerdStartPoint({ startPoint: qNum, quantity, type });
    const url = `/quran/?type=${type}&start=${start}&quantity=${quantity}&isFinished=false`;
    // If you're using expo-router, replace with `router.push(url)`
    // For web or deep-link, Linking can handle absolute URLs; adjust as needed.
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.heading}>أوراد غير مكتملة</Text>
      </View>

      {Array.isArray(missedQuarters) && missedQuarters.length > 0 ? (
        <View style={{ rowGap: 12 }}>
          {missedQuarters.map((werd, index) => {
            const isExpanded = expanded === werd.quarterNumber;
            const details = werdDetails[String(werd.quarterNumber)];
            const title = getWerdName({
              startPoint: getWerdStartPoint({
                startPoint: werd.quarterNumber,
                quantity,
                type,
              }),
              type,
            });

            return (
              <View key={werd.quarterNumber} style={{ opacity: 1 }}>
                <Accordion
                  title={title}
                  subtitle={formatDate(werd.date)}
                  expanded={isExpanded}
                  onToggle={() => handleToggle(werd.quarterNumber)}
                >
                  {/* {!details || details.loading ? (
                    <View style={styles.loadingBox}>
                      <ActivityIndicator size="small" color="#016630" />
                    </View>
                  ) : 
                  (
                    <View style={{ rowGap: 16 }}>
                      <View
                        style={[
                          styles.cardsRow,
                          { flexDirection: width >= 768 ? "row" : "column" },
                        ]}
                      >
                        <View style={{ flex: 1 }}>
                          <WerdCard
                            type={details1.type}
                            ayah={details1.ayah}
                            surah={details1.surah}
                            ayahNumber={details1.ayahNumber}
                            page={details1.page}
                          />
                        </View>

                        <View style={{ flex: 1 }}>
                          <WerdCard
                            type={details2.type}
                            ayah={details2.ayah}
                            surah={details2.surah}
                            ayahNumber={details2.ayahNumber}
                            page={details2.page}
                          />
                        </View>
                      </View>

                      <View style={{ alignItems: "center", marginTop: 8 }}>
                        <Pressable
                          onPress={() => openReadWerd(werd.quarterNumber)}
                          style={({ pressed }) => [
                            styles.ctaButton,
                            pressed && {
                              transform: [{ translateY: -2 }],
                              opacity: 0.95,
                            },
                            { width: isMobile ? "100%" : "60%" },
                          ]}
                        >
                          <Text style={styles.ctaText}>اقرأ الورد</Text>
                        </Pressable>
                      </View>
                    </View>
                  )} */}
                  <View style={{ rowGap: 16 }}>
                    <View
                      style={[
                        styles.cardsRow,
                        { flexDirection: width >= 768 ? "row" : "column" },
                      ]}
                    >
                      <View style={{}}>
                        <WerdCard
                          type={details1.type}
                          ayah={details1.ayah}
                          surah={details1.surah}
                          ayahNumber={details1.ayahNumber}
                          page={details1.page}
                        />
                        <WerdCard
                          type={details2.type}
                          ayah={details2.ayah}
                          surah={details2.surah}
                          ayahNumber={details2.ayahNumber}
                          page={details2.page}
                        />
                      </View>
                    </View>

                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: colors.tint }]}
                      onPress={() => {
                        // Replace with your navigation logic, e.g. using React Navigation
                        // navigation.navigate('Quran', { type, start: startPoint, quantity, isFinished: isCompleted });
                      }}
                    >
                      <Text
                        style={{
                          paddingVertical: 6,
                          color: "#fff",
                          fontSize: 16,
                          fontFamily: boldFontFamily,
                        }}
                      >
                        {isCompleted ? "العودة للورد" : "اقرأ الورد"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Accordion>
              </View>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyBox}>
          <Text style={{ color: "#4B5563" }}>
            ما شاء الله! لا توجد أوراد غير مكتملة
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignSelf: "center",
    paddingTop: 8,
    direction: "rtl",
  },
  heading: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111827",
    textAlign: "center",
  },
  loadingBox: {
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  cardsRow: { gap: 12 },
  ctaButton: {
    backgroundColor: "#016630",
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#016630",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    minWidth: 180,
    alignItems: "center",
  },
  ctaText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  emptyBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  button: {
    marginTop: 16,
    paddingHorizontal: 32,
    paddingVertical: 6,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    alignItems: "center",
    width: "100%",
  },
});
