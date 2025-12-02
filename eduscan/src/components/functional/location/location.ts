import { useState, useEffect } from "react";
import * as Location from "expo-location";

export default function useLocation() {
  const [position, setPosition] = useState<Location.LocationObject | null>(
    null
  );
  const [subscription, setSubscription] =
    useState<Location.LocationSubscription | null>(null);

  // Start location tracking
  const startLocationTracking = async () => {
    // Request permissions
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    // Set up the location subscription
    const locationSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000, // Update every 5 seconds
        distanceInterval: 5, // Update if moved by 5 meters
      },
      (newLocation) => {
        setPosition(newLocation);
      }
    );

    setSubscription(locationSubscription);
  };

  // Stop location tracking
  const stopLocationTracking = () => {
    subscription?.remove();
    setSubscription(null);
  };

  // Start tracking when component mounts
  useEffect(() => {
    startLocationTracking();

    // Clean up subscription on unmount
    return () => {
      subscription?.remove();
    };
  }, []);

  return {
    position,
    startLocationTracking,
    stopLocationTracking,
  };
}
