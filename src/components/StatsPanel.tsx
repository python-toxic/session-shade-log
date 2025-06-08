
import React from 'react';
import { Task } from '@/types/productivity';

interface StatsPanelProps {
  streak: number;
  avgTasksPerDay: number;
  tasks: Task[];
}

const StatsPanel = ({ streak, avgTasksPerDay, tasks }: StatsPanelProps) => {
  const getDarkestDay = () => {
    const last30Days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      last30Days.push(date.toISOString().split('T')[0]);
    }

    let minTasks = Infinity;
    let darkestDay = '';
    
    last30Days.forEach(day => {
      const dayTasks = tasks.filter(task => task.day === day);
      if (dayTasks.length < minTasks) {
        minTasks = dayTasks.length;
        darkestDay = day;
      }
    });

    if (darkestDay) {
      const date = new Date(darkestDay);
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        tasks: minTasks
      };
    }
    
    return { date: 'None', tasks: 0 };
  };

  const getTodayTaskCount = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => task.day === today).length;
  };

  const darkestDay = getDarkestDay();
  const todayTasks = getTodayTaskCount();

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
        <h2 className="text-xl font-semibold mb-6 text-gray-200">Quick Stats</h2>
        
        <div className="space-y-6">
          {/* Current Streak */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔥</span>
              <div>
                <div className="text-sm text-gray-400">Current Streak</div>
                <div className="text-2xl font-bold text-orange-400">{streak}</div>
              </div>
            </div>
          </div>

          {/* Average Tasks/Day */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📈</span>
              <div>
                <div className="text-sm text-gray-400">Avg Tasks/Day</div>
                <div className="text-2xl font-bold text-green-400">
                  {avgTasksPerDay.toFixed(1)}
                </div>
              </div>
            </div>
          </div>

          {/* Darkest Day */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🕳️</span>
              <div>
                <div className="text-sm text-gray-400">Lowest Day</div>
                <div className="text-lg font-bold text-red-400">
                  {darkestDay.date} ({darkestDay.tasks})
                </div>
              </div>
            </div>
          </div>

          {/* Today's Progress */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <div className="text-sm text-gray-400">Today</div>
                <div className="text-2xl font-bold text-blue-400">{todayTasks}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
