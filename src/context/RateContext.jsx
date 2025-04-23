import React, { createContext, useState, useEffect } from 'react';

export const RateContext = createContext();

export const RateProvider = ({ children }) => {
  const [hourlyRate, setHourlyRate] = useState(null);
  const [activeTimers, setActiveTimers] = useState({});

  useEffect(() => {
    // Load rate from localStorage
    const savedRate = localStorage.getItem('hourlyRate');
    if (savedRate) {
      setHourlyRate(parseFloat(savedRate));
    }
  }, []);

  const saveHourlyRate = (rate) => {
    const rateValue = parseFloat(rate);
    if (!isNaN(rateValue) && rateValue > 0) {
      setHourlyRate(rateValue);
      localStorage.setItem('hourlyRate', rateValue.toString());
      return true;
    }
    return false;
  };

  const handleEditRate = () => {
    // Check if any timers are active
    if (hasActiveTimers()) {
      return false;
    }

    // If no active timers, allow editing
    setHourlyRate(null);
    return true;
  };

  const hasActiveTimers = () => {
    return Object.values(activeTimers).some(timer => timer);
  };

  const registerTimer = (screenId, isActive) => {
    setActiveTimers(prev => ({
      ...prev,
      [screenId]: isActive
    }));
  };

  return (
    <RateContext.Provider value={{
      hourlyRate,
      setHourlyRate,
      saveHourlyRate,
      handleEditRate,
      hasActiveTimers,
      registerTimer
    }}>
      {children}
    </RateContext.Provider>
  );
};
