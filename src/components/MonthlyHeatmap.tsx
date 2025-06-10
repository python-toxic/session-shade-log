
import React from 'react';
import { Task, ColorTheme } from '@/types/productivity';
import { getSessionColor } from '@/utils/colorUtils';

interface MonthlyHeatmapProps {
  tasks: Task[];
  colorTheme: ColorTheme;
}

const MonthlyHeatmap = ({ tasks, colorTheme }: MonthlyHeatmapProps) => {
  const generateLast30Days = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    
    return days;
  };

  const getTasksForDay = (day: string) => {
    return tasks.filter(task => task.day === day);
  };

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getDateDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.getDate().toString();
  };

  const last30Days = generateLast30Days();

  return (
    <div className="glass-morphism rounded-xl p-4 border border-white/10 h-fit">
      <h2 className="text-lg font-semibold mb-4 text-gray-200">30-Day Productivity Heatmap</h2>
      
      {/* Extended width grid that takes remaining space */}
      <div className="grid grid-cols-6 sm:grid-cols-10 lg:grid-cols-15 xl:grid-cols-15 gap-1.5 w-full">
        {last30Days.map(day => {
          const dayTasks = getTasksForDay(day);
          const taskCount = dayTasks.length;
          const backgroundColor = getSessionColor(taskCount, colorTheme);
          const isToday = day === new Date().toISOString().split('T')[0];

          return (
            <div
              key={day}
              className={`aspect-square rounded-md border transition-all duration-200 hover:scale-110 cursor-pointer group relative ${
                isToday ? 'border-blue-400 border-2' : 'border-white/20'
              }`}
              style={{ backgroundColor }}
            >
              <div className="p-1 h-full flex flex-col justify-between text-center">
                <div className="text-[10px] text-gray-400">
                  {getDayName(day).charAt(0)}
                </div>
                <div className="text-[10px] font-bold text-white">
                  {getDateDisplay(day)}
                </div>
              </div>

              {/* Tooltip */}
              {taskCount > 0 && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg min-w-48 max-w-64">
                    <div className="font-medium mb-2">
                      {new Date(day).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric' 
                      })} ({taskCount} {taskCount === 1 ? 'task' : 'tasks'})
                    </div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {dayTasks.map((task, index) => (
                        <div key={index} className="text-gray-300">
                          • {task.text}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-2 mt-4">
        <span className="text-xs text-gray-400">Less</span>
        {[0, 1, 3, 5, 8].map(count => (
          <div
            key={count}
            className="w-3 h-3 rounded-sm border border-white/20"
            style={{ backgroundColor: getSessionColor(count, colorTheme) }}
          />
        ))}
        <span className="text-xs text-gray-400">More</span>
      </div>
    </div>
  );
};

export default MonthlyHeatmap;
