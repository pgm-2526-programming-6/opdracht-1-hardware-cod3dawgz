import React from 'react';
import { useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

interface TeacherScannerProps {
    teacherName: string;
}

const TeacherScanner: React.FC<TeacherScannerProps> = ({ teacherName }) => {
  const [permission, requestPermission] = useCameraPermissions();

  const isPermissionGranted = Boolean(permission?.granted);

  if (!permission) {
    return <Text style={styles.errorText}>Camera rechten controleren...</Text>;
  }
  
  if (!isPermissionGranted) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <Text style={styles.header}>Welkom, {teacherName}</Text>
        <Text style={styles.instructionText}>Docentmodus: Camera nodig om QR codes te scannen.</Text>
        <Pressable style={[styles.mainBtn, styles.btnGreen]} onPress={requestPermission}>
          <Text style={{color: 'white'}}>Vraag Camera Rechten Aan</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.header}>Scanner Klaar</Text>
      <Text style={styles.subHeader}>Welkom, {teacherName}</Text>
      <Text style={styles.instructionText}>Druk op &apos;Scan Code&apos; om de camera te starten.</Text>

      <Pressable 
        onPress={() => { router.replace("./qrScan"); }} 
        style={[styles.mainBtn, styles.btnYellow]} 
      >
        <Text style={{fontWeight: 'bold'}}>Scan Aanwezigheidscode</Text>
      </Pressable>
    </SafeAreaView>
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
    subHeader: {
        fontSize: 18,
        color: '#555',
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