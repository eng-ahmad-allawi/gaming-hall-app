import { useState, useRef, useEffect, useContext } from 'react';
import { RateContext } from '../context/RateContext';

const useCountdownTimer = (screenId) => {
  const [isRunning, setIsRunning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [countdownEnded, setCountdownEnded] = useState(false);
  const [inputCost, setInputCost] = useState(null);
  const { hourlyRate, registerCountdown } = useContext(RateContext);
  
  const intervalRef = useRef(null);
  const endTimeRef = useRef(null);

  useEffect(() => {
    // Register countdown status with context
    registerCountdown(screenId, isRunning);
    
    return () => {
      // Clean up interval on unmount
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, screenId, registerCountdown]);

  const startCountdown = (options) => {
    if (isRunning) return;
    
    let seconds = 0;
    
    if (options.type === 'minutes') {
      seconds = options.value * 60;
      setInputCost(null);
    } else if (options.type === 'cost') {
      const hours = options.value / hourlyRate;
      seconds = Math.floor(hours * 3600);
      setInputCost(options.value);
    }
    
    if (seconds <= 0) return;
    
    setTotalSeconds(seconds);
    setRemainingSeconds(seconds);
    setCountdownEnded(false);
    setIsRunning(true);
    
    endTimeRef.current = Date.now() + (seconds * 1000);
    
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const remaining = Math.ceil((endTimeRef.current - now) / 1000);
      
      if (remaining <= 0) {
        clearInterval(intervalRef.current);
        setRemainingSeconds(0);
        setIsRunning(false);
        setCountdownEnded(true);
      } else {
        setRemainingSeconds(remaining);
      }
    }, 1000);
  };

  const stopCountdown = () => {
    if (!isRunning) return;
    
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const resetCountdown = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setRemainingSeconds(0);
    setTotalSeconds(0);
    setCountdownEnded(false);
    setInputCost(null);
    endTimeRef.current = null;
  };

  const formatTime = () => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    
    return {
      minutes,
      seconds,
      formatted: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    };
  };

  const calculateCost = () => {
    if (inputCost !== null) {
      return inputCost;
    } else if (totalSeconds > 0 && hourlyRate) {
      const minutes = totalSeconds / 60;
      return Math.ceil((hourlyRate * minutes) / 60);
    }
    return 0;
  };

  return {
    isRunning,
    remainingSeconds,
    countdownEnded,
    startCountdown,
    stopCountdown,
    resetCountdown,
    formatTime,
    calculateCost
  };
};

export default useCountdownTimer;
