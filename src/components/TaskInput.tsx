
import React, { useState } from 'react';
import { Plus, Minus, Play } from 'lucide-react';
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

  const completedPomodoros = tasks.filter(task => task.pomodoroCompleted).length;

  return (
    <div className="backdrop-blur-md rounded-xl p-4 border border-slate-700/20 hover:border-slate-600/30 hover:shadow-lg transition-all duration-300 bg-slate-800/10">
      {/* Task Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-3 mb-4">
        <input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="What needs to be done today?"
          className="flex-1 px-4 py-3 bg-slate-700/30 border border-slate-600/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/60 focus:bg-slate-700/40 transition-all duration-300"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-purple-600/80 to-violet-600/80 hover:from-purple-600/90 hover:to-violet-600/90 hover:shadow-purple-500/25 hover:shadow-lg rounded-lg text-white font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Add Task</span>
        </button>
      </form>

      {/* Task List or Empty State */}
      {tasks.length > 0 ? (
        <div className="space-y-2">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className="group flex items-center justify-between px-4 py-3 bg-slate-700/20 rounded-lg border border-slate-600/20 hover:border-slate-500/40 hover:bg-slate-700/30 hover:shadow-md transition-all duration-300"
            >
              <div className="flex-1 min-w-0 flex items-center justify-between">
                <p className="text-white font-medium truncate mr-4">{task.text}</p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-400 bg-slate-600/30 px-2 py-1 rounded">
                    {new Date(task.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                  <span className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded border border-blue-400/20">
                    {task.session}
                  </span>
                  {task.pomodoroTime && task.pomodoroTime > 0 && (
                    <span className="text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded flex items-center gap-1 border border-red-400/20">
                      🍅 {task.pomodoroTime}m
                    </span>
                  )}
                  {task.pomodoroCompleted && (
                    <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded border border-green-400/20">
                      ✓
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-1 ml-3">
                <button
                  onClick={() => onStartPomodoro(task)}
                  className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-all duration-200 hover:scale-110"
                  title="Start Pomodoro"
                >
                  <Play size={16} />
                </button>
                <button
                  onClick={() => onDeleteTask(index)}
                  className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-200 hover:scale-110"
                  title="Delete task"
                >
                  <Minus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-400 text-sm mb-2">
            Add your first task and build your momentum
          </p>
        </div>
      )}

      {/* Pomodoro Count */}
      <div className="mt-4 pt-3 border-t border-slate-700/30">
        <p className="text-sm text-gray-400">
          Pomodoros completed today: <span className="text-white font-medium">{completedPomodoros}</span>
        </p>
      </div>
    </div>
  );
};

export default TaskInput;
