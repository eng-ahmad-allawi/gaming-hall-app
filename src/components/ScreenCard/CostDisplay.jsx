import styles from './ScreenCard.module.css';

const CostDisplay = ({ cost, visible, isReminder }) => {
  if (!visible || cost === 0) return <div className={styles.costDisplay}></div>;
  
  return (
    <div className={`${styles.costDisplay} ${visible ? styles.visible : ''}`}>
      {isReminder 
        ? `تذكير: التكلفة هي ${cost} ل.س`
        : `التكلفة: ${cost} ل.س`
      }
    </div>
  );
};

export default CostDisplay;
