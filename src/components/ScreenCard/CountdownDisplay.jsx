import styles from './ScreenCard.module.css';

const CountdownDisplay = ({ time }) => {
  return (
    <div className={styles.countdownDisplay}>
      {time}
    </div>
  );
};

export default CountdownDisplay;
