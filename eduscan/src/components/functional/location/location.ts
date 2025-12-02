import { useEffect, useState } from "react";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useLocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [permission, setPermission] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    const initLocation = async () => {
      try {
        // Check stored permission
        const storedPermission = await AsyncStorage.getItem(
          "location_permission"
        );

        // Request permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        setPermission(status);
        await AsyncStorage.setItem("location_permission", status);

        if (status !== "granted") {
          setLocationError("Permission to access location was denied");
          return;
        }

        // Get current location
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation(currentLocation);
      } catch (err) {
        setLocationError("Failed to get location: " + (err as Error).message);
      }
    };

    initLocation();
  }, []);

  return { location, permission, locationError };
}
