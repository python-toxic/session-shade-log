
import React, { useState } from 'react';
import { Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { Task, ColorTheme, SessionConfig } from '@/types/productivity';
import { getSessionColor, getTargetIndicatorColor, sessionColors } from '@/utils/colorUtils';
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
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  const getSessionTasks = (sessionName: string) => {
    return tasks.filter(task => task.session === sessionName);
  };

  const getSessionStats = (sessionName: string) => {
    const sessionTasks = getSessionTasks(sessionName);
    const completedPomodoros = sessionTasks.filter(task => task.pomodoroCompleted).length;
    const pendingTasks = sessionTasks.filter(task => !task.pomodoroCompleted).length;
    return { total: sessionTasks.length, completed: completedPomodoros, pending: pendingTasks };
  };

  const getSessionIcon = (sessionName: string) => {
    const icons = {
      Morning: '🌅',
      Midday: '☀️',
      Afternoon: '🌤️',
      Night: '🌙'
    };
    return icons[sessionName as keyof typeof icons] || '⏰';
  };

  const toggleSessionExpansion = (sessionId: string) => {
    setExpandedSession(expandedSession === sessionId ? null : sessionId);
  };

  return (
    <>
      <div className="backdrop-blur-md rounded-xl p-4 border border-slate-700/20 hover:border-slate-600/30 hover:shadow-lg transition-all duration-300 bg-slate-800/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Today's Sessions</span>
          </div>
          <button
            onClick={() => setShowTargetSettings(true)}
            className="p-2 text-gray-400 hover:text-white hover:bg-slate-700/30 rounded-lg transition-all duration-200"
            title="Customize session targets"
          >
            <Settings size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {customSessions.map((session, index) => {
            const stats = getSessionStats(session.id);
            const target = sessionTargets[session.id] || 3;
            const sessionColor = sessionColors[session.id as keyof typeof sessionColors];
            const hasCompletedPomodoros = stats.completed > 0;
            const backgroundColor = getSessionColor(stats.total, colorTheme, hasCompletedPomodoros, session.id);
            const targetIndicatorColor = getTargetIndicatorColor(stats.total, target, colorTheme);
            const isExpanded = expandedSession === session.id;

            return (
              <div
                key={session.id}
                className="relative group animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`backdrop-blur-sm rounded-xl border-2 p-4 flex flex-col justify-between transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer ${
                    stats.total > 0 ? 'hover:shadow-slate-900/50' : ''
                  }`}
                  style={{ 
                    backgroundColor,
                    borderColor: sessionColor ? `hsl(${sessionColor.hue}, 50%, 40%)` : '#64748b'
                  }}
                  onClick={() => stats.total > 0 && toggleSessionExpansion(session.id)}
                  title={`${stats.completed}/${target} Pomodoros completed`}
                >
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-lg text-white flex items-center gap-2">
                        <span className="text-xl">{getSessionIcon(session.id)}</span>
                        {session.name}
                      </h3>
                      {stats.total > 0 && (
                        <button className="text-gray-300 hover:text-white transition-colors">
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-300 font-medium">{session.timeRange}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-white">{stats.total}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-300">/{target}</span>
                        <div 
                          className="w-2 h-2 rounded-full border border-white/20"
                          style={{ backgroundColor: targetIndicatorColor }}
                        />
                      </div>
                    </div>

                    {stats.total > 0 && (
                      <div className="flex justify-between items-center text-xs">
                        {stats.completed > 0 && (
                          <span className="text-green-300 bg-green-400/20 px-2 py-1 rounded border border-green-400/30">
                            ✓ {stats.completed}
                          </span>
                        )}
                        {stats.pending > 0 && (
                          <span className="text-yellow-300 bg-yellow-400/20 px-2 py-1 rounded border border-yellow-400/30">
                            ⏳ {stats.pending}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Progress Ring */}
                    {stats.total > 0 && (
                      <div className="relative">
                        <div className="w-full bg-white/10 rounded-full h-1">
                          <div 
                            className="h-1 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${Math.min((stats.completed / target) * 100, 100)}%`,
                              backgroundColor: targetIndicatorColor
                            }}
                          />
                        </div>
                        {stats.completed >= target && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border border-white" />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Task List */}
                {isExpanded && stats.total > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-10 bg-slate-800/95 backdrop-blur-md border border-slate-600/40 rounded-xl p-3 shadow-xl">
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {getSessionTasks(session.id).map((task, taskIndex) => (
                        <div key={taskIndex} className="flex items-center gap-2 p-2 bg-slate-700/30 rounded-lg">
                          <span className="text-sm">
                            {task.pomodoroCompleted ? '✅' : '⏳'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">{task.text}</p>
                            {task.pomodoroTime && task.pomodoroTime > 0 && (
                              <p className="text-blue-400 text-xs">🍅 {task.pomodoroTime}m</p>
                            )}
                          </div>
                        </div>
                      ))}
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
