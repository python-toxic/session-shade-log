
import React, { useState, useRef, useEffect } from 'react';
import { Task } from '@/types/productivity';
import { Plus, Minus, Play } from 'lucide-react';

interface TaskInputProps {
  onAddTask: (task: string) => void;
  tasks: Task[];
  onDeleteTask: (index: number) => void;
  onStartPomodoro: (task: Task) => void;
}

const TaskInput = ({ onAddTask, tasks, onDeleteTask, onStartPomodoro }: TaskInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddTask(inputValue.trim());
      setInputValue('');
    }
  };

  const groupTasksBySession = (tasks: Task[]) => {
    const sessions = {
      Morning: { name: 'Morning', timeRange: '5AM - 10AM', tasks: [] as Task[] },
      Midday: { name: 'Midday', timeRange: '10AM - 3PM', tasks: [] as Task[] },
      Afternoon: { name: 'Afternoon', timeRange: '3PM - 8PM', tasks: [] as Task[] },
      Night: { name: 'Night', timeRange: '8PM - 2AM', tasks: [] as Task[] }
    };

    tasks.forEach(task => {
      sessions[task.session].tasks.push(task);
    });

    return Object.values(sessions);
  };

  const getTaskGlobalIndex = (sessionName: string, localIndex: number) => {
    let globalIndex = 0;
    const allTasks = tasks;
    
    for (let i = 0; i < allTasks.length; i++) {
      if (allTasks[i].session === sessionName) {
        if (localIndex === 0) {
          return i;
        }
        localIndex--;
      }
    }
    return -1;
  };

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 animate-pop-in hover-scale">
      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center hover-scale"
        >
          <Plus size={20} />
        </button>
      </form>

      {/* Today's Tasks */}
      {tasks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-300 mb-4">Today's Tasks</h3>
          {groupTasksBySession(tasks).map(session => (
            session.tasks.length > 0 && (
              <div key={session.name} className="space-y-2 animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-medium text-gray-400">{session.name}</h4>
                  <span className="text-xs text-gray-500">({session.timeRange})</span>
                </div>
                <div className="space-y-2">
                  {session.tasks.map((task, localIndex) => {
                    const globalIndex = getTaskGlobalIndex(session.name, localIndex);
                    return (
                      <div
                        key={task.id}
                        className="flex items-center justify-between bg-slate-700/30 rounded-lg px-4 py-2 group hover:bg-slate-700/50 transition-all hover-scale animate-pop-in"
                        style={{ animationDelay: `${localIndex * 0.1}s` }}
                      >
                        <div className="flex-1">
                          <span className="text-sm text-gray-200">{task.text}</span>
                          {task.pomodoroTime && task.pomodoroTime > 0 && (
                            <div className="text-xs text-blue-400 mt-1">
                              🍅 {task.pomodoroTime} min focused
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onStartPomodoro(task)}
                            className="text-green-400 hover:text-green-300 transition-colors p-1 rounded hover:bg-slate-600"
                            title="Start Pomodoro"
                          >
                            <Play size={14} />
                          </button>
                          <button
                            onClick={() => onDeleteTask(globalIndex)}
                            className="text-red-400 hover:text-red-300 transition-colors p-1 rounded hover:bg-slate-600"
                          >
                            <Minus size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskInput;
