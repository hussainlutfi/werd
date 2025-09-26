// PlanCard.tsx
import { useAppTheme } from "@/hooks/theme/AppThemeProvider";
import { useFont } from "@/hooks/useFont";
import { useTokens } from "@/hooks/useTokens";
import { getArabicNumber } from "@/utils/convetions";
import Feather from "@expo/vector-icons/Feather";
import { Picker } from "@react-native-picker/picker"; // expo-compatible
import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type PlanCardProps = {
  planType?: string; // e.g. "ربع حزب"
  planDays?: number; // e.g. 240
  onEdit?: () => void; // optional
};

const PlanCard: React.FC<PlanCardProps> = ({
  planType = "ربع حزب",
  planDays = 240,
  onEdit,
}) => {
  const colors = useTokens();
  const { fontFamily, boldFontFamily } = useFont();

  const arabicDays = useMemo(() => getArabicNumber(planDays), [planDays]);

  // Add state// --- State for steps
  const [formStep, setFormStep] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState<
    "PAGE" | "HEZB" | "JUZ" | ""
  >("");
  const [selectedQuantity, setSelectedQuantity] = useState<number>(0);

  // Map for dynamic choices
  const quantityMap: Record<string, number[]> = {
    PAGE: [1, 2],
    HEZB: [1, 2, 3],
    JUZ: [1, 2, 3],
  };

  const getChoice = ({
    selectedType,
    quantity,
  }: {
    selectedType: "PAGE" | "HEZB" | "JUZ" | "";
    quantity: number;
  }) => {
    return selectedType === "PAGE"
      ? quantity === 1
        ? "صفحة"
        : "صفحتين"
      : selectedType === "HEZB"
      ? quantity === 1
        ? "ربع حزب"
        : quantity === 2
        ? "نصف حزب"
        : quantity === 3
        ? "ثلاثة أرباع حزب"
        : "حزب"
      : selectedType === "JUZ"
      ? quantity === 1
        ? "جزء"
        : quantity === 2
        ? "جزئين"
        : quantity === 3
        ? "ثلاثة أجزاء"
        : "أجزاء"
      : "";
  };

  const { colorScheme } = useAppTheme();
  const scheme = colorScheme === "dark" ? "dark" : "light";

  // --- press-scale (like ProgressCard)
  const pressScale = useRef(new Animated.Value(1)).current;
  const onPressIn = () => {
    Animated.spring(pressScale, {
      toValue: 0.98,
      useNativeDriver: true,
      friction: 8,
      tension: 80,
    }).start();
  };
  const onPressOut = () => {
    Animated.spring(pressScale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 80,
    }).start();
  };

  // --- dialog animation (same timings/feel as ProgressCard)
  const [visible, setVisible] = useState(false);
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const dialogScale = useRef(new Animated.Value(0.92)).current;

  const openDialog = () => {
    setVisible(true);
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0.6,
        duration: 350,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(dialogScale, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  };

  const closeDialog = () => {
    // Close instantly without animation
    backdropOpacity.setValue(0);
    dialogScale.setValue(0.92); // reset to initial for next open
    setVisible(false);
  };

  return (
    <>
      {/* Whole card is tappable */}
      <Pressable
        onPress={openDialog}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessible
        accessibilityRole="button"
        accessibilityLabel={`خطة القراءة، نوع الخطة ${planType}، أيام الخطة ${arabicDays}. اضغط لعرض التفاصيل`}
      >
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.cardBorder,
              shadowColor: colors.rewayahCardShadow,
              transform: [{ scale: pressScale }],
            },
          ]}
        >
          <ImageBackground
            imageStyle={styles.heroImage}
            resizeMode="cover"
            source={require("../assets/images/quranRespect.png")}
            style={StyleSheet.absoluteFill}
          />

          {/* Content */}
          <View style={styles.content}>
            <View
              style={{
                flexDirection: "row-reverse",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text
                style={[
                  styles.title,
                  { color: colors.text, fontFamily: boldFontFamily },
                ]}
              >
                خطة القراءة
              </Text>

              {/* Edit still works too */}
              <Pressable
                onPress={openDialog}
                accessibilityLabel="تعديل الخطة"
                hitSlop={8}
              >
                <Feather name="edit-2" size={20} color={colors.subText} />
              </Pressable>
            </View>

            <View
              style={{
                flexDirection: "row-reverse",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text
                style={[
                  styles.subtitle,
                  { color: colors.subText, fontFamily: boldFontFamily },
                ]}
              >
                {planType}
              </Text>

              <Text
                style={[
                  styles.days,
                  { color: colors.text, fontFamily: boldFontFamily },
                ]}
              >
                {arabicDays} يوم
              </Text>
            </View>
          </View>
        </Animated.View>
      </Pressable>

      {/* Dialog */}
      <Modal
        visible={visible}
        transparent
        statusBarTranslucent
        animationType="none"
        onRequestClose={closeDialog}
      >
        {/* Backdrop */}
        <Pressable style={StyleSheet.absoluteFill} onPress={closeDialog}>
          <Animated.View
            style={[
              styles.backdrop,
              {
                backgroundColor: colors.fadedBackground,
                opacity: backdropOpacity,
              },
            ]}
          />
        </Pressable>

        {/* Dialog card that looks like the original card */}
        <View style={styles.centerWrap} pointerEvents="box-none">
          <Animated.View
            style={[
              styles.dialogCard,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.cardBorder,
                shadowColor: colors.rewayahCardShadow,
                transform: [{ scale: dialogScale }],
              },
            ]}
          >
            <ImageBackground
              imageStyle={styles.dialogHeroImage}
              resizeMode="cover"
              source={require("../assets/images/quranRespect.png")}
              style={StyleSheet.absoluteFill}
            />

            <View style={styles.dialogContent}>
              <View
                style={{
                  backgroundColor:
                    scheme === "dark"
                      ? colors.background + "70"
                      : colors.cardBackground + "80",
                  borderRadius: 12,
                  padding: 16,
                  gap: 16,
                }}
              >
                {formStep === 1 && (
                  <>
                    {/* Step 1: Current Plan */}
                    <Text
                      style={[
                        styles.title,
                        {
                          color: colors.text,
                          fontFamily: boldFontFamily,
                          marginBottom: 8,
                        },
                      ]}
                    >
                      الخطة الحالية
                    </Text>

                    {/* Same content you already have */}
                    <View style={styles.content}>
                      <View
                        style={{
                          flexDirection: "row-reverse",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <Text
                          style={[
                            styles.subtitle,
                            {
                              color: colors.text,
                              fontFamily: boldFontFamily,
                            },
                          ]}
                        >
                          {planType}
                        </Text>

                        <Text
                          style={[
                            styles.days,
                            { color: colors.text, fontFamily: boldFontFamily },
                          ]}
                        >
                          {arabicDays} يوم
                        </Text>
                      </View>
                    </View>

                    {/* Button to go to Step 2 */}
                    <Pressable
                      style={[
                        styles.actionBtn,
                        {
                          backgroundColor: colors.tint,
                          borderTopRightRadius: 16,
                          borderBottomLeftRadius: 16,
                        },
                      ]}
                      onPress={() => setFormStep(2)}
                    >
                      <Text
                        style={[
                          styles.actionText,
                          {
                            color: colors.background,
                            fontFamily: boldFontFamily,
                          },
                        ]}
                      >
                        عدل الخطة
                      </Text>
                    </Pressable>
                  </>
                )}

                {formStep === 2 && (
                  <>
                    {/* Step 2: Form */}
                    <Text
                      style={[
                        styles.title,
                        {
                          color: colors.text,
                          fontFamily: boldFontFamily,
                          marginBottom: 8,
                        },
                      ]}
                    >
                      اختر الخطة
                    </Text>

                    {/* Dropdown Picker */}
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: colors.cardBorder,
                        borderRadius: 12,
                        overflow: "hidden",
                      }}
                    >
                      <Picker
                        selectedValue={selectedType}
                        onValueChange={(value) => {
                          setSelectedType(value);
                          setSelectedQuantity(0);
                        }}
                        dropdownIconColor={colors.text} // changes only the chevron
                        style={{
                          color: colors.text,
                          fontFamily,
                          backgroundColor:
                            scheme === "dark"
                              ? colors.background + "70"
                              : colors.cardBackground + "80",
                        }} // changes the text
                      >
                        <Picker.Item
                          label="اختر نوعاً"
                          value=""
                          color={colors.text}
                        />
                        <Picker.Item
                          label="صفحة"
                          value="PAGE"
                          color={colors.text}
                        />
                        <Picker.Item
                          label="حزب"
                          value="HEZB"
                          color={colors.text}
                        />
                        <Picker.Item
                          label="جزء"
                          value="JUZ"
                          color={colors.text}
                        />
                      </Picker>
                    </View>

                    {/* Dynamic Quantity tiles */}
                    {selectedType && (
                      <View
                        style={{
                          flexDirection: "column",
                          flexWrap: "wrap",
                          gap: 12,
                          width: "100%",
                        }}
                      >
                        {quantityMap[selectedType].map((q) => (
                          <Pressable
                            key={q}
                            onPress={() => setSelectedQuantity(q)}
                            style={[
                              styles.choiceCard,
                              {
                                borderColor:
                                  selectedQuantity === q
                                    ? (colors as any).tint ?? colors.text
                                    : colors.cardBorder,
                                backgroundColor:
                                  selectedQuantity === q
                                    ? (colors as any).tint ?? colors.text
                                    : colors.cardBackground,
                              },
                            ]}
                          >
                            <Text
                              style={{
                                color:
                                  selectedQuantity === q
                                    ? colors.cardBackground
                                    : colors.text,
                                fontFamily: boldFontFamily,
                              }}
                            >
                              {getChoice({ selectedType, quantity: q })}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                    )}

                    {/* Actions row */}
                    <View
                      style={{
                        // flexDirection: "row-reverse",
                        justifyContent: "center",
                        gap: 10,
                        marginTop: 20,
                      }}
                    >
                      <Pressable
                        style={[
                          styles.actionBtn,
                          {
                            borderColor: colors.cardBackground,
                            backgroundColor: colors.cardBackground,
                            borderTopRightRadius: 16,
                          },
                        ]}
                        onPress={() => setFormStep(1)}
                      >
                        <Text
                          style={[
                            styles.actionText,
                            { color: colors.text, fontFamily: boldFontFamily },
                          ]}
                        >
                          رجوع
                        </Text>
                      </Pressable>

                      <Pressable
                        style={[
                          styles.actionBtn,
                          {
                            backgroundColor:
                              (colors as any).tint ?? colors.text,

                            borderBottomLeftRadius: 16,
                          },
                        ]}
                        onPress={() => {
                          // TODO: save logic
                          closeDialog();
                        }}
                      >
                        <Text
                          style={[
                            styles.actionText,
                            {
                              color: colors.background,
                              fontFamily: boldFontFamily,
                            },
                          ]}
                        >
                          حفظ
                        </Text>
                      </Pressable>
                    </View>
                  </>
                )}
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  // --- base card (unchanged sizing so it matches siblings)
  card: {
    borderRadius: 16,
    borderWidth: 1,
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 1,
    marginHorizontal: 10,
    marginVertical: 8,
    position: "relative",
    overflow: "hidden",
    height: 90,
  },
  content: {
    padding: 16,
    gap: 20,
    alignItems: "flex-end",
  },
  title: { fontSize: 20, textAlign: "right" },
  subtitle: { fontSize: 14, textAlign: "right" },
  days: { fontSize: 16, textAlign: "right" },
  heroImage: {
    opacity: 0.15,
    transform: [{ scale: 1.5 }, { translateX: -50 }],
  },

  // --- dialog styles (card-like)
  backdrop: { flex: 1 },
  centerWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  choiceCard: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 90,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  dialogCard: {
    width: "92%",
    maxWidth: 600,
    borderRadius: 16, // same radius as card
    borderWidth: 1, // same border as card
    overflow: "hidden", // to clip the hero image
    elevation: 10,
  },
  dialogHeroImage: {
    opacity: 0.12, // a bit softer in dialog
    transform: [{ scale: 1.6 }, { translateX: -40 }],
  },
  dialogContent: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    gap: 10,
  },
  actionsRow: {
    marginTop: 18,
    flexDirection: "row-reverse",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderWidth: 1,
  },
  actionText: { fontSize: 14, textAlign: "center" },
});

export default PlanCard;
