import { useFont } from "@/hooks/useFont";
import { useTokens } from "@/hooks/useTokens";
import React, { useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

export type KebabMenuItem = {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
  color?: string;
};

type Props = {
  items: KebabMenuItem[];
  /** The rendered width of the menu card */
  menuWidth?: number;
  /** Optional extra spacing from the icon */
  offsetY?: number;
  offsetX?: number;
  /** Colors & style */
  cardBackground?: string;
  borderColor?: string;
  shadow?: boolean;
  /** Optional style for the icon wrapper (NOT the menu) */
  triggerContainerStyle?: ViewStyle;
  /** Render prop for the trigger (your kebab icon) */
  renderTrigger: (props: { onPress: () => void; ref: any }) => React.ReactNode;
};

export default function KebabMenuPopover({
  items,
  menuWidth = 220,
  offsetY = 6,
  offsetX = 0,
  cardBackground = "#fff",
  borderColor = "#e5e7eb",
  shadow = true,
  triggerContainerStyle,
  renderTrigger,
}: Props) {
  const triggerRef = useRef<View>(null);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);

  const colors = useTokens();
  const { fontFamily, boldFontFamily } = useFont();

  const { width: screenW, height: screenH } = Dimensions.get("window");

  const handleOpen = () => {
    // Measure trigger position in screen coordinates
    triggerRef.current?.measureInWindow((x, y, w, h) => {
      setAnchor({ x, y, w, h });
      setOpen(true);
    });
  };

  const handleClose = () => setOpen(false);

  // Compute menu position: bottom-right of the trigger
  const menuStyle = useMemo(() => {
    if (!anchor) return { top: 0, left: 0 };
    const top = Math.min(anchor.y + anchor.h + offsetY, screenH - 12); // avoid bottom overflow
    // Align the menu's right edge to the trigger's right edge
    let left = anchor.x + anchor.w - menuWidth + offsetX;

    // clamp horizontally inside screen with small padding
    const pad = 8;
    if (left < pad) left = pad;
    if (left + menuWidth > screenW - pad) left = screenW - pad - menuWidth;

    return { top, left };
  }, [anchor, menuWidth, offsetX, offsetY, screenH, screenW]);

  const handleItemPress = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  return (
    <View style={triggerContainerStyle} collapsable={false} ref={triggerRef}>
      {renderTrigger({ onPress: handleOpen, ref: triggerRef })}

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        {/* Fullscreen overlay to close */}
        <Pressable style={styles.fullOverlay} onPress={handleClose} />

        {/* The menu card */}
        {anchor && (
          <View
            style={[
              styles.menu,
              menuStyle,
              {
                width: menuWidth,
                backgroundColor: colors.cardBackground,
                borderColor: colors.cardBorder,
                ...(shadow ? styles.shadow : null),
              },
            ]}
          >
            <ScrollView
              style={{ maxHeight: 300 }}
              contentContainerStyle={{ paddingVertical: 6 }}
              bounces={false}
            >
              {items.map((item, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => handleItemPress(item.onPress)}
                  style={({ pressed }) => [
                    styles.item,
                    // Add bottom border if not last item
                    idx < items.length - 1
                      ? {
                          borderBottomWidth: 1,
                          borderBottomColor: colors.cardBorder,
                        }
                      : {},
                    { backgroundColor: pressed ? colors.cardBorder : "transparent" },
                  ]}
                >
                  {/* RTL row: text right, icon left */}
                  <Text
                    style={[styles.title, { color: item.color ?? "#111827", fontFamily: boldFontFamily }]}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <View style={{ marginLeft: 8 }}>{item.icon}</View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  fullOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  menu: {
    position: "absolute",
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    zIndex: 9999,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "right",
    flexShrink: 1,
  },
  shadow: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
});
