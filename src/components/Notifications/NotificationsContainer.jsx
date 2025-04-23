import { useContext } from 'react';
import Notification from './Notification';
import { NotificationsContext } from '../../context/NotificationsContext';
import styles from './Notifications.module.css';

const NotificationsContainer = () => {
  const { notifications, removeNotification } = useContext(NotificationsContext);
  
  return (
    <div className={styles.notificationsContainer}>
      {notifications.map((notification) => (
        <Notification 
          key={notification.id}
          id={notification.id}
          message={notification.message}
          onClose={removeNotification}
        />
      ))}
    </div>
  );
};

export default NotificationsContainer;
