import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

const LOCATION_GEOFENCING_TASK = "LOCATION_GEOFENCING_TASK";

// Store callbacks for geofencing events
let onEnterCallbacks: ((region: Location.LocationRegion) => void)[] = [];
let onExitCallbacks: ((region: Location.LocationRegion) => void)[] = [];

// Define the task that will handle geofencing events
TaskManager.defineTask(LOCATION_GEOFENCING_TASK, ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }

  const { eventType, region } = data as {
    eventType: Location.GeofencingEventType;
    region: Location.LocationRegion;
  };

  if (eventType === Location.GeofencingEventType.Enter) {
    onEnterCallbacks.forEach((callback) => callback(region));
  } else if (eventType === Location.GeofencingEventType.Exit) {
    onExitCallbacks.forEach((callback) => callback(region));
  }
});

// Start geofencing
export async function startGeofencing() {
  // Request permissions
  const { status } = await Location.requestBackgroundPermissionsAsync();

  if (status !== "granted") {
    console.log("Background location permission not granted");
    return;
  }

  // Define regions to monitor
  const regions = [
    {
      identifier: "Leeuwstraat",
      latitude: 51.042010797341185,
      longitude: 3.7315612107233624,
      radius: 20,
      notifyOnEnter: true,
      notifyOnExit: true,
    },
  ];

  // Start the geofencing task
  await Location.startGeofencingAsync(LOCATION_GEOFENCING_TASK, regions);
  console.log("Geofencing started");
}

// Stop geofencing
export async function stopGeofencing() {
  await Location.stopGeofencingAsync(LOCATION_GEOFENCING_TASK);
  console.log("Geofencing stopped");
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
