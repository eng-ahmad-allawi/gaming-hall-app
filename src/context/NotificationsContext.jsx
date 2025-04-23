import React, { createContext, useState, useCallback, useContext, useRef } from 'react';

// Create context
export const NotificationsContext = createContext();

// Notification provider component
export const NotificationsProvider = ({ children }) => {
  // State for notifications
  const [notifications, setNotifications] = useState([]);

  // Audio ref for notification sound
  const audioRef = useRef(null);

  // Show notification
  const showNotification = useCallback((message) => {
    console.log('Showing notification:', message);

    // Extract screen number if present
    let screenNumber = null;
    if (message.includes('انتهى وقت الشاشة')) {
      try {
        const match = message.match(/الشاشة (\d+)/);
        if (match && match[1]) {
          screenNumber = match[1];

          // Remove existing notification for this screen
          setNotifications(prev =>
            prev.filter(n => n.screenNumber !== screenNumber)
          );
        }
      } catch (error) {
        console.error('Error extracting screen number:', error);
      }
    }

    // Create new notification
    const newNotification = {
      id: Date.now(),
      message,
      screenNumber,
      timestamp: new Date()
    };

    // Add to notifications
    setNotifications(prev => [...prev, newNotification]);

    // Play sound
    try {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(error => {
          console.error('Error playing notification sound:', error);
        });
      }
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }

    // No auto-dismiss

    return newNotification.id;
  }, []);

  // Remove notification
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        showNotification,
        removeNotification
      }}
    >
      {/* Audio element for notification sound */}
      <audio
        ref={audioRef}
        src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"
        preload="auto"
      />
      {children}
    </NotificationsContext.Provider>
  );
};

// Custom hook to use notifications context
export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
