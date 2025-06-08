
import React from 'react';
import { Task, ColorTheme, SessionConfig } from '@/types/productivity';
import { getSessionColor, getTargetIndicatorColor } from '@/utils/colorUtils';

interface SessionGridProps {
  tasks: Task[];
  colorTheme: ColorTheme;
  sessionTargets: { [sessionName: string]: number };
  customSessions: SessionConfig[];
}

const SessionGrid = ({ tasks, colorTheme, sessionTargets, customSessions }: SessionGridProps) => {
  const getSessionTasks = (sessionName: string) => {
    return tasks.filter(task => task.session === sessionName);
  };

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 animate-pop-in hover-scale">
      <h2 className="text-xl font-semibold mb-6 text-gray-200">Today's Sessions</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {customSessions.map((session, index) => {
          const sessionTasks = getSessionTasks(session.id);
          const taskCount = sessionTasks.length;
          const target = sessionTargets[session.id] || 3;
          const backgroundColor = getSessionColor(taskCount, colorTheme);
          const targetIndicatorColor = getTargetIndicatorColor(taskCount, target, colorTheme);

          return (
            <div
              key={session.id}
              className="relative group cursor-pointer animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
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
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-xs text-gray-400">
                      /{target}
                    </span>
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: targetIndicatorColor }}
                      title={`Target: ${target} tasks`}
                    />
                  </div>
                  <p className="text-xs text-gray-400">
                    {taskCount === 1 ? 'task' : 'tasks'}
                  </p>
                </div>
              </div>

              {/* Target Progress Ring */}
              {taskCount > 0 && (
                <div className="absolute -top-1 -right-1">
                  <div className="relative w-6 h-6">
                    <div 
                      className="absolute inset-0 rounded-full border-2"
                      style={{ 
                        borderColor: targetIndicatorColor,
                        transform: `rotate(${(taskCount / target) * 360 - 90}deg)`,
                      }}
                    />
                    {taskCount >= target && (
                      <div className="absolute inset-1 bg-green-500 rounded-full animate-pulse-ring" />
                    )}
                  </div>
                </div>
              )}

              {/* Tooltip */}
              {taskCount > 0 && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg min-w-48 max-w-64">
                    <div className="font-medium mb-2">{session.name} Tasks ({taskCount}/{target}):</div>
                    <div className="space-y-1">
                      {sessionTasks.map((task, index) => (
                        <div key={index} className="text-gray-300 flex items-center gap-2">
                          • {task.text}
                          {task.pomodoroTime && task.pomodoroTime > 0 && (
                            <span className="text-blue-400 text-xs">🍅{task.pomodoroTime}m</span>
                          )}
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
