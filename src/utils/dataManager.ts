
import { Task, AppData } from '@/types/productivity';

const STORAGE_KEY = 'productivity_app_data';

export const loadData = (): AppData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
  }
  
  return {
    tasks: [],
    streak: 0,
    avgTasksPerDay: 0,
    lastActive: new Date().toISOString().split('T')[0]
  };
};

export const saveData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
};

export const getCurrentSession = (date: Date): 'Morning' | 'Midday' | 'Afternoon' | 'Night' => {
  const hour = date.getHours();
  
  if (hour >= 5 && hour < 10) return 'Morning';
  if (hour >= 10 && hour < 15) return 'Midday';
  if (hour >= 15 && hour < 20) return 'Afternoon';
  return 'Night'; // 20-24 and 0-5
};

export const calculateStats = (tasks: Task[]) => {
  // Calculate streak (consecutive days with at least 1 task)
  const streak = calculateStreak(tasks);
  
  // Calculate average tasks per day (last 30 days)
  const avgTasksPerDay = calculateAverageTasksPerDay(tasks);
  
  return { streak, avgTasksPerDay };
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
      // If today has no tasks, don't break the streak yet
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
