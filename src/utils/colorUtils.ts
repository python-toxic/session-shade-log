
import { ColorTheme } from '@/types/productivity';

export const colorThemes: ColorTheme[] = [
  { name: 'Ocean Blue', baseHue: 210 },
  { name: 'Forest Green', baseHue: 120 },
  { name: 'Royal Purple', baseHue: 270 },
  { name: 'Sunset Orange', baseHue: 30 },
  { name: 'Rose Pink', baseHue: 330 },
];

export const getSessionColor = (taskCount: number, theme: ColorTheme): string => {
  const { baseHue } = theme;
  
  if (taskCount === 0) {
    return `hsl(${baseHue}, 10%, 15%)`; // Very dark gray for no tasks
  }
  
  // Progressive color calculation
  const saturation = Math.min(60 + taskCount * 10, 90);
  const lightness = Math.max(85 - taskCount * 8, 25);
  
  return `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
};

export const getHeatmapColor = (taskCount: number, theme: ColorTheme): string => {
  return getSessionColor(taskCount, theme);
};

export const getTargetIndicatorColor = (current: number, target: number, theme: ColorTheme): string => {
  const { baseHue } = theme;
  if (current >= target) {
    return `hsl(${baseHue}, 80%, 50%)`; // Bright when target met
  }
  const progress = current / target;
  const lightness = 15 + (progress * 35); // 15% to 50% lightness
  return `hsl(${baseHue}, 60%, ${lightness}%)`;
};
