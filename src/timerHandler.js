// Global state for timers
export const screenTimers = {}; // Stores interval IDs and start times: { screenId: { intervalId: null, startTime: null, elapsedSeconds: 0 } }
export const countdownTimers = {}; // Stores countdown timers: { screenId: { intervalId: null, endTime: null, totalSeconds: 0 } }

// Debug function to log the state of timers
export function logTimerState() {
  console.log('Screen Timers:', JSON.stringify(screenTimers, null, 2));
  console.log('Countdown Timers:', JSON.stringify(countdownTimers, null, 2));
}

// --- Screen Timer Logic ---
export function handleScreenButtonClick(event, hourlyRate, showNotification) {
    const button = event.target.closest('button');
    if (!button) return; // Clicked outside a button

    const card = button.closest('.screen-card');
    if (!card) return; // Should not happen if button is inside a card

    const screenId = card.dataset.screenId;

    if (button.classList.contains('start-btn')) {
        // Check if countdown timer is running
        if (countdownTimers[screenId] && countdownTimers[screenId].intervalId) {
            alert('لا يمكن بدء المؤقت العادي أثناء تشغيل المؤقت التنازلي');
            return;
        }
        startTimer(card, screenId, hourlyRate);
    } else if (button.classList.contains('stop-btn')) {
        stopTimer(card, screenId, hourlyRate);
    } else if (button.classList.contains('reset-card-btn')) {
        // This will be handled by the React component
    } else if (button.classList.contains('timer-btn')) {
        // This will be handled by the React component
    }
}

export function startTimer(card, screenId, hourlyRate) {
    console.log('Starting timer for screen', screenId);

    if (!hourlyRate) {
        alert('الرجاء حفظ سعر الساعة أولاً.');
        return false;
    }

    // Prevent starting if already running
    if (screenTimers[screenId] && screenTimers[screenId].intervalId) {
        console.log('Timer already running for screen', screenId);
        return false;
    }

    // Check if countdown timer is running
    if (countdownTimers[screenId] && countdownTimers[screenId].intervalId) {
        alert('لا يمكن بدء المؤقت العادي أثناء تشغيل المؤقت التنازلي');
        return false;
    }

    try {
        const timeDisplay = card.querySelector('.time-display');
        const costDisplay = card.querySelector('.cost-display');
        const startBtn = card.querySelector('.start-btn');
        const stopBtn = card.querySelector('.stop-btn');
        const resetBtn = card.querySelector('.reset-card-btn');
        const timerBtn = card.querySelector('.timer-btn');

        // Reset previous state if any
        if (timeDisplay) timeDisplay.textContent = '00:00:00';
        if (costDisplay) {
            costDisplay.textContent = '';
            costDisplay.classList.remove('visible');
        }
        card.classList.add('active'); // Add active class for styling

        const startTime = Date.now();
        screenTimers[screenId] = {
            startTime: startTime,
            intervalId: null,
            elapsedSeconds: 0
        };

        // Update time immediately to 00:00:00
        if (timeDisplay) updateTimeDisplay(timeDisplay, 0);

        // Start the interval
        const intervalId = setInterval(() => {
            try {
                if (!screenTimers[screenId]) {
                    clearInterval(intervalId);
                    return;
                }

                const now = Date.now();
                const elapsedSeconds = Math.floor((now - screenTimers[screenId].startTime) / 1000);
                screenTimers[screenId].elapsedSeconds = elapsedSeconds;

                const currentTimeDisplay = card.querySelector('.time-display');
                if (currentTimeDisplay) {
                    updateTimeDisplay(currentTimeDisplay, elapsedSeconds);
                }
            } catch (error) {
                console.error('Error updating timer:', error);
                clearInterval(intervalId);
            }
        }, 1000); // Update every second

        screenTimers[screenId].intervalId = intervalId;
        console.log('Timer started for screen', screenId, 'with interval ID', intervalId);

        // Update button states
        if (startBtn) startBtn.disabled = true;
        if (stopBtn) stopBtn.disabled = false;
        if (resetBtn) resetBtn.disabled = false;
        if (timerBtn) timerBtn.disabled = true; // Disable timer button while counting

        return true;
    } catch (error) {
        console.error('Error starting timer:', error);
        return false;
    }
}

