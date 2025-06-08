
export const getSessionColor = (taskCount: number): string => {
  const baseHue = 210; // Blue base color
  
  if (taskCount === 0) {
    return 'hsl(210, 10%, 15%)'; // Very dark gray for no tasks
  }
  
  // Progressive color calculation
  const saturation = Math.min(60 + taskCount * 10, 90);
  const lightness = Math.max(85 - taskCount * 8, 25);
  
  return `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
};

export const getHeatmapColor = (taskCount: number): string => {
  return getSessionColor(taskCount);
};
