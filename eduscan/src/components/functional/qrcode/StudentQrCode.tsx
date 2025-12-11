import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  startGeofencing,
  stopGeofencing,
  onGeofenceEnter,
  onGeofenceExit,
} from "@functional/location/geofencing";
import useLocation from "@functional/location/location";
import { getCampusById } from "@functional/location/geofencing";
import QrGenerator from "./QrGenerator";

export default function StudentQrCode() {
  const [activeCampuses, setActiveCampuses] = useState<Set<string>>(new Set());

  const { hasPermission } = useLocation();

  const isInGeofence = activeCampuses.size > 0;
  const currentCampus =
    isInGeofence ? Array.from(activeCampuses)[0] : null;

  const campus = currentCampus ? getCampusById(currentCampus) : null;

  useEffect(() => {
    if (!hasPermission) return;

    const initGeofencing = async () => {
      const success = await startGeofencing();
    };

    initGeofencing();

    const unsubscribeEnter = onGeofenceEnter((region) => {
    console.log("entered:", region.identifier);

    setActiveCampuses(prev => {
      const updated = new Set(prev);
      updated.add(region.identifier || '');
      return updated;
      });
  });

  const unsubscribeExit = onGeofenceExit((region) => {
    console.log("Exited:", region.identifier);

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

  return (
    <View style={styles.container}>
      {isInGeofence ? (
        <View style={styles.qrContainer}>
            <Text style={styles.successText}>
              You are at Campus {campus ? campus.name : "Unknown campus"}
            </Text>
            <QrGenerator/>
        </View>
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>QR Code not available</Text>
          <Text style={styles.errorSubtext}>
            You must be at a campus to view the QR code
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  qrContainer: {
    backgroundColor: "#4CAF50",
    padding: 40,
    borderRadius: 10,
    alignItems: "center",
  },
  qrText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  successText: {
    fontSize: 16,
    color: "white",
    marginTop: 10,
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
