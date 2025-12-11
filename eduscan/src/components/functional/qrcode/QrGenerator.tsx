import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { API } from "@core/network/supabase/api"; 
import useUser from '@functional/auth/useUser';

const generateQrPayload = (profileId: string): string => {
  const timestamp = new Date().toISOString(); 
  return `${profileId}|${timestamp}`; 
};

const QrGenerator: React.FC = () => {
  const user = useUser(); 
  const currentUserId = user.id;

  const [loading, setLoading] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<{ id: string, name: string } | null>(null);
  const [qrValue, setQrValue] = useState<string>('');
  const [refreshTimer, setRefreshTimer] = useState<number>(30);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    
    const { data: profile, error } = await API
      .from('profiles')
      .select(`id, first_name, last_name`)
      .eq('id', currentUserId)
      .single(); 
      
    if (error) {
      console.error('Fout bij het ophalen van profiel:', error.message);
      Alert.alert('Fout', 'Kon het profiel niet ophalen.');
      setUserProfile(null);
    } else if (profile) {

      const name = [profile.first_name, profile.last_name]
        .filter(Boolean)
        .join(' ') || profile.id;

      setUserProfile({
        id: profile.id,
        name: name
      });

      setQrValue(generateQrPayload(profile.id));
      
    } else {
      setUserProfile(null);
    }
    setLoading(false);
  }, [currentUserId]); 

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]); 

  useEffect(() => {
    if (!userProfile) return;

    const refreshQr = () => {
      setQrValue(generateQrPayload(userProfile.id));
    };

    const interval = setInterval(() => {
      setRefreshTimer(prevTime => {
        if (prevTime <= 1) {
          refreshQr(); 
          return 30; 
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [userProfile]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#1a73e8" />
        <Text style={{ marginTop: 10 }}>Profiel laden...</Text>
      </View>
    );
  }

  if (!userProfile) {
    return <Text style={styles.errorText}>Geen toegang: Profiel niet gevonden.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Aanwezigheidscode</Text>
      <Text style={styles.subHeader}>{userProfile.name}</Text>
      <Text style={styles.instructionText}>Laat deze code aan de docent zien.</Text>
      
      <View style={styles.qrCodeBox}>
        <QRCode 
            value={qrValue} 
            size={240}
            ecl="H"
            color="#000000ff" 
            backgroundColor="white"
        />
      </View>

      <Text style={styles.timeText}>
        Nieuwe code over: <Text style={styles.timerCount}>{refreshTimer}s</Text>
      </Text>
    </View>
  );
};

export default QrGenerator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000000ff',
  },
  subHeader: {
    fontSize: 18,
    color: '#555',
  },
  instructionText: {
    fontSize: 16,
    color: '#000000ff',
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
  qrCodeBox: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    padding: 5,
  },
  timeText: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 10,
  },
  timerCount: {
    fontWeight: 'bold',
    color: '#ee3827ff',
    fontSize: 18,
  }
});
