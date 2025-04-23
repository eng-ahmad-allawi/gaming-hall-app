import React, { useState } from 'react';

const SimpleScreenCard = ({ screenId }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  const startTimer = () => {
    if (isRunning) return;
    
    const startTime = Date.now() - elapsedTime * 1000;
    const id = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    setIntervalId(id);
    setIsRunning(true);
  };

  const stopTimer = () => {
    if (!isRunning) return;
    
    clearInterval(intervalId);
    setIntervalId(null);
    setIsRunning(false);
  };

  const resetTimer = () => {
    clearInterval(intervalId);
    setIntervalId(null);
    setIsRunning(false);
    setElapsedTime(0);
  };

  // Format time as HH:MM:SS
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="screen-card">
      <h3>الشاشة {screenId}</h3>
      <div className="time-display">{formatTime(elapsedTime)}</div>
      <div className="buttons">
        <button 
          className="btn-start" 
          onClick={startTimer}
          disabled={isRunning}
        >
          بدء
        </button>
        <button 
          className="btn-stop" 
          onClick={stopTimer}
          disabled={!isRunning}
        >
          إيقاف
        </button>
        <button 
          className="btn-reset" 
          onClick={resetTimer}
        >
          إعادة ضبط
        </button>
      </div>
    </div>
  );
};

export default SimpleScreenCard;
