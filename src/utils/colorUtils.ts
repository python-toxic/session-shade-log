
import { ColorTheme } from '@/types/productivity';

export const colorThemes: ColorTheme[] = [
  { name: 'Ocean Blue', baseHue: 210 },
  { name: 'Forest Green', baseHue: 120 },
  { name: 'Royal Purple', baseHue: 270 },
  { name: 'Sunset Orange', baseHue: 30 },
  { name: 'Rose Pink', baseHue: 330 },
];

// Unique colors for each session
export const sessionColors = {
  Morning: { hue: 200, name: 'Cool Blue' },    // Cool blue for morning
  Midday: { hue: 45, name: 'Golden Yellow' },  // Golden yellow for midday
  Afternoon: { hue: 25, name: 'Warm Orange' }, // Warm orange for afternoon
  Night: { hue: 260, name: 'Deep Purple' }     // Deep purple for night
};

export const getSessionColor = (taskCount: number, theme: ColorTheme, hasCompletedPomodoros: boolean = false, sessionName?: string): string => {
  // Use session-specific colors if available
  const sessionColor = sessionName && sessionColors[sessionName as keyof typeof sessionColors];
  const baseHue = sessionColor ? sessionColor.hue : theme.baseHue;
  
  if (taskCount === 0) {
    return `hsla(${baseHue}, 20%, 8%, 0.4)`; // Very subtle for no tasks
  }
  
  // Only darken when Pomodoro is completed, not just when tasks are added
  const baseSaturation = 60;
  const baseLightness = hasCompletedPomodoros ? 12 : 18; // Darker only with completed Pomodoros
  const alpha = 0.6 + (taskCount * 0.1); // Increase opacity with more tasks
  
  return `hsla(${baseHue}, ${baseSaturation}%, ${baseLightness}%, ${Math.min(alpha, 0.9)})`;
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
