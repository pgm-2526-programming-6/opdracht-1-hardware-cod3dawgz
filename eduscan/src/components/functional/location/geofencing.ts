import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

const LOCATION_GEOFENCING_TASK = "LOCATION_GEOFENCING_TASK";

// Store callbacks for geofencing events
let onEnterCallbacks: ((region: Location.LocationRegion) => void)[] = [];
let onExitCallbacks: ((region: Location.LocationRegion) => void)[] = [];

// Define the task that will handle geofencing events
TaskManager.defineTask(LOCATION_GEOFENCING_TASK, ({ data, error }) => {
  if (error) {
    console.error("Geofencing task error:", error);
    return;
  }

  const { eventType, region } = data as {
    eventType: Location.GeofencingEventType;
    region: Location.LocationRegion;
  };

  console.log(`Geofence event: ${eventType}, region: ${region.identifier}`);

  if (eventType === Location.GeofencingEventType.Enter) {
    console.log(`Entered region: ${region.identifier}`);
    onEnterCallbacks.forEach((callback) => callback(region));
  } else if (eventType === Location.GeofencingEventType.Exit) {
    console.log(`Exited region: ${region.identifier}`);
    onExitCallbacks.forEach((callback) => callback(region));
  }
});

// Start geofencing with better error handling
export async function startGeofencing() {
  try {
    // Check if task is registered
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      LOCATION_GEOFENCING_TASK
    );
    console.log("Task registered:", isRegistered);

    // Request foreground permission first
    const foreground = await Location.requestForegroundPermissionsAsync();
    console.log("Foreground permission:", foreground.status);

    if (foreground.status !== "granted") {
      throw new Error("Foreground location permission not granted");
    }

    // Then request background permission
    const background = await Location.requestBackgroundPermissionsAsync();
    console.log("Background permission:", background.status);

    if (background.status !== "granted") {
      throw new Error("Background location permission not granted");
    }

    // Check if background location is available
    const hasServicesEnabled = await Location.hasServicesEnabledAsync();
    console.log("Location services enabled:", hasServicesEnabled);

    if (!hasServicesEnabled) {
      throw new Error("Location services are disabled");
    }

    // Define regions to monitor
    const regions = [
      {
        identifier: "Leeuwstraat",
        latitude: 51.042010797341185,
        longitude: 3.7315612107233624,
        radius: 100,
        notifyOnEnter: true,
        notifyOnExit: true,
      },
    ];

    console.log("Starting geofencing with regions:", regions);

    // Start the geofencing task
    await Location.startGeofencingAsync(LOCATION_GEOFENCING_TASK, regions);
    console.log("✅ Geofencing started successfully");
  } catch (error) {
    console.error("❌ Failed to start geofencing:", error);
    throw error;
  }
}

// Stop geofencing
export async function stopGeofencing() {
  try {
    await Location.stopGeofencingAsync(LOCATION_GEOFENCING_TASK);
    console.log("Geofencing stopped");
  } catch (error) {
    console.error("Failed to stop geofencing:", error);
  }
}

// Subscribe to geofencing events
export function onGeofenceEnter(
  callback: (region: Location.LocationRegion) => void
) {
  onEnterCallbacks.push(callback);
  return () => {
    onEnterCallbacks = onEnterCallbacks.filter((cb) => cb !== callback);
  };
}

export function onGeofenceExit(
  callback: (region: Location.LocationRegion) => void
) {
  onExitCallbacks.push(callback);
  return () => {
    onExitCallbacks = onExitCallbacks.filter((cb) => cb !== callback);
  };
}
