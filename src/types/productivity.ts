
export interface Task {
  text: string;
  timestamp: string;
  session: 'Morning' | 'Midday' | 'Afternoon' | 'Night';
  day: string; // YYYY-MM-DD format
}

export interface AppData {
  tasks: Task[];
  streak: number;
  avgTasksPerDay: number;
  lastActive: string;
}

export interface SessionData {
  name: 'Morning' | 'Midday' | 'Afternoon' | 'Night';
  timeRange: string;
  tasks: Task[];
  taskCount: number;
}
