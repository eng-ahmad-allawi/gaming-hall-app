import { useState, useRef, useContext, useEffect } from 'react';
import { RateContext } from '../../../context/RateContext';
import { useTimer } from '../../../context/TimerContext';
import TimerOptions from './TimerOptions';
import styles from './TimerModal.module.css';

const TimerModal = ({ isOpen, screenId, onClose }) => {
  const { hourlyRate } = useContext(RateContext);
  const { startCountdownTimer, calculateTimeFromCost } = useTimer();

  const [activeOption, setActiveOption] = useState('minutes');
  const [minutesValue, setMinutesValue] = useState('');
  const [costValue, setCostValue] = useState('');
  const [calculatedTime, setCalculatedTime] = useState(null);
  const [startButtonDisabled, setStartButtonDisabled] = useState(true);

  const minutesInputRef = useRef(null);
  const costInputRef = useRef(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setMinutesValue('');
      setCostValue('');
      setCalculatedTime(null);
      setStartButtonDisabled(true);

      // Focus on active input after modal opens
      setTimeout(() => {
        if (activeOption === 'minutes') {
          minutesInputRef.current?.focus();
        } else {
          costInputRef.current?.focus();
        }
      }, 100);
    }
  }, [isOpen, activeOption]);

  // Calculate time from cost
  useEffect(() => {
    const cost = parseFloat(costValue);
    if (!isNaN(cost) && cost > 0 && hourlyRate > 0) {
      const time = calculateTimeFromCost(cost);
      if (time) {
        setCalculatedTime(time);
      } else {
        setCalculatedTime(null);
      }
    } else {
      setCalculatedTime(null);
    }
  }, [costValue, hourlyRate, calculateTimeFromCost]);

  // Update start button state
  useEffect(() => {
    if (activeOption === 'minutes') {
      const minutes = parseInt(minutesValue);
      setStartButtonDisabled(isNaN(minutes) || minutes <= 0);
    } else {
      const cost = parseFloat(costValue);
      setStartButtonDisabled(isNaN(cost) || cost <= 0);
    }
  }, [activeOption, minutesValue, costValue]);

  // Handle start timer
  const handleStartTimer = () => {
    if (activeOption === 'minutes') {
      const minutes = parseInt(minutesValue);
      if (isNaN(minutes) || minutes <= 0) {
        alert('الرجاء إدخال عدد دقائق صحيح');
        return;
      }

      // Start countdown timer with minutes
      startCountdownTimer(screenId, { type: 'minutes', value: minutes });
    } else {
      const cost = parseFloat(costValue);
      if (isNaN(cost) || cost <= 0) {
        alert('الرجاء إدخال مبلغ صحيح');
        return;
      }

      // Start countdown timer with cost
      startCountdownTimer(screenId, { type: 'cost', value: cost });
    }

    // Close modal
    onClose();
  };

  const handleKeyUp = (e) => {
    if (e.key === 'Enter' && !startButtonDisabled) {
      handleStartTimer();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`${styles.timerModalOverlay} ${isOpen ? styles.active : ''}`} onClick={onClose}>
      <div className={styles.timerModal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        <h3>مؤقت الشاشة <span>{screenId}</span></h3>

        <TimerOptions
          activeOption={activeOption}
          onOptionChange={setActiveOption}
        />

        {activeOption === 'minutes' ? (
          <div className={styles.inputGroup}>
            <label htmlFor="minutes-input">عدد الدقائق:</label>
            <input
              type="number"
              id="minutes-input"
              min="1"
              placeholder="مثال: 60"
              value={minutesValue}
              onChange={(e) => setMinutesValue(e.target.value)}
              onKeyUp={handleKeyUp}
              ref={minutesInputRef}
            />
          </div>
        ) : (
          <div className={styles.inputGroup}>
            <label htmlFor="cost-input">المبلغ (ل.س):</label>
            <input
              type="number"
              id="cost-input"
              min="1"
              placeholder="مثال: 100"
              value={costValue}
              onChange={(e) => setCostValue(e.target.value)}
              onKeyUp={handleKeyUp}
              ref={costInputRef}
            />
            {calculatedTime && (
              <div className={styles.calculatedTime}>
                الوقت المقابل: {calculatedTime.minutes} دقيقة و {calculatedTime.seconds} ثانية
              </div>
            )}
          </div>
        )}

        <div className={styles.btnGroup}>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={handleStartTimer}
            disabled={startButtonDisabled}
          >
            بدء المؤقت
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimerModal;
