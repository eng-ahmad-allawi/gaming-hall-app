export const calculateCost = (elapsedSeconds, hourlyRate) => {
  if (!hourlyRate || elapsedSeconds <= 0) {
    return 0;
  }
  
  const hours = elapsedSeconds / 3600;
  const cost = hours * hourlyRate;
  
  return Math.ceil(cost);
};

export const calculateSecondsFromCost = (cost, hourlyRate) => {
  if (!cost || !hourlyRate || cost <= 0 || hourlyRate <= 0) {
    return 0;
  }
  
  const hours = cost / hourlyRate;
  return Math.floor(hours * 3600);
};
