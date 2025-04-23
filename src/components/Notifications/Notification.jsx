import { useEffect, useState } from 'react';
import styles from './Notifications.module.css';

const Notification = ({ id, message, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300); // Match animation duration
  };
  
  return (
    <div className={`${styles.notification} ${isExiting ? styles.exiting : ''}`}>
      <div className={styles.message}>{message}</div>
      <button className={styles.closeBtn} onClick={handleClose}>&times;</button>
    </div>
  );
};

export default Notification;
