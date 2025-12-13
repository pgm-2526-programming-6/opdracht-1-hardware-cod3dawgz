import { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import {
  startGeofencing,
  stopGeofencing,
  onGeofenceEnter,
  onGeofenceExit,
} from "@functional/location/geofencing";
import useLocation from "@functional/location/location";
import QrGenerator from "./QrGenerator";
import EmptyView from "@design/View/EmptyView";

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
    setActiveCampuses(prev => {
      const updated = new Set(prev);
      updated.add(region.identifier || '');
      return updated;
      });
  });

  const unsubscribeExit = onGeofenceExit((region) => {
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
      <EmptyView
        title="Wrong Location"
        description="You're not at a campus"
        icon="location-off"
      />
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
  
