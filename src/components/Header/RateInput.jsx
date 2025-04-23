import { useState, useRef, useContext } from 'react';
import { RateContext } from '../../context/RateContext';

const RateInput = () => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef(null);
  const { saveHourlyRate } = useContext(RateContext);

  const handleSaveRate = () => {
    const rateValue = parseFloat(inputValue);
    if (!isNaN(rateValue) && rateValue > 0) {
      saveHourlyRate(rateValue);
      setError(false);
    } else {
      setError(true);
      alert('الرجاء إدخال سعر صحيح وأكبر من الصفر.');
      inputRef.current.focus();

      // Reset error visual cue after 2 seconds
      setTimeout(() => {
        setError(false);
      }, 2000);
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') {
      handleSaveRate();
    }
  };

  return (
    <div id="rate-input-area">
      <label htmlFor="hourly-rate-input">سعر الساعة (ل.س): </label>
      <input
        type="number"
        id="hourly-rate-input"
        min="1"
        step="0.5"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyUp={handleKeyUp}
        ref={inputRef}
        className={error ? 'input-error' : ''}
      />
      <button
        id="save-rate-btn"
        className="btn btn-primary ripple-trigger"
        onClick={handleSaveRate}
      >
        حفظ السعر
      </button>
    </div>
  );
};

export default RateInput;
