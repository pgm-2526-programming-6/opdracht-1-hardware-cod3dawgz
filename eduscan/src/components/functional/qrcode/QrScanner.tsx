import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, View, Alert } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing } from '@style/theme';


const MOCK_CAMPUS_ID = 'campus-1';
const MOCK_CLASS_ID = 'class-101';

const MOCK_STUDENT_USER_ID = '1';
const MOCK_TEACHER_USER_ID = '2';

const MOCK_CLASS = {
  id: MOCK_CLASS_ID,
  name: "Advanced React Native Development",
};

const MOCK_PROFILES = [
  {
    id: 'profile-t2',
    user_id: MOCK_TEACHER_USER_ID,
    email: "professor.a@school.edu",
    name: "Dr. Alice Smith (Teacher)",
    is_teacher: true,
    class_id: null,
  },
  {
    id: 'profile-s1',
    user_id: MOCK_STUDENT_USER_ID,
    email: "student.b@school.edu",
    name: "Bob Johnson (Student)",
    is_teacher: false,
    class_id: MOCK_CLASS_ID,
  },
];



export default function QrScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  
  const [scanned, setScanned] = useState(false); 

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }: BarcodeScanningResult) => {
    
    if (scanned) {
        return; 
    }

    setScanned(true); 

    const scanResult = 'test';
    
    const isSuccess = scanResult.startsWith('SUCCESS');

    if (isSuccess) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    Alert.alert(
      isSuccess ? 'Attendance Recorded' : 'Scan Failed',
      scanResult,
      [
        {
          text: 'OK', 
          onPress: () => {
            setScanned(false); 
          }
        }
      ],
      { cancelable: false } 
    );
  };

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned} 
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      />
      <View style={styles.overlay}>
        {/* Top instruction text */}
        <View style={styles.topSection}>
          <Text style={styles.instructionText}>
            {scanned ? 'Processing...' : 'Scan QR Code'}
          </Text>
          <Text style={styles.subText}>
            {scanned ? 'Please wait' : ''}
          </Text>
        </View>

        {/* Middle section with scan frame */}
        <View style={styles.middleSection}>
          <View style={styles.scanFrame}>
            {/* Corner frames */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>

        {/* Bottom section */}
        <View style={styles.bottomSection}>
          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, scanned && styles.statusDotActive]} />
            <Text style={styles.statusText}>
              {scanned ? 'Scanning...' : 'Ready to scan'}
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
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    fontSize: 16,
    color: Colors.text,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  topSection: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: Spacing.xl,
  },
  middleSection: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: Spacing.xl,
  },
  instructionText: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textAlign: 'center',
  },
  scanFrame: {
    width: 280,
    height: 280,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: Colors.primary['500'],
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 24,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gray['400'],
    marginRight: Spacing.sm,
  },
  statusDotActive: {
    backgroundColor: Colors.primary['500'],
  },
  statusText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
});