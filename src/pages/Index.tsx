import React, { useState, useEffect } from 'react';
import TimeDisplay from '@/components/TimeDisplay';
import TaskInput from '@/components/TaskInput';
import SessionGrid from '@/components/SessionGrid';
import MonthlyHeatmap from '@/components/MonthlyHeatmap';
import StatsPanel from '@/components/StatsPanel';
import MainGoal from '@/components/MainGoal';
import PomodoroWidget from '@/components/PomodoroWidget';
import TaskTemplates from '@/components/TaskTemplates';
import { Task, AppData } from '@/types/productivity';
import { loadData, saveData, getCurrentSession, calculateStats, generateTaskId, playNotificationSound } from '@/utils/dataManager';
import { colorThemes } from '@/utils/colorUtils';
import { Eye, EyeOff, Palette, Settings, Download, Keyboard } from 'lucide-react';

const Index = () => {
  const [appData, setAppData] = useState<AppData>({
    tasks: [],
    streak: 0,
    avgTasksPerDay: 0,
    lastActive: new Date().toISOString().split('T')[0],
    mainGoal: 'Focus on what matters most today',
    customSessions: [],
    colorTheme: colorThemes[0],
    pomodoroSettings: {
      workDuration: 25,
      shortBreak: 5,
      longBreak: 15,
      sessionsBeforeLongBreak: 4,
      soundEnabled: true,
    },
    taskTemplates: [],
    sessionTargets: {},
  });
  const [focusMode, setFocusMode] = useState(false);
  const [showPomodoroWidget, setShowPomodoroWidget] = useState(false);
  const [currentPomodoroTask, setCurrentPomodoroTask] = useState<Task | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  useEffect(() => {
    const data = loadData();
    setAppData(data);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'Enter':
            e.preventDefault();
            const taskInput = document.querySelector('input[placeholder*="What needs"]') as HTMLInputElement;
            taskInput?.focus();
            break;
          case 'f':
            e.preventDefault();
            setFocusMode(!focusMode);
            break;
          case 'p':
            e.preventDefault();
            setShowPomodoroWidget(!showPomodoroWidget);
            break;
          case '/':
            e.preventDefault();
            setShowKeyboardShortcuts(!showKeyboardShortcuts);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [focusMode, showPomodoroWidget, showKeyboardShortcuts]);

  const addTask = (taskText: string) => {
    const now = new Date();
    const newTask: Task = {
      id: generateTaskId(),
      text: taskText,
      timestamp: now.toISOString(),
      session: getCurrentSession(now, appData.customSessions),
      day: now.toISOString().split('T')[0],
      pomodoroTime: 0,
      completed: false,
    };

    const updatedTasks = [...appData.tasks, newTask];
    const updatedData = {
      ...appData,
      tasks: updatedTasks,
      ...calculateStats(updatedTasks),
      lastActive: newTask.day,
    };

    setAppData(updatedData);
    saveData(updatedData);
    playNotificationSound(appData.pomodoroSettings.soundEnabled);
  };

  const deleteTask = (taskIndex: number) => {
    const updatedTasks = appData.tasks.filter((_, index) => index !== taskIndex);
    const updatedData = {
      ...appData,
      tasks: updatedTasks,
      ...calculateStats(updatedTasks),
    };

    setAppData(updatedData);
    saveData(updatedData);
  };

  const startPomodoroForTask = (task: Task) => {
    setCurrentPomodoroTask(task);
    setShowPomodoroWidget(true);
  };

  const updateTaskPomodoroTime = (taskId: string, pomodoroTime: number) => {
    const updatedTasks = appData.tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            pomodoroTime: (task.pomodoroTime || 0) + pomodoroTime,
            pomodoroCompleted: true // Mark as completed when Pomodoro finishes
          }
        : task
    );
    
    const updatedData = { ...appData, tasks: updatedTasks };
    setAppData(updatedData);
    saveData(updatedData);
  };

  const updateMainGoal = (goal: string) => {
    const updatedData = { ...appData, mainGoal: goal };
    setAppData(updatedData);
    saveData(updatedData);
  };

  const updateColorTheme = (theme: typeof colorThemes[0]) => {
    const updatedData = { ...appData, colorTheme: theme };
    setAppData(updatedData);
    saveData(updatedData);
  };

  const updateTaskTemplates = (templates: string[]) => {
    const updatedData = { ...appData, taskTemplates: templates };
    setAppData(updatedData);
    saveData(updatedData);
  };

  const updateSessionTargets = (targets: { [sessionName: string]: number }) => {
    const updatedData = { ...appData, sessionTargets: targets };
    setAppData(updatedData);
    saveData(updatedData);
  };

  const exportData = (format: 'json' | 'csv') => {
    const today = new Date().toISOString().split('T')[0];
    
    if (format === 'json') {
      const dataStr = JSON.stringify(appData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `productivity-data-${today}.json`;
      link.click();
    } else {
      const csvHeaders = 'Date,Task,Session,Pomodoro Time (min),Completed\n';
      const csvData = appData.tasks.map(task => 
        `${task.day},${task.text.replace(/,/g, ';')},${task.session},${task.pomodoroTime || 0},${task.completed || false}`
      ).join('\n');
      
      const csvBlob = new Blob([csvHeaders + csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(csvBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `productivity-tasks-${today}.csv`;
      link.click();
    }
  };

  const getTodaysTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    return appData.tasks.filter(task => task.day === today);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900 text-white">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header with improved typography */}
        <div className={`flex items-center justify-between mb-12 focus-mode-transition ${
          focusMode ? 'animate-slide-in-center' : 'animate-fade-in'
        }`}>
          <TimeDisplay />
          <div className="flex items-center gap-4">
            <TaskTemplates 
              templates={appData.taskTemplates}
              onAddTask={addTask}
              onUpdateTemplates={updateTaskTemplates}
            />
            <button
              onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/40 hover:bg-slate-700/50 backdrop-blur-md rounded-xl transition-all duration-300 hover:scale-105 border border-slate-700/30 hover:border-blue-500/30"
              title="Keyboard Shortcuts (Ctrl+/)"
            >
              <Keyboard size={16} />
              <span className="text-sm hidden sm:inline">Shortcuts</span>
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/40 hover:bg-slate-700/50 backdrop-blur-md rounded-xl transition-all duration-300 hover:scale-105 border border-slate-700/30 hover:border-violet-500/30"
            >
              <Settings size={16} />
              <span className="text-sm hidden sm:inline">Settings</span>
            </button>
            <button
              onClick={() => setFocusMode(!focusMode)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 backdrop-blur-md rounded-xl transition-all duration-300 hover:scale-105 border border-blue-500/30 hover:border-blue-400/50"
            >
              {focusMode ? <Eye size={16} /> : <EyeOff size={16} />}
              <span className="text-sm font-medium">{focusMode ? 'Exit Focus' : 'Focus Mode'}</span>
            </button>
          </div>
        </div>

        {/* Main Goal with enhanced prominence */}
        <div className={`focus-mode-transition mb-8 ${focusMode ? 'animate-slide-in-center' : ''}`}>
          <MainGoal goal={appData.mainGoal} onUpdate={updateMainGoal} />
        </div>

        {/* Grid Layout with 12-column system */}
        <div className={`grid gap-8 focus-mode-transition ${
          focusMode ? 'grid-cols-1' : 'grid-cols-12'
        }`}>
          {/* Left Column - Tasks (8 columns in normal mode) */}
          <div className={`space-y-8 focus-mode-transition ${
            focusMode ? 'col-span-1 animate-slide-in-center' : 'col-span-8'
          }`}>
            {/* Today's Tasks with enhanced header */}
            <div className="animate-pop-in">
              <div className="mb-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-2">
                  Today's Tasks
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"></div>
              </div>
              <TaskInput 
                onAddTask={addTask} 
                tasks={getTodaysTasks()} 
                onDeleteTask={deleteTask}
                onStartPomodoro={startPomodoroForTask}
              />
            </div>

            {/* Sessions with enhanced header */}
            <div className="animate-pop-in" style={{ animationDelay: '0.1s' }}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-2">
                  Today's Sessions
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
              </div>
              <SessionGrid 
                tasks={getTodaysTasks()} 
                colorTheme={appData.colorTheme}
                sessionTargets={appData.sessionTargets}
                customSessions={appData.customSessions}
                onUpdateTargets={updateSessionTargets}
              />
            </div>

            {!focusMode && (
              <div className="animate-pop-in" style={{ animationDelay: '0.2s' }}>
                <MonthlyHeatmap tasks={appData.tasks} colorTheme={appData.colorTheme} />
              </div>
            )}
          </div>

          {/* Right Column - Stats Panel (4 columns in normal mode) */}
          {!focusMode && (
            <div className="col-span-4 space-y-6">
              <div className="animate-pop-in" style={{ animationDelay: '0.3s' }}>
                <StatsPanel 
                  streak={appData.streak}
                  avgTasksPerDay={appData.avgTasksPerDay}
                  tasks={appData.tasks}
                />
              </div>
            </div>
          )}
        </div>

        {/* Settings and modals remain the same */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40 animate-fade-in">
            <div className="bg-slate-800/90 backdrop-blur-md border border-slate-600/50 rounded-xl p-6 max-w-md w-full mx-4 animate-scale-in">
              <h3 className="text-lg font-semibold mb-4">Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Color Theme</label>
                  <div className="grid grid-cols-3 gap-2">
                    {colorThemes.map((theme) => (
                      <button
                        key={theme.name}
                        onClick={() => updateColorTheme(theme)}
                        className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                          appData.colorTheme.name === theme.name 
                            ? 'border-blue-500 bg-slate-700/50' 
                            : 'border-slate-600/50 hover:border-slate-500/70'
                        }`}
                      >
                        <div 
                          className="w-full h-4 rounded mb-1"
                          style={{ backgroundColor: `hsl(${theme.baseHue}, 70%, 50%)` }}
                        />
                        <div className="text-xs">{theme.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Export Data</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => exportData('json')}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600/80 hover:bg-blue-700/90 rounded-lg transition-all hover:scale-105"
                    >
                      <Download size={16} />
                      JSON
                    </button>
                    <button
                      onClick={() => exportData('csv')}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-600/80 hover:bg-green-700/90 rounded-lg transition-all hover:scale-105"
                    >
                      <Download size={16} />
                      CSV
                    </button>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setShowSettings(false)}
                className="w-full mt-6 py-2 bg-slate-600/80 hover:bg-slate-700/90 rounded-lg transition-all hover:scale-105"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {showKeyboardShortcuts && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40 animate-fade-in">
            <div className="bg-slate-800/90 backdrop-blur-md border border-slate-600/50 rounded-xl p-6 max-w-md w-full mx-4 animate-scale-in">
              <h3 className="text-lg font-semibold mb-4">Keyboard Shortcuts</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Focus task input</span>
                  <kbd className="px-2 py-1 bg-slate-700/50 rounded text-sm">Ctrl+Enter</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Toggle focus mode</span>
                  <kbd className="px-2 py-1 bg-slate-700/50 rounded text-sm">Ctrl+F</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Toggle pomodoro</span>
                  <kbd className="px-2 py-1 bg-slate-700/50 rounded text-sm">Ctrl+P</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Show shortcuts</span>
                  <kbd className="px-2 py-1 bg-slate-700/50 rounded text-sm">Ctrl+/</kbd>
                </div>
              </div>
              
              <button
                onClick={() => setShowKeyboardShortcuts(false)}
                className="w-full mt-6 py-2 bg-slate-600/80 hover:bg-slate-700/90 rounded-lg transition-all hover:scale-105"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pomodoro Widget */}
      <PomodoroWidget
        isVisible={showPomodoroWidget}
        onClose={() => setShowPomodoroWidget(false)}
        currentTask={currentPomodoroTask}
        settings={appData.pomodoroSettings}
        onUpdateSettings={(settings) => {
          const updatedData = { ...appData, pomodoroSettings: settings };
          setAppData(updatedData);
          saveData(updatedData);
        }}
        onTaskComplete={updateTaskPomodoroTime}
      />
    </div>
  );
};

export default Index;