export function stopTimer(card, screenId, hourlyRate) {
    console.log('Stopping timer for screen', screenId);

    try {
        const timerData = screenTimers[screenId];
        if (!timerData || !timerData.intervalId) {
            console.log('No timer running for screen', screenId);
            return false; // Timer not running
        }

        clearInterval(timerData.intervalId);
        timerData.intervalId = null; // Mark as stopped

        // Recalculate final elapsed time accurately
        const finalElapsedSeconds = Math.floor((Date.now() - timerData.startTime) / 1000);
        timerData.elapsedSeconds = finalElapsedSeconds; // Store final elapsed time
        console.log('Final elapsed time for screen', screenId, ':', finalElapsedSeconds, 'seconds');

        // Calculate and display cost
        calculateAndDisplayCost(card, screenId, finalElapsedSeconds, hourlyRate);

        // Update button states
        const startBtn = card.querySelector('.start-btn');
        const stopBtn = card.querySelector('.stop-btn');
        const resetBtn = card.querySelector('.reset-card-btn');
        const timerBtn = card.querySelector('.timer-btn');

        if (startBtn) startBtn.disabled = false;
        if (stopBtn) stopBtn.disabled = true;
        if (resetBtn) resetBtn.disabled = false; // Keep reset enabled after stopping
        if (timerBtn) timerBtn.disabled = false; // Re-enable timer button

        card.classList.remove('active'); // Remove active class
        return true;
    } catch (error) {
        console.error('Error stopping timer:', error);
        return false;
    }
}

export function resetCard(card, screenId, hourlyRate) {
    console.log('Resetting card for screen', screenId);

    try {
        // Stop timer if running
        if (screenTimers[screenId] && screenTimers[screenId].intervalId) {
            clearInterval(screenTimers[screenId].intervalId);
            console.log('Cleared regular timer interval for screen', screenId);
        }

        // Stop countdown timer if running
        if (countdownTimers[screenId] && countdownTimers[screenId].intervalId) {
            clearInterval(countdownTimers[screenId].intervalId);
            console.log('Cleared countdown timer interval for screen', screenId);

            // Remove countdown display if exists
            const countdownDisplay = card.querySelector('.countdown-display');
            if (countdownDisplay) {
                countdownDisplay.remove();
                console.log('Removed countdown display for screen', screenId);
            }

            delete countdownTimers[screenId];
        }

        // Clear timer data
        delete screenTimers[screenId];

        // Reset UI elements
        const timeDisplay = card.querySelector('.time-display');
        const costDisplay = card.querySelector('.cost-display');
        const startBtn = card.querySelector('.start-btn');
        const stopBtn = card.querySelector('.stop-btn');
        const resetBtn = card.querySelector('.reset-card-btn');
        const timerBtn = card.querySelector('.timer-btn');

        if (timeDisplay) timeDisplay.textContent = '00:00:00';
        if (costDisplay) {
            costDisplay.textContent = '';
            costDisplay.classList.remove('visible');
        }
        card.classList.remove('active');

        // Reset button states
        if (startBtn) startBtn.disabled = !hourlyRate; // Enable only if rate is set
        if (stopBtn) stopBtn.disabled = true;
        if (resetBtn) resetBtn.disabled = true;
        if (timerBtn) timerBtn.disabled = !hourlyRate; // Enable timer button only if rate is set

        console.log('Card reset complete for screen', screenId);
        return true;
    } catch (error) {
        console.error('Error resetting card:', error);
        return false;
    }
}

