import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  startGeofencing,
  stopGeofencing,
  onGeofenceEnter,
  onGeofenceExit,
} from "@functional/location/geofencing";
import useLocation from "@functional/location/location";
import QrGenerator from "./QrGenerator";

export default function StudentQrCode() {
  const [activeCampuses, setActiveCampuses] = useState<Set<string>>(new Set());

  const { hasPermission } = useLocation();
  const currentCampusId = Array.from(activeCampuses)[0];

  const isInGeofence = activeCampuses.size > 0;

  useEffect(() => {
    if (!hasPermission) return;

    const initGeofencing = async () => {
      await startGeofencing();
    };    

    initGeofencing();

    const unsubscribeEnter = onGeofenceEnter((region) => {
    //console.log("entered:", region.identifier);

    setActiveCampuses(prev => {
      const updated = new Set(prev);
      updated.add(region.identifier || '');
      return updated;
      });
  });

  const unsubscribeExit = onGeofenceExit((region) => {
    //console.log("Exited:", region.identifier);

    setActiveCampuses(prev => {
      const updated = new Set(prev);
      updated.delete(region.identifier || '');
      return updated;
    });
  });

    return () => {
      unsubscribeEnter();
      unsubscribeExit();
      stopGeofencing();
    };
  }, [hasPermission]);

  if (!isInGeofence) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>QR Code not available</Text>
          <Text style={styles.errorSubtext}>
            You must be at a campus to view the QR code
          </Text>
        </View>
      </View>
    );
  }

  return <QrGenerator campusId={currentCampusId} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorContainer: {
    backgroundColor: "#f44336",
    padding: 40,
    borderRadius: 10,
    alignItems: "center",
  },
  errorText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  errorSubtext: {
    fontSize: 14,
    color: "white",
    marginTop: 10,
    textAlign: "center",
  },
});
