
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

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
      <h2 className="text-xl font-semibold mb-6 text-gray-200">Today's Tasks</h2>
      
      {/* Task Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="What needs to be done today?"
          className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors hover-scale flex items-center gap-2"
        >
          <Plus size={18} />
          Add
        </button>
      </form>

      {/* Task List */}
      {tasks.length > 0 ? (
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-slate-500 transition-all hover-scale"
            >
              <div className="flex-1">
                <p className="text-white font-medium">{task.text}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-400">
                    {new Date(task.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                  <span className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded">
                    {task.session}
                  </span>
                  {task.pomodoroTime && task.pomodoroTime > 0 && (
                    <span className="text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded flex items-center gap-1">
                      🍅 {task.pomodoroTime}m
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => onStartPomodoro(task)}
                  className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                  title="Start Pomodoro"
                >
                  <Play size={16} />
                </button>
                <button
                  onClick={() => onDeleteTask(index)}
                  className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  title="Delete task"
                >
                  <Minus size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <p>No tasks yet. Add your first task to get started!</p>
        </div>
      )}
    </div>
  );
};

export default TaskInput;
