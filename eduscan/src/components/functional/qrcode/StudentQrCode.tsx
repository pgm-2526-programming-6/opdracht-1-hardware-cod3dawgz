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
import { Colors, Spacing, FontSizes, Fonts } from "@style/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import EmptyView from "@design/View/EmptyView";

export default function StudentQrCode() {
  const [activeCampuses, setActiveCampuses] = useState<Set<string>>(new Set());

  const { hasPermission } = useLocation();

  const isInGeofence = activeCampuses.size > 0;

  useEffect(() => {
    if (!hasPermission) return;

    const initGeofencing = async () => {
      await startGeofencing();
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

  if (!isInGeofence) {
    return (
      <EmptyView
        title="Wrong Location"
        description="You're not at campus"
        icon="location-off"
      />
    );
  }

  return <QrGenerator />;
}