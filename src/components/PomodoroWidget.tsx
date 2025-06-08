
import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Settings, X, Minimize2, RotateCcw } from 'lucide-react';
import { Task, PomodoroSettings, PomodoroState } from '@/types/productivity';
import { playNotificationSound } from '@/utils/dataManager';

interface PomodoroWidgetProps {
  isVisible: boolean;
  onClose: () => void;
  currentTask: Task | null;
  settings: PomodoroSettings;
  onUpdateSettings: (settings: PomodoroSettings) => void;
  onTaskComplete: (taskId: string, pomodoroTime: number) => void;
}

const PomodoroWidget = ({ 
  isVisible, 
  onClose, 
  currentTask, 
  settings,
  onUpdateSettings,
  onTaskComplete 
}: PomodoroWidgetProps) => {
  const [pomodoroState, setPomodoroState] = useState<PomodoroState>({
    isActive: false,
    currentTask: null,
    timeLeft: settings.workDuration * 60,
    isBreak: false,
    sessionsCompleted: 0,
    isPaused: false,
  });
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 320, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [tempSettings, setTempSettings] = useState(settings);

  useEffect(() => {
    if (currentTask && !pomodoroState.currentTask) {
      setPomodoroState(prev => ({
        ...prev,
        currentTask,
        timeLeft: settings.workDuration * 60,
        isBreak: false,
      }));
    }
  }, [currentTask, settings.workDuration]);

  useEffect(() => {
    setTempSettings(settings);
  }, [settings]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (pomodoroState.isActive && !pomodoroState.isPaused && pomodoroState.timeLeft > 0) {
      interval = setInterval(() => {
        setPomodoroState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }));
      }, 1000);
    } else if (pomodoroState.timeLeft === 0) {
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [pomodoroState.isActive, pomodoroState.isPaused, pomodoroState.timeLeft]);

  const handleTimerComplete = () => {
    playNotificationSound(settings.soundEnabled);
    
    if (!pomodoroState.isBreak) {
      // Work session completed
      const newSessionsCompleted = pomodoroState.sessionsCompleted + 1;
      const isLongBreak = newSessionsCompleted % settings.sessionsBeforeLongBreak === 0;
      const breakDuration = isLongBreak ? settings.longBreak : settings.shortBreak;
      
      if (pomodoroState.currentTask) {
        onTaskComplete(pomodoroState.currentTask.id, settings.workDuration);
      }
      
      setPomodoroState(prev => ({
        ...prev,
        timeLeft: breakDuration * 60,
        isBreak: true,
        sessionsCompleted: newSessionsCompleted,
        isActive: true,
      }));
    } else {
      // Break completed
      setPomodoroState(prev => ({
        ...prev,
        timeLeft: settings.workDuration * 60,
        isBreak: false,
        isActive: false,
      }));
    }
  };

  const startTimer = () => {
    setPomodoroState(prev => ({ ...prev, isActive: true, isPaused: false }));
  };

  const pauseTimer = () => {
    setPomodoroState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const stopTimer = () => {
    setPomodoroState(prev => ({
      ...prev,
      isActive: false,
      isPaused: false,
      timeLeft: prev.isBreak ? settings.workDuration * 60 : prev.timeLeft,
      isBreak: false,
    }));
  };

  const resetTimer = () => {
    setPomodoroState(prev => ({
      ...prev,
      isActive: false,
      isPaused: false,
      timeLeft: prev.isBreak ? 
        (prev.sessionsCompleted % settings.sessionsBeforeLongBreak === 0 ? settings.longBreak : settings.shortBreak) * 60 :
        settings.workDuration * 60,
    }));
  };

  const saveSettings = () => {
    onUpdateSettings(tempSettings);
    setShowSettings(false);
    // Reset timer with new work duration if not in break
    if (!pomodoroState.isBreak && !pomodoroState.isActive) {
      setPomodoroState(prev => ({
        ...prev,
        timeLeft: tempSettings.workDuration * 60,
      }));
    }
  };

  const cancelSettings = () => {
    setTempSettings(settings);
    setShowSettings(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent text selection
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault(); // Prevent text selection during drag
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 300, e.clientX - offsetX)),
        y: Math.max(0, Math.min(window.innerHeight - 200, e.clientY - offsetY)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      // Re-enable text selection
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
    };

    // Disable text selection during drag
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed z-50 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl transition-all duration-200 select-none ${
        isMinimized ? 'w-64 h-16' : 'w-80 h-64'
      } animate-scale-in`}
      style={{ left: position.x, top: position.y }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-3 border-b border-slate-600 cursor-move select-none"
        onMouseDown={handleMouseDown}
        style={{ userSelect: 'none' }}
      >
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${pomodoroState.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
          <span className="text-sm font-medium text-white">
            {pomodoroState.isBreak ? 'Break Time' : 'Focus Time'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-slate-700 rounded text-gray-300"
          >
            <Minimize2 size={14} />
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded text-gray-300"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="p-4 space-y-4">
          {/* Current Task */}
          {pomodoroState.currentTask && (
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">Working on:</p>
              <p className="text-sm font-medium text-white truncate">
                {pomodoroState.currentTask.text}
              </p>
            </div>
          )}

          {/* Timer Display */}
          <div className="text-center">
            <div className="text-3xl font-mono font-bold text-white mb-2">
              {formatTime(pomodoroState.timeLeft)}
            </div>
            <div className="text-xs text-gray-400">
              Session {pomodoroState.sessionsCompleted + 1} • {pomodoroState.isBreak ? 'Break' : 'Focus'}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            {!pomodoroState.isActive ? (
              <button
                onClick={startTimer}
                className="p-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors"
              >
                <Play size={16} />
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="p-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white transition-colors"
              >
                <Pause size={16} />
              </button>
            )}
            <button
              onClick={stopTimer}
              className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
            >
              <Square size={16} />
            </button>
            <button
              onClick={resetTimer}
              className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
            >
              <RotateCcw size={16} />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 bg-slate-600 hover:bg-slate-700 rounded-lg text-white transition-colors"
            >
              <Settings size={16} />
            </button>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="absolute top-full left-0 right-0 bg-slate-800 border border-slate-600 rounded-lg p-3 mt-1 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-300">Work (min)</label>
                <input
                  type="number"
                  value={tempSettings.workDuration}
                  onChange={(e) => setTempSettings({ ...tempSettings, workDuration: Number(e.target.value) })}
                  className="w-16 px-2 py-1 bg-slate-700 text-white text-xs rounded"
                  min="1"
                  max="120"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-300">Short Break</label>
                <input
                  type="number"
                  value={tempSettings.shortBreak}
                  onChange={(e) => setTempSettings({ ...tempSettings, shortBreak: Number(e.target.value) })}
                  className="w-16 px-2 py-1 bg-slate-700 text-white text-xs rounded"
                  min="1"
                  max="30"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-300">Long Break</label>
                <input
                  type="number"
                  value={tempSettings.longBreak}
                  onChange={(e) => setTempSettings({ ...tempSettings, longBreak: Number(e.target.value) })}
                  className="w-16 px-2 py-1 bg-slate-700 text-white text-xs rounded"
                  min="1"
                  max="60"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-300">Sound</label>
                <input
                  type="checkbox"
                  checked={tempSettings.soundEnabled}
                  onChange={(e) => setTempSettings({ ...tempSettings, soundEnabled: e.target.checked })}
                  className="w-4 h-4"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={saveSettings}
                  className="flex-1 py-1 bg-green-600 hover:bg-green-700 rounded text-xs text-white transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={cancelSettings}
                  className="flex-1 py-1 bg-gray-600 hover:bg-gray-700 rounded text-xs text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Minimized View */}
      {isMinimized && (
        <div className="flex items-center justify-between p-3">
          <div className="text-sm font-mono text-white">
            {formatTime(pomodoroState.timeLeft)}
          </div>
          <div className="flex items-center gap-1">
            {!pomodoroState.isActive ? (
              <button onClick={startTimer} className="p-1 text-green-400 hover:bg-slate-700 rounded">
                <Play size={12} />
              </button>
            ) : (
              <button onClick={pauseTimer} className="p-1 text-yellow-400 hover:bg-slate-700 rounded">
                <Pause size={12} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PomodoroWidget;
