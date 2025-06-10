
import React, { useState } from 'react';
import { Plus, Minus, Play, Sparkles, Target, Zap } from 'lucide-react';
import { Task } from '@/types/productivity';

interface TaskInputProps {
  onAddTask: (task: string) => void;
  tasks: Task[];
  onDeleteTask: (index: number) => void;
  onStartPomodoro: (task: Task) => void;
}

const TaskInput = ({ onAddTask, tasks, onDeleteTask, onStartPomodoro }: TaskInputProps) => {
  const [taskText, setTaskText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskText.trim()) {
      onAddTask(taskText.trim());
      setTaskText('');
    }
  };

  const suggestedTasks = [
    "Review quarterly goals 📊",
    "Complete presentation slides 🎯",
    "Schedule team standup 👥",
    "Update project documentation 📝"
  ];

  return (
    <div className="backdrop-blur-md rounded-2xl p-6 border border-slate-700/20 hover:border-slate-600/30 transition-all duration-300 bg-slate-800/10">
      {/* Task Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="What needs to be conquered today?"
            className="w-full px-5 py-4 bg-slate-700/30 backdrop-blur-sm border border-slate-600/40 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/60 focus:bg-slate-700/40 transition-all duration-300 text-lg"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
            <Sparkles size={20} />
          </div>
        </div>
        <button
          type="submit"
          className="px-8 py-4 bg-gradient-to-r from-blue-600/80 to-violet-600/80 hover:from-blue-600/90 hover:to-violet-600/90 backdrop-blur-sm rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-3 border border-blue-500/20 hover:border-blue-400/40"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Add Task</span>
        </button>
      </form>

      {/* Task List or Empty State */}
      {tasks.length > 0 ? (
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className="group flex items-center justify-between px-5 py-4 bg-slate-700/20 backdrop-blur-sm rounded-xl border border-slate-600/20 hover:border-slate-500/40 hover:bg-slate-700/30 transition-all duration-300 hover:scale-[1.01]"
            >
              <div className="flex-1 min-w-0 flex items-center justify-between">
                <p className="text-white font-medium truncate mr-4 text-lg">{task.text}</p>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-sm text-gray-400 bg-slate-600/30 px-3 py-1 rounded-full">
                    {new Date(task.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                  <span className="text-sm text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20">
                    {task.session}
                  </span>
                  {task.pomodoroTime && task.pomodoroTime > 0 && (
                    <span className="text-sm text-red-400 bg-red-400/10 px-3 py-1 rounded-full flex items-center gap-2 border border-red-400/20">
                      🍅 {task.pomodoroTime}m
                    </span>
                  )}
                  {task.pomodoroCompleted && (
                    <span className="text-sm text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">
                      ✓
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => onStartPomodoro(task)}
                  className="p-3 text-green-400 hover:bg-green-400/10 rounded-xl transition-all duration-200 hover:scale-110 border border-transparent hover:border-green-400/20"
                  title="Start Pomodoro"
                >
                  <Play size={18} />
                </button>
                <button
                  onClick={() => onDeleteTask(index)}
                  className="p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-200 hover:scale-110 border border-transparent hover:border-red-400/20"
                  title="Delete task"
                >
                  <Minus size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Enhanced Empty State
        <div className="text-center py-12">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500/20 to-violet-500/20 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/20">
              <Target size={32} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              You're 1 step away from winning the day! ✨
            </h3>
            <p className="text-gray-400 mb-6">
              Add your first task and start building momentum
            </p>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-300 mb-3">💡 Quick suggestions:</p>
            <div className="grid gap-2">
              {suggestedTasks.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => onAddTask(suggestion)}
                  className="text-left px-4 py-3 bg-slate-700/20 hover:bg-slate-700/40 rounded-lg text-gray-300 hover:text-white transition-all duration-200 border border-slate-600/20 hover:border-slate-500/40 hover:scale-[1.02]"
                >
                  <Zap size={14} className="inline mr-2 text-amber-400" />
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskInput;
