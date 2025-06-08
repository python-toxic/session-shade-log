
import React, { useState, useEffect } from 'react';
import TimeDisplay from '@/components/TimeDisplay';
import TaskInput from '@/components/TaskInput';
import SessionGrid from '@/components/SessionGrid';
import MonthlyHeatmap from '@/components/MonthlyHeatmap';
import StatsPanel from '@/components/StatsPanel';
import { Task, AppData } from '@/types/productivity';
import { loadData, saveData, getCurrentSession, calculateStats } from '@/utils/dataManager';
import { Eye, EyeOff } from 'lucide-react';

const Index = () => {
  const [appData, setAppData] = useState<AppData>({
    tasks: [],
    streak: 0,
    avgTasksPerDay: 0,
    lastActive: new Date().toISOString().split('T')[0]
  });
  const [focusMode, setFocusMode] = useState(false);

  useEffect(() => {
    const data = loadData();
    setAppData(data);
  }, []);

  const addTask = (taskText: string) => {
    const now = new Date();
    const newTask: Task = {
      text: taskText,
      timestamp: now.toISOString(),
      session: getCurrentSession(now),
      day: now.toISOString().split('T')[0]
    };

    const updatedTasks = [...appData.tasks, newTask];
    const updatedData = {
      ...appData,
      tasks: updatedTasks,
      ...calculateStats(updatedTasks),
      lastActive: newTask.day
    };

    setAppData(updatedData);
    saveData(updatedData);
  };

  const deleteTask = (taskIndex: number) => {
    const updatedTasks = appData.tasks.filter((_, index) => index !== taskIndex);
    const updatedData = {
      ...appData,
      tasks: updatedTasks,
      ...calculateStats(updatedTasks)
    };

    setAppData(updatedData);
    saveData(updatedData);
  };

  const getTodaysTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    return appData.tasks.filter(task => task.day === today);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <TimeDisplay />
          <div className="flex items-center gap-4">
            <button
              onClick={() => setFocusMode(!focusMode)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              {focusMode ? <Eye size={16} /> : <EyeOff size={16} />}
              <span className="text-sm">{focusMode ? 'Exit Focus' : 'Focus Mode'}</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Task Input and Session Grid */}
          <div className="lg:col-span-2 space-y-6">
            <TaskInput onAddTask={addTask} tasks={getTodaysTasks()} onDeleteTask={deleteTask} />
            <SessionGrid tasks={getTodaysTasks()} />
            {!focusMode && <MonthlyHeatmap tasks={appData.tasks} />}
          </div>

          {/* Right Column - Stats Panel */}
          {!focusMode && (
            <div className="lg:col-span-1">
              <StatsPanel 
                streak={appData.streak}
                avgTasksPerDay={appData.avgTasksPerDay}
                tasks={appData.tasks}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
