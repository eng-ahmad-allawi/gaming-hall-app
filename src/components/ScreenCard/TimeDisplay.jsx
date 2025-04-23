import styles from './ScreenCard.module.css';

const TimeDisplay = ({ time }) => {
  return (
    <div className={styles.timeDisplay}>
      {time}
    </div>
  );
};

export default TimeDisplay;
