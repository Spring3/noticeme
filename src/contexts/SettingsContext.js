import React, { createContext, useContext, useState } from 'react';

const SettingsContext = createContext();

const useSettingsContext = () => {
  const [settings, setSettings] = useState({
    isPublicProfile: false,
    autoNotify: false
  });

  const toggleProfileVisibility = () => {
    setSettings({ ...settings, isPublicProfile: !settings.isPublicProfile });
  };

  const toggleAutomaticNotification = () => {
    setSettings({ ...settings, autoNotify: !settings.autoNotify });
  };

  const updateSettings = (settings) => {
    setSettings(settings);
  }

  return {
    ...settings,
    updateSettings,
    toggleProfileVisibility,
    toggleAutomaticNotification
  };
}

const SettingsContextProvider = ({ children }) => {
  const value = useSettingsContext();

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
};

const useSettings = () => useContext(SettingsContext);

export {
  SettingsContext,
  SettingsContextProvider,
  useSettings
};
