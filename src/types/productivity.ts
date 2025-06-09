export interface Task {
  id: string;
  text: string;
  timestamp: string;
  session: 'Morning' | 'Midday' | 'Afternoon' | 'Night';
  day: string; // YYYY-MM-DD format
  pomodoroTime?: number; // minutes spent in pomodoro
  completed?: boolean;
  pomodoroCompleted?: boolean; // Track if pomodoro was completed for this task
}

export interface AppData {
  tasks: Task[];
  streak: number;
  avgTasksPerDay: number;
  lastActive: string;
  mainGoal: string;
  customSessions: SessionConfig[];
  colorTheme: ColorTheme;
  pomodoroSettings: PomodoroSettings;
  taskTemplates: string[];
  sessionTargets: { [sessionName: string]: number };
}

export interface SessionConfig {
  name: string;
  timeRange: string;
  startHour: number;
  endHour: number;
  id: 'Morning' | 'Midday' | 'Afternoon' | 'Night';
}

export interface SessionData {
  name: 'Morning' | 'Midday' | 'Afternoon' | 'Night';
  timeRange: string;
  tasks: Task[];
  taskCount: number;
}

export interface ColorTheme {
  baseHue: number;
  name: string;
}

export interface PomodoroSettings {
  workDuration: number; // minutes
  shortBreak: number; // minutes
  longBreak: number; // minutes
  sessionsBeforeLongBreak: number;
  soundEnabled: boolean;
}

export interface PomodoroState {
  isActive: boolean;
  currentTask: Task | null;
  timeLeft: number; // seconds
  isBreak: boolean;
  sessionsCompleted: number;
  isPaused: boolean;
}
