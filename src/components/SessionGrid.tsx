
import React from 'react';
import { Task } from '@/types/productivity';
import { getSessionColor } from '@/utils/colorUtils';

interface SessionGridProps {
  tasks: Task[];
}

const SessionGrid = ({ tasks }: SessionGridProps) => {
  const sessions = [
    { name: 'Morning' as const, timeRange: '5AM - 10AM' },
    { name: 'Midday' as const, timeRange: '10AM - 3PM' },
    { name: 'Afternoon' as const, timeRange: '3PM - 8PM' },
    { name: 'Night' as const, timeRange: '8PM - 2AM' }
  ];

  const getSessionTasks = (sessionName: string) => {
    return tasks.filter(task => task.session === sessionName);
  };

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
      <h2 className="text-xl font-semibold mb-6 text-gray-200">Today's Sessions</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {sessions.map(session => {
          const sessionTasks = getSessionTasks(session.name);
          const taskCount = sessionTasks.length;
          const backgroundColor = getSessionColor(taskCount);

          return (
            <div
              key={session.name}
              className="relative group cursor-pointer"
            >
              <div
                className="aspect-square rounded-lg border-2 border-slate-600 p-4 flex flex-col justify-between transition-all duration-300 hover:scale-105 hover:border-blue-500"
                style={{ backgroundColor }}
              >
                <div>
                  <h3 className="font-medium text-sm mb-1">{session.name}</h3>
                  <p className="text-xs text-gray-400">{session.timeRange}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold">{taskCount}</span>
                  <p className="text-xs text-gray-400">
                    {taskCount === 1 ? 'task' : 'tasks'}
                  </p>
                </div>
              </div>

              {/* Tooltip */}
              {taskCount > 0 && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg min-w-48 max-w-64">
                    <div className="font-medium mb-2">{session.name} Tasks:</div>
                    <div className="space-y-1">
                      {sessionTasks.map((task, index) => (
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
    </div>
  );
};

export default SessionGrid;
