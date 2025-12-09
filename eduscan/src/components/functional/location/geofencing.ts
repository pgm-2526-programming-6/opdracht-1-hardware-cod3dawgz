import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

const LOCATION_GEOFENCING_TASK = "LOCATION_GEOFENCING_TASK";

let onEnterCallbacks: ((region: Location.LocationRegion) => void)[] = [];
let onExitCallbacks: ((region: Location.LocationRegion) => void)[] = [];

TaskManager.defineTask(LOCATION_GEOFENCING_TASK, ({ data, error }) => {
  if (error) {
    console.error("Geofencing error:", error);
    return;
  }

  if (!data) {
    console.error("No data received in geofencing task");
    return;
  }

  const { eventType, region } = data as {
    eventType: Location.GeofencingEventType;
    region: Location.LocationRegion;
  };

  console.log("Geofencing event:", eventType, region.identifier);

  if (eventType === Location.GeofencingEventType.Enter) {
    console.log(`You've entered region: ${region.identifier}`);
    onEnterCallbacks.forEach((callback) => callback(region));
  } else if (eventType === Location.GeofencingEventType.Exit) {
    console.log(`You've left region: ${region.identifier}`);
    onExitCallbacks.forEach((callback) => callback(region));
  }
});

export async function startGeofencing() {
  try {
    const isTaskDefined = await TaskManager.isTaskDefined(
      LOCATION_GEOFENCING_TASK
    );
    if (!isTaskDefined) {
      console.error("Geofencing task is not defined");
      return false;
    }

    const { status: foregroundStatus } =
      await Location.requestForegroundPermissionsAsync();

    if (foregroundStatus !== "granted") {
      console.log("Foreground location permission not granted");
      return false;
    }

    const { status: backgroundStatus } =
      await Location.requestBackgroundPermissionsAsync();

    if (backgroundStatus !== "granted") {
      console.log("Background location permission not granted");
      return false;
    }

    const isRunning = await Location.hasStartedGeofencingAsync(
      LOCATION_GEOFENCING_TASK
    );
    if (isRunning) {
      console.log("Geofencing already running");
      return true;
    }

    const regions: Location.LocationRegion[] = [
      {
        identifier: "Leeuwstraat",
        latitude: 51.042010797341185,
        longitude: 3.7315612107233624,
        radius: 100, // meters
        notifyOnEnter: true,
        notifyOnExit: true,
      },
    ];

    await Location.startGeofencingAsync(LOCATION_GEOFENCING_TASK, regions);
    console.log("Geofencing started successfully");
    return true;
  } catch (error) {
    console.error("Error starting geofencing:", error);
    return false;
  }
}

export async function stopGeofencing() {
  try {
    const isRunning = await Location.hasStartedGeofencingAsync(
      LOCATION_GEOFENCING_TASK
    );
    if (isRunning) {
      await Location.stopGeofencingAsync(LOCATION_GEOFENCING_TASK);
      console.log("Geofencing stopped");
    }
  } catch (error) {
    console.error("Error stopping geofencing:", error);
  }
}

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

export async function getGeofencingStatus() {
  const isTaskDefined = await TaskManager.isTaskDefined(
    LOCATION_GEOFENCING_TASK
  );
  const isRunning = await Location.hasStartedGeofencingAsync(
    LOCATION_GEOFENCING_TASK
  );

  return {
    isTaskDefined,
    isRunning,
  };
}
