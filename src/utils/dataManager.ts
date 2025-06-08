import { Task, AppData, SessionConfig, ColorTheme, PomodoroSettings } from '@/types/productivity';
import { colorThemes } from './colorUtils';

const STORAGE_KEY = 'productivity_app_data';

const defaultSessions: SessionConfig[] = [
  { id: 'Morning', name: 'Morning', timeRange: '5AM - 10AM', startHour: 5, endHour: 10 },
  { id: 'Midday', name: 'Midday', timeRange: '10AM - 3PM', startHour: 10, endHour: 15 },
  { id: 'Afternoon', name: 'Afternoon', timeRange: '3PM - 8PM', startHour: 15, endHour: 20 },
  { id: 'Night', name: 'Night', timeRange: '8PM - 2AM', startHour: 20, endHour: 26 },
];

const defaultPomodoroSettings: PomodoroSettings = {
  workDuration: 25,
  shortBreak: 5,
  longBreak: 15,
  sessionsBeforeLongBreak: 4,
  soundEnabled: true,
};

export const loadData = (): AppData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return {
        ...data,
        customSessions: data.customSessions || defaultSessions,
        colorTheme: data.colorTheme || colorThemes[0],
        pomodoroSettings: data.pomodoroSettings || defaultPomodoroSettings,
        taskTemplates: data.taskTemplates || ['Review emails', 'Plan day', 'Exercise', 'Read'],
        sessionTargets: data.sessionTargets || { Morning: 3, Midday: 4, Afternoon: 3, Night: 2 },
        mainGoal: data.mainGoal || 'Focus on what matters most today',
      };
    }
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
  }
  
  return {
    tasks: [],
    streak: 0,
    avgTasksPerDay: 0,
    lastActive: new Date().toISOString().split('T')[0],
    mainGoal: 'Focus on what matters most today',
    customSessions: defaultSessions,
    colorTheme: colorThemes[0],
    pomodoroSettings: defaultPomodoroSettings,
    taskTemplates: ['Review emails', 'Plan day', 'Exercise', 'Read'],
    sessionTargets: { Morning: 3, Midday: 4, Afternoon: 3, Night: 2 },
  };
};

export const saveData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
};

export const getCurrentSession = (date: Date, customSessions: SessionConfig[]): 'Morning' | 'Midday' | 'Afternoon' | 'Night' => {
  const hour = date.getHours();
  
  for (const session of customSessions) {
    const startHour = session.startHour;
    const endHour = session.endHour > 24 ? session.endHour - 24 : session.endHour;
    
    if (session.endHour > 24) {
      // Session spans midnight
      if (hour >= startHour || hour < endHour) {
        return session.id;
      }
    } else {
      if (hour >= startHour && hour < endHour) {
        return session.id;
      }
    }
  }
  
  return 'Night'; // fallback
};

export const calculateStats = (tasks: Task[]) => {
  const streak = calculateStreak(tasks);
  const avgTasksPerDay = calculateAverageTasksPerDay(tasks);
  
  return { streak, avgTasksPerDay };
};

export const generateTaskId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const playNotificationSound = (enabled: boolean) => {
  if (!enabled) return;
  
  // Create a simple beep sound
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = 800;
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.2);
};

const calculateStreak = (tasks: Task[]): number => {
  if (tasks.length === 0) return 0;
  
  const today = new Date();
  let streak = 0;
  let currentDate = new Date(today);
  
  while (true) {
    const dateString = currentDate.toISOString().split('T')[0];
    const dayTasks = tasks.filter(task => task.day === dateString);
    
    if (dayTasks.length > 0) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      if (dateString === today.toISOString().split('T')[0]) {
        currentDate.setDate(currentDate.getDate() - 1);
        continue;
      }
      break;
    }
  }
  
  return streak;
};

const calculateAverageTasksPerDay = (tasks: Task[]): number => {
  const last30Days = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    last30Days.push(date.toISOString().split('T')[0]);
  }
  
  const totalTasks = last30Days.reduce((sum, day) => {
    const dayTasks = tasks.filter(task => task.day === day);
    return sum + dayTasks.length;
  }, 0);
  
  return totalTasks / 30;
};
