import { CameraView, BarcodeScanningResult } from "expo-camera";
import { useState } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import * as Haptics from "expo-haptics";
import { Colors, Spacing } from "@style/theme";
import { createAttendance, checkAttendanceExists } from "@core/modules/attendances/api.attendances";
import { useMutation } from "@tanstack/react-query";
import { AttendanceInsert } from "@core/modules/attendances/types.attendances";
import useUser from "@functional/auth/useUser";
import { useAudioPlayer } from 'expo-audio';
import { useSettings } from "@core/utils/SettingsContext";


const audioAccept = require('@assets/sfx/accept_sfx.mp3');
const audioError = require('@assets/sfx/error_sfx.mp3');

export default function QrScanner() {
  const [scanned, setScanned] = useState(false);
  const user = useUser();
  
  const acceptSound = useAudioPlayer(audioAccept);
  const errorSound = useAudioPlayer(audioError);
  
  const { isSoundEnabled, isVibrationEnabled } = useSettings();

  const attendanceMutation = useMutation({
    mutationFn: createAttendance,
  });

  const handleQrCodeScanned = async ({ data }: BarcodeScanningResult) => {
    if (!scanned) setScanned(true);

    try {
      const jsonData = JSON.parse(data);

      setScanned(true);

      const date = jsonData.timestamp;
      
      if (Date.now() - new Date(date).getTime() > 35000) {
        throw new Error("QR code is expired");
      }

      const attendanceDate = new Date(date);
      const existingAttendance = await checkAttendanceExists(
        jsonData.profileId,
        attendanceDate
      );

      if (existingAttendance) {
        throw new Error("Student is already present.");
      }

      const attendanceData: AttendanceInsert = {
        campus_id: jsonData.campusId,
        date: date,
        student_id: jsonData.profileId,
        teacher_id: user.id,
      };

      await attendanceMutation.mutateAsync(attendanceData);

      if (isSoundEnabled) {
        acceptSound.seekTo(0);
        acceptSound.play();
      }

      if (isVibrationEnabled) {
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );
      }

      Alert.alert("Attendance Recorded", "Attendance has been recorded", [
        { text: "OK", onPress: () => setScanned(false) },
      ]);
    } catch (error) {
      
      if (isSoundEnabled) {
        errorSound.seekTo(0);
        errorSound.play();
      }

      if (isVibrationEnabled) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      
      Alert.alert("Error", `${error}`, [
        { text: "OK", onPress: () => setScanned(false) },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleQrCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />
      <View style={styles.overlay}>
        <View style={styles.topSection}>
          <Text style={styles.instructionText}>
            {scanned ? "Processing..." : "Scan QR Code"}
          </Text>
          <Text style={styles.subText}>{scanned ? "Please wait" : ""}</Text>
        </View>

        <View style={styles.middleSection}>
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.statusIndicator}>
            <View
              style={[styles.statusDot, scanned && styles.statusDotActive]}
            />
            <Text style={styles.statusText}>
              {scanned ? "Scanning..." : "Ready to scan"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  topSection: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: Spacing.xl,
  },
  middleSection: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSection: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: Spacing.xl,
  },
  instructionText: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  subText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    textAlign: "center",
  },
  scanFrame: {
    width: 280,
    height: 280,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: Colors.primary["500"],
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 24,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gray["400"],
    marginRight: Spacing.sm,
  },
  statusDotActive: {
    backgroundColor: Colors.primary["500"],
  },
  statusText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "500",
  },
});
