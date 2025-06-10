
import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { Task, ColorTheme, SessionConfig } from '@/types/productivity';
import { getSessionColor, getTargetIndicatorColor } from '@/utils/colorUtils';
import SessionTargetSettings from './SessionTargetSettings';

interface SessionGridProps {
  tasks: Task[];
  colorTheme: ColorTheme;
  sessionTargets: { [sessionName: string]: number };
  customSessions: SessionConfig[];
  onUpdateTargets?: (targets: { [sessionName: string]: number }) => void;
}

const SessionGrid = ({ 
  tasks, 
  colorTheme, 
  sessionTargets, 
  customSessions,
  onUpdateTargets = () => {}
}: SessionGridProps) => {
  const [showTargetSettings, setShowTargetSettings] = useState(false);

  const getSessionTasks = (sessionName: string) => {
    return tasks.filter(task => task.session === sessionName);
  };

  const getSessionStats = (sessionName: string) => {
    const sessionTasks = getSessionTasks(sessionName);
    const completedPomodoros = sessionTasks.filter(task => task.pomodoroCompleted).length;
    const pendingTasks = sessionTasks.filter(task => !task.pomodoroCompleted).length;
    return { total: sessionTasks.length, completed: completedPomodoros, pending: pendingTasks };
  };

  return (
    <>
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30 hover:border-slate-600/50 transition-all animate-pop-in hover-scale">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-200">Today's Sessions</h2>
          <button
            onClick={() => setShowTargetSettings(true)}
            className="p-2 text-gray-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
            title="Customize session targets"
          >
            <Settings size={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {customSessions.map((session, index) => {
            const stats = getSessionStats(session.id);
            const target = sessionTargets[session.id] || 3;
            const backgroundColor = getSessionColor(stats.total, colorTheme, stats.completed > 0);
            const targetIndicatorColor = getTargetIndicatorColor(stats.total, target, colorTheme);

            return (
              <div
                key={session.id}
                className="relative group cursor-pointer animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className="aspect-square rounded-lg border-2 border-slate-600/50 p-4 flex flex-col justify-between transition-all duration-300 hover:scale-105 hover:border-blue-500/70 backdrop-blur-sm"
                  style={{ backgroundColor }}
                >
                  <div>
                    <h3 className="font-medium text-sm mb-1">{session.name}</h3>
                    <p className="text-xs text-gray-400">{session.timeRange}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold">{stats.total}</span>
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
                    <div className="flex justify-end gap-2 mt-1">
                      {stats.completed > 0 && (
                        <span className="text-xs text-green-400">✓{stats.completed}</span>
                      )}
                      {stats.pending > 0 && (
                        <span className="text-xs text-yellow-400">⏳{stats.pending}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Target Progress Ring */}
                {stats.total > 0 && (
                  <div className="absolute -top-1 -right-1">
                    <div className="relative w-6 h-6">
                      <div 
                        className="absolute inset-0 rounded-full border-2"
                        style={{ 
                          borderColor: targetIndicatorColor,
                          transform: `rotate(${(stats.total / target) * 360 - 90}deg)`,
                        }}
                      />
                      {stats.total >= target && (
                        <div className="absolute inset-1 bg-green-500 rounded-full animate-pulse-ring" />
                      )}
                    </div>
                  </div>
                )}

                {/* Tooltip */}
                {stats.total > 0 && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <div className="bg-gray-900/90 backdrop-blur-sm text-white text-xs rounded-lg p-3 shadow-lg min-w-48 max-w-64">
                      <div className="font-medium mb-2">{session.name} Tasks ({stats.total}/{target}):</div>
                      <div className="space-y-1">
                        {getSessionTasks(session.id).map((task, index) => (
                          <div key={index} className="text-gray-300 flex items-center gap-2">
                            {task.pomodoroCompleted ? '✅' : '⏳'} {task.text}
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

      <SessionTargetSettings
        isVisible={showTargetSettings}
        onClose={() => setShowTargetSettings(false)}
        sessionTargets={sessionTargets}
        customSessions={customSessions}
        onUpdateTargets={onUpdateTargets}
      />
    </>
  );
};

export default SessionGrid;
