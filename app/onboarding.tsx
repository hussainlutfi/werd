// onboarding.tsx
import OnboardingContent from "@/components/onboardingContent";
import PhoneSheet from "@/components/phone-sheet";
import { useFont } from "@/hooks/useFont";
import { useTokens } from "@/hooks/useTokens";
import BottomSheet from "@gorhom/bottom-sheet";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

type Step = {
  id: number;
  image: any;
  content: React.ReactNode;
};

const steps: Step[] = [
  {
    id: 1,
    image: require("../assets/images/quran-werd.png"),
    content: <OnboardingContent step={1} />,
  },
  {
    id: 2,
    image: require("../assets/images/ManReadingQ.png"),
    content: <OnboardingContent step={2} />,
  },
  {
    id: 3,
    image: require("../assets/images/notReading.png"),
    content: <OnboardingContent step={3} />,
  },
  {
    id: 4,
    image: require("../assets/images/quran-motivation.png"),
    content: <OnboardingContent step={4} />,
  },
  {
    id: 5,
    image: require("../assets/images/quran-plan.png"),
    content: <OnboardingContent step={5} />,
  },
];

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const [isActive, setIsActive] = useState(false);

  const handleNext = () => {
    if (currentIndex < steps.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      flatListRef.current?.scrollToIndex({ index: currentIndex - 1 });
    }
  };

  const handleLogin = () => {
    console.log("Navigate to Login/Register screen");
  };

  const colors = useTokens();
  const { fontFamily, boldFontFamily } = useFont();

  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleOpenBottomSheet = () => {
    bottomSheetRef.current?.expand();
    setIsActive(true);
  };
  const handleCloseBottomSheet = () => {
    bottomSheetRef.current?.close();
    setIsActive(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={steps}
        ref={flatListRef}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        scrollEnabled={false} // 🚫 disable manual swipe
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.step}>
            {/* Top half image */}
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="cover"
            />

            {/* Bottom content */}
            <View style={styles.textContainer}>
              {/* Background logo */}

              {item.content}
            </View>
          </View>
        )}
      />
      <View style={{ marginBottom: 40, zIndex: 2, paddingHorizontal: 20 }}>
        {!isActive && (
          <>
            {/* Pagination Dots */}
            <View style={styles.dotsContainer}>
              {steps.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        index === currentIndex
                          ? colors.tint
                          : colors.tabIconDefault,
                      opacity: index === currentIndex ? 1 : 0.5,
                    },
                  ]}
                />
              ))}
            </View>
            {/* Navigation buttons */}

            <View
              style={[
                styles.buttonsRow,
                {
                  justifyContent:
                    currentIndex === 0 ? "flex-end" : "space-between",
                },
              ]}
            >
              {currentIndex > 0 && (
                <TouchableOpacity
                  style={[
                    styles.navButton,
                    {
                      backgroundColor: colors.tabIconDefault,
                      borderTopRightRadius: 16,
                      borderBottomLeftRadius: 16,
                    },
                  ]}
                  onPress={handlePrevious}
                >
                  <Text
                    style={[
                      styles.navText,
                      { fontFamily, color: colors.cardBackground },
                    ]}
                  >
                    السابق
                  </Text>
                </TouchableOpacity>
              )}

              {currentIndex < steps.length - 1 ? (
                <TouchableOpacity
                  style={[
                    styles.navButton,
                    {
                      backgroundColor: colors.tint,
                      borderTopRightRadius: 16,
                      borderBottomLeftRadius: 16,
                    },
                  ]}
                  onPress={handleNext}
                >
                  <Text
                    style={[
                      styles.navText,
                      { fontFamily, color: colors.cardBackground },
                    ]}
                  >
                    التالي
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.navButton,
                    {
                      backgroundColor: colors.tint,
                      borderTopRightRadius: 16,
                      borderBottomLeftRadius: 16,
                    },
                  ]}
                  onPress={handleOpenBottomSheet}
                >
                  <Text
                    style={[styles.navText, { fontFamily: boldFontFamily, color: colors.cardBackground }]}
                  >
                    التسجيل
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </View>
      <Image source={require("../assets/logo.png")} style={styles.bgIcon} />
      <PhoneSheet
        bottomSheetRef={bottomSheetRef}
        handleCloseBottomSheet={handleCloseBottomSheet}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1,},
  step: { width, height, alignItems: "center" },
  image: {
    width: "100%",
    height: height * 0.5,
  },
  textContainer: {
    flex: 1,
    padding: 20,
    paddingTop: "10%",
    justifyContent: "flex-start",
  },
  bgIcon: {
    position: "absolute",
    opacity: 0.1,
    bottom: -40,
    right: 190,
    zIndex: 1,
    width: 400,
    height: 400,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  buttonsRow: {
    flexDirection: "row",
    marginTop: 30,
  },
  navButton: {
    marginHorizontal: 5,
    paddingVertical: 9,
    width: "40%",
  },
  navText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    paddingVertical: 2,
    textAlign: "center",
  },
});
