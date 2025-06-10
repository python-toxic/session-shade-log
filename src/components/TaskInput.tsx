
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
    <div className="glass-morphism rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300">
      {/* Fixed Task Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-3 mb-4">
        <input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="What needs to be done today?"
          className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/60 focus:bg-white/10 transition-all duration-300"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 rounded-lg text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center gap-2"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Add Task</span>
        </button>
      </form>

      {/* Scrollable Task List - Show only 3 tasks at a time */}
      {tasks.length > 0 ? (
        <div className="h-[180px] overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className="group flex items-center justify-between px-3 py-2 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all duration-300 h-12"
            >
              <div className="flex-1 min-w-0 flex items-center justify-between">
                <p className="text-white font-medium truncate mr-4 text-sm">{task.text}</p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded">
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
                  <Play size={14} />
                </button>
                <button
                  onClick={() => onDeleteTask(index)}
                  className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-200 hover:scale-110"
                  title="Delete task"
                >
                  <Minus size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 h-[180px] flex items-center justify-center">
          <div>
            <p className="text-gray-400 text-sm mb-2">
              You're 1 step away from winning the day! ✍️
            </p>
            <p className="text-gray-500 text-xs">
              Add your first task and build your momentum
            </p>
          </div>
        </div>
      )}

      {/* Pomodoro Count */}
      <div className="mt-4 pt-3 border-t border-white/10">
        <p className="text-sm text-gray-400">
          Pomodoros completed today: <span className="text-white font-medium">{completedPomodoros}</span>
        </p>
      </div>
    </div>
  );
};

export default TaskInput;
