import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  startGeofencing,
  stopGeofencing,
  onGeofenceEnter,
  onGeofenceExit,
} from "@functional/location/geofencing";
import useLocation from "@functional/location/location";

export default function QRCode() {
  const [isInGeofence, setIsInGeofence] = useState(false);
  const { position, hasPermission } = useLocation();

  useEffect(() => {
    if (!hasPermission) return;

    const initGeofencing = async () => {
      const success = await startGeofencing();
      console.log("Geofencing started:", success);
    };

    initGeofencing();

    const unsubscribeEnter = onGeofenceEnter((region) => {
      console.log("Entered:", region.identifier);
      if (region.identifier === "Leeuwstraat") {
        setIsInGeofence(true);
      }
    });

    const unsubscribeExit = onGeofenceExit((region) => {
      console.log("Exited:", region.identifier);
      if (region.identifier === "Leeuwstraat") {
        setIsInGeofence(false);
      }
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
          <Text style={styles.qrText}>✓ QR CODE</Text>
          <Text style={styles.successText}>You are inside Leeuwstraat!</Text>
        </View>
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ QR Code not available</Text>
          <Text style={styles.errorSubtext}>
            You must be at Leeuwstraat to view the QR code
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
