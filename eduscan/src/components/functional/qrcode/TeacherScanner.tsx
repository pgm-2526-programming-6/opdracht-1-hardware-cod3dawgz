import React from 'react';
import { useCameraPermissions } from 'expo-camera';
import QrScanner from './QrScanner';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

interface TeacherScannerProps {
    teacherId: string;
}

const TeacherScanner: React.FC<TeacherScannerProps> = ({ teacherId }) => {
  const [permission, requestPermission] = useCameraPermissions();

  const isPermissionGranted = Boolean(permission?.granted);

  if (!permission) {
    return <Text style={styles.errorText}>Camera rechten controleren...</Text>;
  }
  
  if (!isPermissionGranted) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <Text style={styles.header}>Welkom, {teacherId}</Text>
        <Text style={styles.instructionText}>Docentmodus: Camera nodig om QR codes te scannen.</Text>
        <Pressable style={[styles.mainBtn, styles.btnGreen]} onPress={requestPermission}>
          <Text style={{color: 'white'}}>Vraag Camera Rechten Aan</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <QrScanner />
  );
}

export default TeacherScanner;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      rowGap: 20
    },
    mainBtn: {
      width: 250,
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
      marginTop: 20,
    },
    btnGreen: {
      backgroundColor: '#1a73e8',
    },
    btnYellow: {
      backgroundColor: "yellow",
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333', 
    },
    instructionText: {
        fontSize: 16,
        color: '#333',
        marginTop: 10,
        marginBottom: 30,
        fontWeight: '600',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        padding: 40,
    },
});