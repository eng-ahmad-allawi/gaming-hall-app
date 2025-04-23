import styles from './TimerModal.module.css';

const TimerOptions = ({ activeOption, onOptionChange }) => {
  return (
    <div className={styles.timerOptions}>
      <div 
        className={`${styles.timerOption} ${activeOption === 'minutes' ? styles.active : ''}`}
        data-option="minutes"
        onClick={() => onOptionChange('minutes')}
      >
        بالدقائق
      </div>
      <div 
        className={`${styles.timerOption} ${activeOption === 'cost' ? styles.active : ''}`}
        data-option="cost"
        onClick={() => onOptionChange('cost')}
      >
        بالسعر
      </div>
    </div>
  );
};

export default TimerOptions;
