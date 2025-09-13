import { useFont } from "@/hooks/useFont";
import { useTokens } from "@/hooks/useTokens";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "react-native-paper";

type UserData = {
  name?: string;
  phone?: string;
  points?: number;
};

type ProfileHeaderProps = {
  userData: UserData;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userData }) => {
  const colors = useTokens();
  const { fontFamily, boldFontFamily } = useFont();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBackground,
          shadowColor: colors.rewayahCardShadow,
        },
      ]}
    >
      <View style={styles.cardContent}>
        <View style={[styles.row, { flexDirection: "column" }]}>
          {/* User Info */}
          <View style={[styles.userInfo, { alignItems: "center" }]}>
            <Avatar.Text
              size={50}
              label={userData.name?.charAt(0) || "أ"}
              style={{ backgroundColor: colors.avatarBackground }}
              labelStyle={{
                fontSize: 16,
                fontWeight: "bold",
                color: colors.subText,
              }}
            />
            <Text
              style={[
                styles.name,
                {
                  fontSize: 20,
                  fontFamily: boldFontFamily,
                  color: colors.text,
                },
              ]}
            >
              {userData.name || "المستخدم"}
            </Text>

            {/* Phone Row */}
            <View
              style={[
                styles.row,
                {
                  justifyContent: "center",
                },
              ]}
            >
              <Text
                style={[styles.phone, { color: colors.subText }]}
                numberOfLines={1}
              >
                {userData.phone || ""}
              </Text>
              <MaterialIcons
                name="phone"
                size={16}
                color={colors.subText}
                style={{ marginRight: 4 }}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    margin: 8,
  },
  cardContent: {
    padding: 16,
  },
  row: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },

  userInfo: {
    flex: 1,
    textAlign: "right",
    marginTop: 8,
    gap: 10,
  },
  name: {
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    color: "#6b7280",
    writingDirection: "ltr",
  },
  points: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
});

export default ProfileHeader;