// --- Helper Functions ---
export function updateTimeDisplay(element, totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    element.textContent =
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function calculateAndDisplayCost(card, screenId, elapsedSeconds, hourlyRate) {
    if (!hourlyRate) return;

    // حساب التكلفة وتقريبها للأعلى
    const cost = (hourlyRate * elapsedSeconds) / 3600;
    const roundedCost = Math.ceil(cost); // تقريب للأعلى
    const costDisplay = card.querySelector('.cost-display');
    costDisplay.textContent = `التكلفة: ${roundedCost} ل.س`;
    costDisplay.classList.add('visible'); // Make cost visible
}

// --- Countdown Timer Functions ---
export function startCountdownTimer(screenId, options, hourlyRate, showNotification) {
    console.log('Starting countdown timer for screen', screenId, 'with options:', options);

    if (!hourlyRate) {
        console.error('No hourly rate set');
        return false;
    }

    let seconds = 0;
    let inputCost = null;

    if (options.type === 'minutes') {
        seconds = options.value * 60;
        console.log('Countdown set for', options.value, 'minutes (', seconds, 'seconds)');
    } else if (options.type === 'cost') {
        inputCost = options.value;
        const hours = options.value / hourlyRate;
        seconds = Math.floor(hours * 3600);
        console.log('Countdown set for cost', options.value, '(', seconds, 'seconds)');
    }

    if (seconds <= 0) {
        console.error('Invalid countdown time');
        return false;
    }

    try {
        // Get the card
        const card = document.querySelector(`.screen-card[data-screen-id="${screenId}"]`);
        if (!card) {
            console.error('Card not found for screen', screenId);
            return false;
        }

        // Stop any running timer for this screen only
        if (screenTimers[screenId] && screenTimers[screenId].intervalId) {
            clearInterval(screenTimers[screenId].intervalId);
            delete screenTimers[screenId];
            console.log('Cleared existing regular timer for screen', screenId);
        }

        // Stop any running countdown for this screen only
        if (countdownTimers[screenId] && countdownTimers[screenId].intervalId) {
            clearInterval(countdownTimers[screenId].intervalId);
            console.log('Cleared existing countdown timer for screen', screenId);

            // Remove existing countdown display if any
            const existingCountdown = card.querySelector('.countdown-display');
            if (existingCountdown) {
                existingCountdown.remove();
                console.log('Removed existing countdown display for screen', screenId);
            }
        }

        // Set up countdown timer
        const endTime = Date.now() + (seconds * 1000);

        // Add countdown display
        let countdownDisplay = card.querySelector('.countdown-display');
        if (!countdownDisplay) {
            countdownDisplay = document.createElement('div');
            countdownDisplay.classList.add('countdown-display');
            card.appendChild(countdownDisplay);
            console.log('Created new countdown display for screen', screenId);
        }

        // Update UI for this screen only
        card.classList.add('active');

        const startBtn = card.querySelector('.start-btn');
        const stopBtn = card.querySelector('.stop-btn');
        const resetBtn = card.querySelector('.reset-card-btn');
        const timerBtn = card.querySelector('.timer-btn');

        if (startBtn) startBtn.disabled = true;
        if (stopBtn) stopBtn.disabled = true; // تعطيل زر الإيقاف عند بدء العد التنازلي
        if (resetBtn) resetBtn.disabled = false;
        if (timerBtn) timerBtn.disabled = true; // Disable timer button while countdown is active

        // Store countdown timer data for this screen
        countdownTimers[screenId] = {
            intervalId: null,
            endTime: endTime,
            totalSeconds: seconds,
            display: countdownDisplay,
            inputCost: inputCost // تخزين المبلغ المدخل لاستخدامه لاحقاً
        };

        // Update countdown immediately
        updateCountdown(screenId, countdownDisplay, hourlyRate, showNotification);

        // Start the interval for this screen
        const intervalId = setInterval(() => {
            try {
                // Check if the countdown timer still exists
                if (!countdownTimers[screenId]) {
                    clearInterval(intervalId);
                    console.log('Countdown timer no longer exists for screen', screenId);
                    return;
                }

                // Get the current countdown display (it might have changed)
                const currentDisplay = card.querySelector('.countdown-display');

                if (!updateCountdown(screenId, currentDisplay || countdownDisplay, hourlyRate, showNotification)) {
                    // Time's up
                    console.log('Countdown finished for screen', screenId);
                    clearInterval(intervalId);

                    // Remove countdown display if it still exists
                    const displayToRemove = card.querySelector('.countdown-display');
                    if (displayToRemove) {
                        displayToRemove.remove();
                        console.log('Removed countdown display for screen', screenId);
                    }

                    // Update the timer data
                    countdownTimers[screenId].intervalId = null;

                    // إظهار جملة تذكير بالتكلفة
                    const costDisplay = card.querySelector('.cost-display');
                    if (!costDisplay) {
                        console.error('Cost display not found for screen', screenId);
                        return;
                    }

                    // تحديد المبلغ المدخل أو حسابه من الدقائق
                    let cost = 0;

                    try {
                        // الحصول على بيانات المؤقت
                        const timerData = countdownTimers[screenId];

                        if (timerData) {
                            // التحقق من وجود مبلغ مدخل مسبقاً
                            if (timerData.inputCost !== null) {
                                // استخدام المبلغ المدخل مسبقاً
                                cost = timerData.inputCost;
                                console.log(`استخدام المبلغ المدخل: ${cost} ل.س`);
                            } else if (timerData.totalSeconds) {
                                // حساب التكلفة من الدقائق
                                const minutes = timerData.totalSeconds / 60;
                                cost = Math.ceil((hourlyRate * minutes) / 60);
                                console.log(`تم حساب التكلفة: ${cost} ل.س`);
                            } else {
                                // في حالة عدم وجود بيانات المؤقت
                                cost = 100; // قيمة افتراضية
                                console.log('لم يتم العثور على بيانات المؤقت');
                            }
                        } else {
                            cost = 100; // قيمة افتراضية
                        }
                    } catch (error) {
                        console.error('خطأ في حساب التكلفة:', error);
                        cost = 100; // قيمة افتراضية في حالة الخطأ
                    }

                    // إظهار جملة التذكير
                    // استخدام القيمة بدون تقريب للمبلغ المدخل
                    costDisplay.textContent = `تذكير: التكلفة هي ${cost} ل.س`;
                    costDisplay.classList.add('visible');
                    console.log('Displayed reminder cost for screen', screenId);

                    // Reset card
                    // لا نستدعي resetCard لأننا نريد إبقاء جملة التذكير ظاهرة
                    // نقوم فقط بإعادة ضبط حالة الأزرار
                    card.classList.remove('active');

                    if (startBtn) startBtn.disabled = !hourlyRate;
                    if (stopBtn) stopBtn.disabled = true;
                    if (resetBtn) resetBtn.disabled = false;
                    if (timerBtn) timerBtn.disabled = !hourlyRate;

                    // Show notification with the screen number
                    try {
                        const screenNumber = card.querySelector('h3').textContent.match(/\d+/)[0];
                        if (showNotification && typeof showNotification === 'function') {
                            showNotification(`انتهى وقت الشاشة ${screenNumber}`);
                            console.log('Notification shown for screen', screenId);
                        }
                    } catch (error) {
                        console.error('Error showing notification:', error);
                    }
                }
            } catch (error) {
                console.error('Error in countdown interval:', error);
                clearInterval(intervalId);
            }
        }, 1000);

        countdownTimers[screenId].intervalId = intervalId;
        console.log('Countdown timer started for screen', screenId, 'with interval ID', intervalId);
        return true;
    } catch (error) {
        console.error('Error starting countdown timer:', error);
        return false;
    }
}

export function updateCountdown(screenId, displayElement, hourlyRate, showNotification) {
    try {
        const timerData = countdownTimers[screenId];
        if (!timerData || !timerData.endTime) {
            console.log('No timer data or end time for screen', screenId);
            return false;
        }

        const now = Date.now();
        const remaining = timerData.endTime - now;

        if (remaining <= 0) {
            if (displayElement) {
                displayElement.textContent = '00:00';
            }
            console.log('Countdown reached zero for screen', screenId);
            return false; // Time's up
        }

        const remainingSeconds = Math.ceil(remaining / 1000);
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;

        const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        if (displayElement) {
            displayElement.textContent = formattedTime;
        }

        return true; // Still counting
    } catch (error) {
        console.error('Error updating countdown:', error);
        return false;
    }
}
