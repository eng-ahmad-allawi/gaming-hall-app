import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { RateContext } from './RateContext';

// Create context
export const TimerContext = createContext();

// Timer provider component
export const TimerProvider = ({ children }) => {
  // Get rate from RateContext
  const { hourlyRate, registerTimer } = useContext(RateContext);

  // State for all timers
  const [screenTimers, setScreenTimers] = useState({});
  const [countdownTimers, setCountdownTimers] = useState({});

  // Refs for intervals
  const intervalsRef = useRef({});

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      // Clear all intervals when component unmounts
      Object.values(intervalsRef.current).forEach(interval => {
        if (interval) clearInterval(interval);
      });
    };
  }, []);

  // Start regular timer
  const startTimer = (screenId) => {
    console.log('Starting timer for screen', screenId);

    if (!hourlyRate) {
      alert('الرجاء حفظ سعر الساعة أولاً.');
      return false;
    }

    // Check if countdown timer is running
    if (countdownTimers[screenId]?.intervalId) {
      alert('لا يمكن بدء المؤقت العادي أثناء تشغيل المؤقت التنازلي');
      return false;
    }

    // Clear any ended countdown timer and its cost
    if (countdownTimers[screenId]?.ended) {
      setCountdownTimers(prev => {
        const newTimers = { ...prev };
        delete newTimers[screenId];
        return newTimers;
      });
    }

    // Prevent starting if already running
    if (screenTimers[screenId]?.intervalId) {
      console.log('Timer already running for screen', screenId);
      return false;
    }

    // Set up timer data
    const startTime = Date.now();
    const newScreenTimers = { ...screenTimers };

    // Create interval
    const intervalId = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - startTime) / 1000);

      setScreenTimers(prev => ({
        ...prev,
        [screenId]: {
          ...prev[screenId],
          elapsedSeconds
        }
      }));
    }, 1000);

    // Store interval ID in ref
    intervalsRef.current[`screen_${screenId}`] = intervalId;

    // Update state
    newScreenTimers[screenId] = {
      startTime,
      intervalId,
      elapsedSeconds: 0
    };

    setScreenTimers(newScreenTimers);

    // Register timer with RateContext
    if (registerTimer) {
      registerTimer(screenId, true);
    }

    return true;
  };

  // Stop regular timer
  const stopTimer = (screenId) => {
    console.log('Stopping timer for screen', screenId);

    // Check if timer is running
    if (!screenTimers[screenId]?.intervalId) {
      console.log('No timer running for screen', screenId);
      return false;
    }

    // Clear interval
    clearInterval(screenTimers[screenId].intervalId);
    delete intervalsRef.current[`screen_${screenId}`];

    // Calculate final elapsed time
    const finalElapsedSeconds = screenTimers[screenId].elapsedSeconds;

    // Calculate cost
    const costValue = (hourlyRate * finalElapsedSeconds) / 3600;
    const roundedCost = Math.ceil(costValue);

    // Update state
    setScreenTimers(prev => ({
      ...prev,
      [screenId]: {
        ...prev[screenId],
        intervalId: null,
        cost: roundedCost
      }
    }));

    // Unregister timer with RateContext
    if (registerTimer) {
      registerTimer(screenId, false);
    }

    return true;
  };

  // Reset timer
  const resetTimer = (screenId) => {
    console.log('Resetting timer for screen', screenId);

    // Check if timer is running
    const isTimerRunning = screenTimers[screenId]?.intervalId;
    const isCountdownRunning = countdownTimers[screenId]?.intervalId;

    // Stop timer if running
    if (isTimerRunning) {
      clearInterval(screenTimers[screenId].intervalId);
      delete intervalsRef.current[`screen_${screenId}`];
    }

    // Stop countdown timer if running
    if (isCountdownRunning) {
      clearInterval(countdownTimers[screenId].intervalId);
      delete intervalsRef.current[`countdown_${screenId}`];
    }

    // Always clear both timers and costs
    setScreenTimers(prev => {
      const newTimers = { ...prev };
      delete newTimers[screenId];
      return newTimers;
    });

    setCountdownTimers(prev => {
      const newTimers = { ...prev };
      delete newTimers[screenId];
      return newTimers;
    });

    // Unregister timer with RateContext
    if (registerTimer && (isTimerRunning || isCountdownRunning)) {
      registerTimer(screenId, false);
    }

    return true;
  };

  // Start countdown timer
  const startCountdownTimer = (screenId, options) => {
    console.log('Starting countdown timer for screen', screenId, 'with options:', options);

    if (!hourlyRate) {
      alert('الرجاء حفظ سعر الساعة أولاً.');
      return false;
    }

    // Calculate seconds
    let seconds = 0;
    let inputCost = null;

    if (options.type === 'minutes') {
      seconds = options.value * 60;
    } else if (options.type === 'cost') {
      inputCost = parseFloat(options.value);
      const hours = inputCost / hourlyRate;
      seconds = Math.floor(hours * 3600);
      console.log('Cost calculation:', inputCost, hourlyRate, hours, seconds);
    }

    if (seconds <= 0) {
      console.error('Invalid countdown time');
      return false;
    }

    // Stop any running timer for this screen
    if (screenTimers[screenId]?.intervalId) {
      clearInterval(screenTimers[screenId].intervalId);
      delete intervalsRef.current[`screen_${screenId}`];

      setScreenTimers(prev => {
        const newTimers = { ...prev };
        delete newTimers[screenId];
        return newTimers;
      });
    }

    // Stop any running countdown for this screen
    if (countdownTimers[screenId]?.intervalId) {
      clearInterval(countdownTimers[screenId].intervalId);
      delete intervalsRef.current[`countdown_${screenId}`];
    }

    // Set up countdown timer
    const endTime = Date.now() + (seconds * 1000);
    const totalSeconds = seconds;

    // Create interval
    const intervalId = setInterval(() => {
      const now = Date.now();
      const remaining = endTime - now;

      if (remaining <= 0) {
        // Time's up
        clearInterval(intervalId);
        delete intervalsRef.current[`countdown_${screenId}`];

        // Calculate cost for reminder
        let cost = 0;
        if (inputCost !== null) {
          cost = inputCost;
        } else if (totalSeconds) {
          const minutes = totalSeconds / 60;
          cost = Math.ceil((hourlyRate * minutes) / 60);
        }

        // Update state
        setCountdownTimers(prev => ({
          ...prev,
          [screenId]: {
            ...prev[screenId],
            intervalId: null,
            ended: true,
            reminderCost: cost
          }
        }));

        // Show notification
        // We'll handle notifications in the component instead
        console.log(`Timer ended for screen ${screenId}`);
      } else {
        // Update remaining time
        setCountdownTimers(prev => ({
          ...prev,
          [screenId]: {
            ...prev[screenId],
            remainingSeconds: Math.ceil(remaining / 1000)
          }
        }));
      }
    }, 1000);

    // Store interval ID in ref
    intervalsRef.current[`countdown_${screenId}`] = intervalId;

    // Update state
    setCountdownTimers(prev => ({
      ...prev,
      [screenId]: {
        intervalId,
        endTime,
        totalSeconds,
        inputCost,
        remainingSeconds: seconds,
        ended: false
      }
    }));

    // Register timer with RateContext
    if (registerTimer) {
      registerTimer(screenId, true);
    }

    return true;
  };

  // Calculate time from cost
  const calculateTimeFromCost = (cost) => {
    if (!hourlyRate || !cost) return null;

    const hours = cost / hourlyRate;
    const minutes = Math.floor(hours * 60);
    const seconds = Math.floor((hours * 3600) % 60);

    return { minutes, seconds };
  };

  // Format time for display
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Format countdown time
  const formatCountdownTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Check if timer is running
  const isTimerRunning = (screenId) => {
    return !!screenTimers[screenId]?.intervalId;
  };

  // Check if countdown is running
  const isCountdownRunning = (screenId) => {
    return !!countdownTimers[screenId]?.intervalId;
  };

  // Check if countdown has ended
  const hasCountdownEnded = (screenId) => {
    return countdownTimers[screenId]?.ended || false;
  };

  // Get elapsed seconds
  const getElapsedSeconds = (screenId) => {
    return screenTimers[screenId]?.elapsedSeconds || 0;
  };

  // Get remaining seconds
  const getRemainingSeconds = (screenId) => {
    return countdownTimers[screenId]?.remainingSeconds || 0;
  };

  // Get cost
  const getCost = (screenId) => {
    return screenTimers[screenId]?.cost || 0;
  };

  // Get reminder cost
  const getReminderCost = (screenId) => {
    return countdownTimers[screenId]?.reminderCost || 0;
  };

  // Check if cost should be shown
  const shouldShowCost = (screenId) => {
    return (screenTimers[screenId]?.cost > 0 && !screenTimers[screenId]?.intervalId) ||
           countdownTimers[screenId]?.ended;
  };

  return (
    <TimerContext.Provider
      value={{
        // Timer state
        screenTimers,
        countdownTimers,

        // Timer actions
        startTimer,
        stopTimer,
        resetTimer,
        startCountdownTimer,
        calculateTimeFromCost,

        // Helper functions
        formatTime,
        formatCountdownTime,
        isTimerRunning,
        isCountdownRunning,
        hasCountdownEnded,
        getElapsedSeconds,
        getRemainingSeconds,
        getCost,
        getReminderCost,
        shouldShowCost
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

// Custom hook to use timer context
export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};
