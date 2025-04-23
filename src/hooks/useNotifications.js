import { useContext } from 'react';
import { NotificationsContext } from '../context/NotificationsContext';

const useNotifications = () => {
  const { showNotification, removeNotification } = useContext(NotificationsContext);
  
  return {
    showNotification,
    removeNotification
  };
};

export default useNotifications;
