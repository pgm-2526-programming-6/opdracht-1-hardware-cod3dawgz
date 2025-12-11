import React from 'react';
import { useCameraPermissions } from 'expo-camera';
import QrScanner from './QrScanner';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

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
      <View style={styles.container}>
        <MaterialIcons name="warning-amber" size={128} color='#ffa550' />
        <Text style={styles.instructionText}>You need to allow Eduscan to access the camera</Text>
        <Pressable style={styles.mainBtn} onPress={requestPermission}>
          <Text style={styles.btnText}>Allow Camera</Text>
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
      alignItems: 'center',
      justifyContent: 'center',
    },
    mainBtn: {
      width: 200,
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
      marginTop: 20,
      backgroundColor: '#f06e0f',
    },
    instructionText: {
        fontSize: 16,
        width: 200,
        height: 'auto',
        textAlign: 'center',
        color: '#f06e0f',
        marginTop: 10,
        marginBottom: 30,
        fontWeight: '600',
    },
    btnText: {
        fontSize: 16,
        color: 'white',
    },
    errorText: {
      color: 'red',
      fontSize: 16,
    }
});