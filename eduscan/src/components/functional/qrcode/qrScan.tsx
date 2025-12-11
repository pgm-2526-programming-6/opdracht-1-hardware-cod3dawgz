import { CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { 
  mockScan, 
  MOCK_TEACHER_USER_ID,
  MOCK_ATTENDANCES 
} from '../data';

export default function QrScanner() {
  const [facing, setFacing] = useState<CameraType>('back');
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

    const scanResult = mockScan(data, MOCK_TEACHER_USER_ID);
    
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
        },
        {
          text: 'Check List',
          onPress: () => {
            console.log("Current Attendance List:", MOCK_ATTENDANCES);
            router.replace("./teacher"); 
          }
        },
      ],
      { cancelable: false } 
    );
  };

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing={facing} 
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned} 
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      >
        <View style={styles.scanOverlay}>
          <Text style={styles.scanText}>
            {scanned ? (
              <Text style={{ color: 'yellow', fontWeight: 'bold' }}>
                PROCESSING (Click OK)
              </Text>
            ) : (
              'Point camera at student QR code'
            )}
          </Text>
        </View>
      </CameraView>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  scanOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanText: {
    position: 'absolute',
    top: 50,
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 64,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    paddingHorizontal: 64,
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});