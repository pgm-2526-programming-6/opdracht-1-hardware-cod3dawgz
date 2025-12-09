import { useState, useEffect } from "react";
import * as Location from "expo-location";

export default function useLocation() {
  const [position, setPosition] = useState<Location.LocationObject | null>(
    null
  );
  const [subscription, setSubscription] =
    useState<Location.LocationSubscription | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const startLocationTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      alert("Permission to access location was denied");
      return false;
    }

    const { status: backgroundStatus } =
      await Location.requestBackgroundPermissionsAsync();

    if (backgroundStatus !== "granted") {
      alert("Background location permission is required for geofencing");
      return false;
    }

    setHasPermission(true);

    const locationSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 5,
      },
      (newLocation) => {
        setPosition(newLocation);
      }
    );

    setSubscription(locationSubscription);
    return true;
  };

  const stopLocationTracking = () => {
    subscription?.remove();
    setSubscription(null);
  };

  useEffect(() => {
    startLocationTracking();

    return () => {
      stopLocationTracking();
    };
  }, []);

  return {
    position,
    hasPermission,
    startLocationTracking,
    stopLocationTracking,
  };
}
