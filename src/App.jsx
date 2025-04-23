import React, { useState, useContext, useEffect } from 'react';
import Header from './components/Header/Header';
import ScreenCard from './components/ScreenCard/ScreenCard';
import TimerModal from './components/Modals/TimerModal/TimerModal';
import ConfirmResetModal from './components/Modals/ConfirmResetModal/ConfirmResetModal';
import Notifications from './components/Notifications/Notifications';
import { RateContext } from './context/RateContext';
import { TimerProvider } from './context/TimerContext';
import { NotificationsProvider } from './context/NotificationsContext';
import './App.css';

function AppContent() {
  const { hourlyRate } = useContext(RateContext);
  const [showScreens, setShowScreens] = useState(false);
  const [timerModalData, setTimerModalData] = useState({ isOpen: false, screenId: null });
  const [confirmResetData, setConfirmResetData] = useState({ isOpen: false, screenId: null });

  // Screen data - 10 screens
  const screens = Array.from({ length: 10 }, (_, i) => ({ id: i + 1 }));

  useEffect(() => {
    setShowScreens(!!hourlyRate);
  }, [hourlyRate]);

  // Open timer modal
  const handleOpenTimerModal = (screenId) => {
    if (!hourlyRate) {
      alert('الرجاء حفظ سعر الساعة أولاً.');
      return;
    }
    setTimerModalData({ isOpen: true, screenId });
  };

  // Close timer modal
  const handleCloseTimerModal = () => {
    setTimerModalData({ isOpen: false, screenId: null });
  };

  // Open confirm reset modal
  const handleOpenConfirmResetModal = (screenId) => {
    setConfirmResetData({ isOpen: true, screenId });
  };

  // Close confirm reset modal
  const handleCloseConfirmResetModal = () => {
    setConfirmResetData({ isOpen: false, screenId: null });
  };

  return (
    <div className="app">
      <Header />

      <main className="container">
        <h2 className="text-center mt-2">شاشات اللعب</h2>

        <div className={`warningMessage ${!hourlyRate ? 'visible' : ''}`}>
          الرجاء إدخال وحفظ سعر الساعة أولاً لتتمكن من تشغيل الشاشات.
        </div>

        <section className={`screensContainer ${showScreens ? 'visible' : ''}`}>
          {screens.map(screen => (
            <ScreenCard
              key={screen.id}
              screenId={screen.id}
              screenNumber={screen.id}
              onTimerClick={handleOpenTimerModal}
              onResetClick={handleOpenConfirmResetModal}
            />
          ))}
        </section>
      </main>

      {/* Timer Modal */}
      <TimerModal
        isOpen={timerModalData.isOpen}
        screenId={timerModalData.screenId}
        onClose={handleCloseTimerModal}
      />

      {/* Confirm Reset Modal */}
      <ConfirmResetModal
        isOpen={confirmResetData.isOpen}
        screenId={confirmResetData.screenId}
        onClose={handleCloseConfirmResetModal}
      />

      {/* Notifications Component */}
      <Notifications />
    </div>
  );
}

function App() {
  return (
    <NotificationsProvider>
      <TimerProvider>
        <AppContent />
      </TimerProvider>
    </NotificationsProvider>
  );
}

export default App;
