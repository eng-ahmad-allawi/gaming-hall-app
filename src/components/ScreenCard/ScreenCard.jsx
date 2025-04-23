import React, { useEffect, useState } from 'react';
import { useTimer } from '../../context/TimerContext';
import { useContext } from 'react';
import { RateContext } from '../../context/RateContext';
import { NotificationsContext } from '../../context/NotificationsContext';
import styles from './ScreenCard.module.css';

const ScreenCard = ({ screenId, screenNumber, onTimerClick, onResetClick }) => {
  // Get timer context
  const {
    startTimer,
    stopTimer,
    resetTimer,
    formatTime,
    formatCountdownTime,
    isTimerRunning,
    isCountdownRunning,
    hasCountdownEnded,
    getElapsedSeconds,
    getRemainingSeconds,
    getCost,
    getReminderCost,
    shouldShowCost,
    countdownTimers
  } = useTimer();

  // Get rate context
  const { hourlyRate } = useContext(RateContext);

  // Get notifications context
  const { showNotification } = useContext(NotificationsContext);

  // Show notification when countdown ends
  useEffect(() => {
    const timer = countdownTimers[screenId];
    if (timer && timer.ended) {
      showNotification(`انتهى وقت الشاشة ${screenId}`);
    }
  }, [countdownTimers, screenId, showNotification]);

  // State to control revealed animation
  const [isRevealed, setIsRevealed] = useState(false);

  // Add revealed class after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Get timer state for this screen
  const running = isTimerRunning(screenId);
  const countdownRunning = isCountdownRunning(screenId);
  const countdownEnded = hasCountdownEnded(screenId);
  const elapsedSeconds = getElapsedSeconds(screenId);
  const remainingSeconds = getRemainingSeconds(screenId);
  const cost = getCost(screenId);
  const reminderCost = getReminderCost(screenId);
  const showCost = shouldShowCost(screenId);

  // Handle start timer
  const handleStartTimer = () => {
    startTimer(screenId);
  };

  // Handle stop timer
  const handleStopTimer = () => {
    stopTimer(screenId);
  };

  // Handle reset timer
  const handleResetTimer = () => {
    // Always show confirmation dialog
    onResetClick(screenId);
  };

  // Add ripple effect
  const addRipple = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement('span');
    ripple.classList.add(styles.ripple);
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    button.appendChild(ripple);

    // Clean up ripple element afterwards
    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  };

  return (
    <div
      className={`${styles.screenCard} ${isRevealed ? styles.revealed : ''} ${(running || countdownRunning) ? styles.active : ''}`}
      data-screen-id={screenId}
      id={`screen-card-${screenId}`}
    >
      <h3 className={styles.title}>الشاشة {screenNumber}</h3>
      <div className={styles.timeDisplay}>{formatTime(elapsedSeconds)}</div>

      <div className={styles.buttons}>
        <button
          className={`${styles.btn} ${styles.btnStart}`}
          onClick={(e) => {
            addRipple(e);
            handleStartTimer();
          }}
          disabled={!hourlyRate || running || countdownRunning}
          type="button"
        >
          بدء
        </button>
        <button
          className={`${styles.btn} ${styles.btnStop}`}
          onClick={(e) => {
            addRipple(e);
            handleStopTimer();
          }}
          disabled={!running || countdownRunning}
          type="button"
        >
          إيقاف
        </button>
        <button
          className={`${styles.btn} ${styles.btnReset}`}
          onClick={(e) => {
            addRipple(e);
            handleResetTimer();
          }}
          disabled={!hourlyRate}
          type="button"
        >
          إعادة ضبط
        </button>
        <button
          className={`${styles.btn} ${styles.btnTimer}`}
          onClick={(e) => {
            addRipple(e);
            onTimerClick(screenId);
          }}
          disabled={!hourlyRate || running || countdownRunning}
          type="button"
        >
          مؤقت
        </button>
      </div>

      {countdownRunning && remainingSeconds > 0 && (
        <div className={styles.countdownDisplay}>
          {formatCountdownTime(remainingSeconds)}
        </div>
      )}

      <div className={`${styles.costDisplay} ${showCost ? styles.visible : ''}`}>
        {countdownEnded
          ? `تذكير: التكلفة هي ${reminderCost} ل.س`
          : showCost ? `التكلفة: ${cost} ل.س` : ''
        }
      </div>
    </div>
  );
};

export default ScreenCard;
