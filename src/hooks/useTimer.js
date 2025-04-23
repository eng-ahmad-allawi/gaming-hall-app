import { useState, useRef, useEffect, useContext } from 'react';
import { RateContext } from '../context/RateContext';

const useTimer = (screenId) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [cost, setCost] = useState(0);
  const { hourlyRate, registerTimer } = useContext(RateContext);
  
  const startTimeRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Register timer status with context
    registerTimer(screenId, isRunning);
    
    return () => {
      // Clean up interval on unmount
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, screenId, registerTimer]);

  const startTimer = () => {
    if (isRunning) return;
    
    startTimeRef.current = Date.now() - (elapsedSeconds * 1000);
    setIsRunning(true);
    
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTimeRef.current) / 1000);
      setElapsedSeconds(elapsed);
    }, 1000);
  };

  const stopTimer = () => {
    if (!isRunning) return;
    
    clearInterval(intervalRef.current);
    setIsRunning(false);
    
    // Calculate cost
    if (hourlyRate) {
      const costValue = (hourlyRate * elapsedSeconds) / 3600;
      setCost(Math.ceil(costValue));
    }
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setElapsedSeconds(0);
    setCost(0);
    startTimeRef.current = null;
  };

  const formatTime = () => {
    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;
    
    return {
      hours,
      minutes,
      seconds,
      formatted: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    };
  };

  return {
    isRunning,
    elapsedSeconds,
    cost,
    startTimer,
    stopTimer,
    resetTimer,
    formatTime
  };
};

export default useTimer;
