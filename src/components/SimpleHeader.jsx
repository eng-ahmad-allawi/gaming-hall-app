import React, { useContext, useState } from 'react';
import { RateContext } from '../context/RateContext';

const SimpleHeader = () => {
  const { hourlyRate, setHourlyRate } = useContext(RateContext);
  const [inputValue, setInputValue] = useState('');

  const handleSaveRate = () => {
    const rate = parseFloat(inputValue);
    if (!isNaN(rate) && rate > 0) {
      setHourlyRate(rate);
      setInputValue('');
    } else {
      alert('الرجاء إدخال سعر صحيح');
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="logo">صالة الألعاب</div>
        <div className="rate-section">
          {hourlyRate ? (
            <div className="rate-display">
              <span>السعر الحالي: {hourlyRate} ل.س/ساعة</span>
              <button onClick={() => setHourlyRate(null)}>تعديل</button>
            </div>
          ) : (
            <div className="rate-input">
              <label>سعر الساعة (ل.س): </label>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                min="1"
              />
              <button onClick={handleSaveRate}>حفظ</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default SimpleHeader;
