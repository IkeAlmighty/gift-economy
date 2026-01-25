import { createContext, useContext, useState, useEffect } from "react";

const AppSettingsContext = createContext();

export function useAppSettings() {
  return useContext(AppSettingsContext);
}

const DEFAULT_SETTINGS = {
  doScrollAnimation: true,
};

export function AppSettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    // Load settings from localStorage on mount
    const stored = localStorage.getItem("appSettings");
    if (stored) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      } catch (e) {
        console.error("Failed to parse stored settings:", e);
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Persist settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("appSettings", JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateSettings = (newSettings) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <AppSettingsContext.Provider
      value={{
        settings,
        updateSetting,
        updateSettings,
        resetSettings,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
}
