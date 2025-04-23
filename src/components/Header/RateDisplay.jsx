import { useContext } from 'react';
import { RateContext } from '../../context/RateContext';

const RateDisplay = () => {
  const { hourlyRate, handleEditRate } = useContext(RateContext);

  const onEditClick = () => {
    const canEdit = handleEditRate();
    if (!canEdit) {
      alert('لا يمكن تعديل سعر الساعة أثناء تشغيل المؤقتات. قم بإيقاف جميع المؤقتات أولاً.');
    }
  };

  return (
    <div id="rate-display-area">
      <span id="current-rate-display">
        السعر الحالي: <span>{Math.round(hourlyRate)}</span> ل.س/ساعة
      </span>
      <button
        id="edit-rate-btn"
        className="btn btn-edit ripple-trigger"
        onClick={onEditClick}
      >
        تعديل
      </button>
    </div>
  );
};

export default RateDisplay;
