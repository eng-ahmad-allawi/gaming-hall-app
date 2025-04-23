import React, { useState } from 'react';
import { useContext } from 'react';
import { NotificationsContext } from '../../context/NotificationsContext';
import styles from './Notifications.module.css';

const Notifications = () => {
  const { notifications, removeNotification } = useContext(NotificationsContext);
  const [exitingNotifications, setExitingNotifications] = useState({});

  // Handle close notification
  const handleCloseNotification = (id) => {
    // Mark notification as exiting
    setExitingNotifications(prev => ({
      ...prev,
      [id]: true
    }));

    // Remove notification after animation completes
    setTimeout(() => {
      removeNotification(id);
      setExitingNotifications(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }, 400); // Match animation duration
  };

  return (
    <div className={styles.notificationsContainer}>
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`${styles.notification} ${exitingNotifications[notification.id] ? styles.exiting : ''}`}
          data-screen-number={notification.screenNumber || ''}
        >
          <div className={styles.message}>
            {notification.screenNumber ? (
              <span
                dangerouslySetInnerHTML={{
                  __html: notification.message.replace(
                    `الشاشة ${notification.screenNumber}`,
                    `الشاشة <span class="${styles.screenNumber}">${notification.screenNumber}</span>`
                  )
                }}
              />
            ) : (
              notification.message
            )}
          </div>
          <button
            className={styles.closeBtn}
            onClick={() => handleCloseNotification(notification.id)}
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
