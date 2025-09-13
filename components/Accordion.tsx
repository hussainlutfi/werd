import { useTokens } from "@/hooks/useTokens";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type AccordionProps = {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

export default function Accordion({
  title,
  subtitle,
  expanded,
  onToggle,
  children,
}: AccordionProps) {
  const [contentHeight, setContentHeight] = useState(0);
  const heightAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const colors = useTokens();

  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: expanded ? contentHeight : 0,
      duration: 220,
      useNativeDriver: false,
    }).start();

    Animated.timing(rotateAnim, {
      toValue: expanded ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [expanded, contentHeight, heightAnim, rotateAnim]);

  const onContentLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h !== contentHeight) setContentHeight(h);
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.cardBackground }]}>
      <Pressable
        onPress={onToggle}
        style={{ display: "flex", width: "100%" }}
        android_ripple={{ color: "rgba(1,102,48,0.08)" }}
      >
        <View style={[styles.header]}>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            {typeof title === "string" ? (
              <Text style={[styles.title, { color: colors.text }]}>
                {title}
              </Text>
            ) : (
              title
            )}
            {subtitle ? (
              typeof subtitle === "string" ? (
                <Text style={[styles.subtitle, { color: colors.subText }]}>
                  {subtitle}
                </Text>
              ) : (
                subtitle
              )
            ) : null}
          </View>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <MaterialIcons name="expand-more" size={28} color={colors.subText} />
          </Animated.View>
        </View>
      </Pressable>

      {/* measure once, then animate height */}
      <Animated.View style={{ height: heightAnim, overflow: "hidden" }}>
        <View onLayout={onContentLayout} style={styles.content}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(234, 179, 8, 0.1)",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },

  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },
  subtitle: {
    color: "#4B5563",
    fontSize: 13,
    marginTop: 4,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    height: 300,
  },
});
