import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ColorBlindModeContextType = {
  isColorBlindMode: boolean;
  toggleColorBlindMode: () => void;
};

const ColorBlindModeContext = createContext<ColorBlindModeContextType | undefined>(undefined);

const COLOR_BLIND_MODE_KEY = "@colorBlindMode";

export const ColorBlindModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isColorBlindMode, setIsColorBlindMode] = useState(false);

  // Load saved preference on mount
  useEffect(() => {
    loadColorBlindMode();
  }, []);

  const loadColorBlindMode = async () => {
    try {
      const value = await AsyncStorage.getItem(COLOR_BLIND_MODE_KEY);
      if (value !== null) {
        setIsColorBlindMode(value === "true");
      }
    } catch (error) {
      console.error("Failed to load color-blind mode preference:", error);
    }
  };

  const toggleColorBlindMode = async () => {
    try {
      const newValue = !isColorBlindMode;
      setIsColorBlindMode(newValue);
      await AsyncStorage.setItem(COLOR_BLIND_MODE_KEY, String(newValue));
    } catch (error) {
      console.error("Failed to save color-blind mode preference:", error);
    }
  };

  return (
    <ColorBlindModeContext.Provider value={{ isColorBlindMode, toggleColorBlindMode }}>
      {children}
    </ColorBlindModeContext.Provider>
  );
};

export const useColorBlindMode = () => {
  const context = useContext(ColorBlindModeContext);
  if (context === undefined) {
    throw new Error("useColorBlindMode must be used within a ColorBlindModeProvider");
  }
  return context;
};
