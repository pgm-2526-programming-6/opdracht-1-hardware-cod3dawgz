import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Progress from 'react-native-progress';
import { API } from "@core/network/supabase/api"; 
import useUser from '@functional/auth/useUser';
import { Colors } from '../../../style/theme';

interface QrGeneratorProps {
  campusId: string;
}

const generateQrPayload = (profileId: string, timestamp: string, campusId: string): string => {
  return JSON.stringify({profileId, timestamp, campusId}); 
};

const QrGenerator = ({ campusId }: QrGeneratorProps) => {
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
      .select('*')
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

      setQrValue(generateQrPayload(profile.id, new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString(), campusId));
      
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
      setQrValue(generateQrPayload(userProfile.id, new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString(), campusId));
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

  const progress = 1 - (refreshTimer / 30)
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Show this to your Teacher</Text>
      
      <View style={styles.qrCodeBox}>
        <QRCode 
            value={qrValue} 
            size={300}
            ecl="H"
            color="#000000" 
            backgroundColor="#FFFFFF"
        />
      </View>
      <View style={styles.progressBox}>
        <Progress.Bar
          progress={progress}
          color={Colors.primary["500"]}
          unfilledColor={Colors.gray["200"]}
          borderWidth={0}
          height={10}
          width={240}
        />
      </View>
      
      <Text style={styles.timeText}>Auto-refresh in {refreshTimer}s</Text>
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
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 40,
    color: '#000000',
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 30,
    marginBottom: 20,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    padding: 40,
  },
  qrCodeBox: {
    backgroundColor: '#ffffffff',
    padding: 20,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeText: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginTop: 30,
  },
  progressBox: {
    marginTop: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
