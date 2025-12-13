import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type SettingsContextType = {
  isColorBlindMode: boolean;
  isSoundEnabled: boolean;
  isVibrationEnabled: boolean;
  toggleColorBlindMode: () => void;
  toggleSound: () => void;
  toggleVibration: () => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEYS = {
  colorBlind: "@colorBlindMode",
  sound: "@soundEnabled",
  vibration: "@vibrationEnabled",
};

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [isColorBlindMode, setIsColorBlindMode] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isVibrationEnabled, setIsVibrationEnabled] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [colorBlind, sound, vibration] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.colorBlind),
        AsyncStorage.getItem(STORAGE_KEYS.sound),
        AsyncStorage.getItem(STORAGE_KEYS.vibration),
      ]);

      if (colorBlind !== null) setIsColorBlindMode(colorBlind === "true");
      if (sound !== null) setIsSoundEnabled(sound === "true");
      if (vibration !== null) setIsVibrationEnabled(vibration === "true");
    } catch (e) {
      console.error("Failed to load settings:", e);
    }
  };

  const toggleColorBlindMode = async () => {
    const value = !isColorBlindMode;
    setIsColorBlindMode(value);
    await AsyncStorage.setItem(STORAGE_KEYS.colorBlind, String(value));
  };

  const toggleSound = async () => {
    const value = !isSoundEnabled;
    setIsSoundEnabled(value);
    await AsyncStorage.setItem(STORAGE_KEYS.sound, String(value));
  };

  const toggleVibration = async () => {
    const value = !isVibrationEnabled;
    setIsVibrationEnabled(value);
    await AsyncStorage.setItem(STORAGE_KEYS.vibration, String(value));
  };

  return (
    <SettingsContext.Provider
      value={{
        isColorBlindMode,
        isSoundEnabled,
        isVibrationEnabled,
        toggleColorBlindMode,
        toggleSound,
        toggleVibration,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
