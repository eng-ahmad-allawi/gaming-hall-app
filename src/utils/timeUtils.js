export const formatTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const formatCountdownTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const calculateTimeFromCost = (cost, hourlyRate) => {
  if (!cost || !hourlyRate || cost <= 0 || hourlyRate <= 0) {
    return null;
  }
  
  const hours = cost / hourlyRate;
  const minutes = Math.floor(hours * 60);
  const seconds = Math.floor((hours * 3600) % 60);
  const totalSeconds = Math.floor(hours * 3600);
  
  return {
    minutes,
    seconds,
    totalSeconds,
    formatted: `${minutes} دقيقة و ${seconds} ثانية`
  };
};
