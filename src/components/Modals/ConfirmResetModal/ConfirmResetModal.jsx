import { useTimer } from '../../../context/TimerContext';
import styles from './ConfirmResetModal.module.css';

const ConfirmResetModal = ({ isOpen, screenId, onClose }) => {
  // Get timer context
  const { resetTimer } = useTimer();

  const handleConfirmReset = () => {
    // Reset timer using context
    resetTimer(screenId);

    // Close modal
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`${styles.confirmModalOverlay} ${isOpen ? styles.active : ''}`} onClick={onClose}>
      <div className={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        <h3>تأكيد إعادة الضبط</h3>

        <p className={styles.confirmMessage}>
          هل أنت متأكد من إعادة ضبط هذه الشاشة؟ سيتم إيقاف المؤقت ومسح جميع البيانات.
        </p>

        <div className={styles.btnGroup}>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={handleConfirmReset}
          >
            نعم، إعادة الضبط
          </button>
          <button
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={onClose}
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmResetModal;
