import { logout } from "@core/modules/auth/api.auth";
import { formatName } from "@core/modules/profiles/utils.profiles";
import Button from "@design/Button/Button";
import useUser from "@functional/auth/useUser";
import ThemedText from "@design/Typography/ThemedText";
import DefaultView from "@design/View/DefaultView";
import { View, StyleSheet, Switch, TouchableOpacity, Text } from "react-native";
import { Colors, Spacing } from "@style/theme";
import { useSettings } from "@core/utils/SettingsContext";
import { getClassById } from "@core/modules/classes/api.classes";
import { useQuery } from "@tanstack/react-query";
import { Class } from "@core/modules/classes/types.classes";
import * as Haptics from "expo-haptics";

const getInitials = (firstName?: string, lastName?: string) => {
  const first = firstName?.charAt(0).toUpperCase() || "";
  const last = lastName?.charAt(0).toUpperCase() || "";
  return first + last;
};

const getColorFromString = (str: string) => {
  const colors = [
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#eab308",
    "#84cc16",
    "#22c55e",
    "#10b981",
    "#14b8a6",
    "#06b6d4",
    "#0ea5e9",
    "#3b82f6",
    "#6366f1",
    "#8b5cf6",
    "#a855f7",
    "#d946ef",
    "#ec4899",
    "#f43f5e",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export default function ProfilePage() {
  const user = useUser();

  const { data: classData } = useQuery<Class | null>({
    queryKey: ["classes", user.class_id],
    queryFn: () => getClassById(user.class_id),
  });

  const {
  isColorBlindMode,
  isSoundEnabled,
  isVibrationEnabled,
  toggleColorBlindMode,
  toggleSound,
  toggleVibration,
} = useSettings();
  const initials = getInitials(user.first_name, user.last_name);
  const avatarColor = getColorFromString(user.email || user.id || "");

  const triggerHaptic = () => {
    if (isVibrationEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

    const triggerHapticVibration = () => {
    if (!isVibrationEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <DefaultView padding={false}>
      <View style={styles.container}>
        <ThemedText style={styles.header}>Your Profile</ThemedText>

        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
            <ThemedText style={styles.initialsText}>{initials}</ThemedText>
          </View>
        </View>

        <Text style={styles.class}>{classData?.name}</Text>

        <View style={styles.infoCard}>
          <ThemedText style={styles.label}>Name</ThemedText>
          <ThemedText style={styles.value}>{formatName(user)}</ThemedText>
        </View>

        <View style={styles.infoCard}>
          <ThemedText style={styles.label}>Email</ThemedText>
          <ThemedText style={styles.value}>{user.email}</ThemedText>
        </View>

        <View style={styles.divider}>
          <TouchableOpacity style={styles.settingCard} onPress={() => {triggerHaptic();   toggleSound();}} activeOpacity={0.7}>
            <View style={styles.settingContent}>
              <View style={styles.settingTextContainer}>
                <ThemedText style={styles.settingLabel}>Sound</ThemedText>
              </View>
              <Switch
                value={isSoundEnabled}
                onValueChange={() => {triggerHaptic(); toggleSound();}}
                trackColor={{ false: Colors.gray["300"], true: Colors.primary["300"] }}
                thumbColor={isSoundEnabled ? Colors.primary["600"] : Colors.white}
                ios_backgroundColor={Colors.gray["300"]}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingCard} onPress={() => {triggerHapticVibration(); toggleVibration();}} activeOpacity={0.7}>
            <View style={styles.settingContent}>
              <View style={styles.settingTextContainer}>
                <ThemedText style={styles.settingLabel}>Vibration</ThemedText>
              </View>
              <Switch
                value={isVibrationEnabled}
                onValueChange={() => {triggerHapticVibration(); toggleVibration();}}
                trackColor={{ false: Colors.gray["300"], true: Colors.primary["300"] }}
                thumbColor={isVibrationEnabled ? Colors.primary["600"] : Colors.white}
                ios_backgroundColor={Colors.gray["300"]}
              />
            </View>
          </TouchableOpacity>
        </View>


        {!user.is_teacher && (
          <TouchableOpacity
            style={[styles.settingCard, styles.colorblindCard]}
            onPress={() => {triggerHaptic(); toggleColorBlindMode();}}
            activeOpacity={0.7}
          >
            <View style={styles.settingContent}>
              <View style={styles.settingTextContainer}>
                <ThemedText style={styles.settingLabel}>
                  Color-Blind Mode
                </ThemedText>
                <ThemedText style={styles.settingDescription}>
                  Show icons for attendance status
                </ThemedText>
              </View>
              <Switch
                value={isColorBlindMode}
                onValueChange={() => {triggerHaptic(); toggleColorBlindMode();}}
                trackColor={{
                  false: Colors.gray["300"],
                  true: Colors.primary["300"],
                }}
                thumbColor={
                  isColorBlindMode ? Colors.primary["600"] : Colors.white
                }
                ios_backgroundColor={Colors.gray["300"]}
              />
            </View>
          </TouchableOpacity>
        )}

        <Button onPress={() => {triggerHaptic(); logout()}}>Log out</Button>
      </View>
    </DefaultView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: Spacing.xl,
  },
  avatarContainer: {
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  divider: {
    display:'flex',
    flexDirection:'row',
    gap:'2%'
  },
  initialsText: {
    fontSize: 48,
    fontWeight: "bold",
    color: Colors.white,
  },
  class: {
    fontSize: 18,
    marginBottom: Spacing.md,
  },
  infoCard: {
    width: "90%",
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: Colors.gray["500"],
    marginBottom: Spacing.xs / 2,
  },
  value: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: "500",
  },
  settingCard: {
    width: "44%",
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  colorblindCard: {
    width:'90%',
  },
  settingContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingTextContainer: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingLabel: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: "500",
    marginBottom: Spacing.xs / 2,
  },
  settingDescription: {
    fontSize: 12,
    color: Colors.gray["500"],
  },
});
