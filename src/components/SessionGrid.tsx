
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
      <div className="backdrop-blur-md rounded-2xl p-6 border border-slate-700/20 hover:border-slate-600/30 transition-all duration-300 bg-slate-800/10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Interactive Sessions</span>
          </div>
          <button
            onClick={() => setShowTargetSettings(true)}
            className="p-2 text-gray-400 hover:text-white hover:bg-slate-700/30 rounded-xl transition-all duration-200 border border-transparent hover:border-slate-600/30"
            title="Customize session targets"
          >
            <Settings size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
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
                  className={`backdrop-blur-sm rounded-2xl border-2 p-5 flex flex-col justify-between transition-all duration-300 hover:scale-105 border-slate-600/30 hover:border-opacity-70 cursor-pointer ${
                    stats.total > 0 ? 'hover:shadow-lg hover:shadow-slate-900/50' : ''
                  }`}
                  style={{ 
                    backgroundColor,
                    borderColor: sessionColor ? `hsl(${sessionColor.hue}, 50%, 40%)` : undefined
                  }}
                  onClick={() => stats.total > 0 && toggleSessionExpansion(session.id)}
                >
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg text-white flex items-center gap-2">
                        <span className="text-2xl">{getSessionIcon(session.id)}</span>
                        {session.name}
                      </h3>
                      {stats.total > 0 && (
                        <button className="text-gray-300 hover:text-white transition-colors">
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-300 font-medium">{session.timeRange}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-white">{stats.total}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-300">/{target}</span>
                        <div 
                          className="w-3 h-3 rounded-full border-2 border-white/20"
                          style={{ backgroundColor: targetIndicatorColor }}
                          title={`Target: ${target} tasks`}
                        />
                      </div>
                    </div>

                    {stats.total > 0 && (
                      <div className="flex justify-between items-center">
                        {stats.completed > 0 && (
                          <span className="text-sm text-green-300 bg-green-400/20 px-3 py-1 rounded-full border border-green-400/30">
                            ✓ {stats.completed}
                          </span>
                        )}
                        {stats.pending > 0 && (
                          <span className="text-sm text-yellow-300 bg-yellow-400/20 px-3 py-1 rounded-full border border-yellow-400/30">
                            ⏳ {stats.pending}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Progress Ring */}
                    {stats.total > 0 && (
                      <div className="relative">
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${Math.min((stats.total / target) * 100, 100)}%`,
                              backgroundColor: targetIndicatorColor
                            }}
                          />
                        </div>
                        {stats.total >= target && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-white" />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Task List */}
                {isExpanded && stats.total > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-10 bg-slate-800/95 backdrop-blur-md border border-slate-600/40 rounded-xl p-4 shadow-xl">
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {getSessionTasks(session.id).map((task, taskIndex) => (
                        <div key={taskIndex} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                          <span className="text-lg">
                            {task.pomodoroCompleted ? '✅' : '⏳'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">{task.text}</p>
                            {task.pomodoroTime && task.pomodoroTime > 0 && (
                              <p className="text-blue-400 text-sm">🍅 {task.pomodoroTime}m</p>
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
