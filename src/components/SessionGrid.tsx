
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
      <div className="glass-morphism rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Today's Sessions</span>
          </div>
          <button
            onClick={() => setShowTargetSettings(true)}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            title="Customize session targets"
          >
            <Settings size={16} />
          </button>
        </div>

        {/* Fixed-size grid for session cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {customSessions.map((session, index) => {
            const stats = getSessionStats(session.id);
            const target = sessionTargets[session.id] || 3;
            const sessionColor = sessionColors[session.id as keyof typeof sessionColors];
            const hasCompletedPomodoros = stats.completed > 0;
            const backgroundColor = getSessionColor(stats.total, colorTheme, hasCompletedPomodoros, session.id);
            const targetIndicatorColor = getTargetIndicatorColor(stats.completed, target, colorTheme);
            const isExpanded = expandedSession === session.id;

            return (
              <div
                key={session.id}
                className="relative group animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`glass-morphism rounded-xl border-2 p-3 flex flex-col justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer h-32 w-full ${
                    stats.total > 0 ? 'hover:shadow-purple-500/20' : ''
                  }`}
                  style={{ 
                    backgroundColor,
                    borderColor: sessionColor ? `hsl(${sessionColor.hue}, 50%, 40%)` : 'rgba(255, 255, 255, 0.1)'
                  }}
                  onClick={() => stats.total > 0 && toggleSessionExpansion(session.id)}
                  title={`${stats.completed}/${target} Pomodoros completed`}
                >
                  {/* Header - perfectly centered */}
                  <div className="text-center mb-3">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className="text-lg">{getSessionIcon(session.id)}</span>
                      <h3 className="font-semibold text-sm text-white">{session.name}</h3>
                      {stats.total > 0 && (
                        <button className="text-gray-300 hover:text-white transition-colors">
                          {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 font-medium">{session.timeRange}</p>
                  </div>

                  {/* Stats - centered */}
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xl font-bold text-white">{stats.total}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-300">/{target}</span>
                        <div 
                          className="w-2 h-2 rounded-full border border-white/20"
                          style={{ backgroundColor: targetIndicatorColor }}
                        />
                      </div>
                    </div>

                    {/* Always visible progress bar */}
                    <div className="relative w-full">
                      <div className="w-full bg-white/10 rounded-full h-1.5">
                        <div 
                          className="h-1.5 rounded-full transition-all duration-500"
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

                    {/* Status indicators */}
                    {stats.total > 0 && (
                      <div className="flex justify-center items-center gap-2 text-xs">
                        {stats.completed > 0 && (
                          <span className="text-green-300 bg-green-400/20 px-2 py-0.5 rounded border border-green-400/30">
                            ✓ {stats.completed}
                          </span>
                        )}
                        {stats.pending > 0 && (
                          <span className="text-yellow-300 bg-yellow-400/20 px-2 py-0.5 rounded border border-yellow-400/30">
                            ⏳ {stats.pending}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Task List */}
                {isExpanded && stats.total > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-10 bg-slate-800/95 backdrop-blur-md border border-white/20 rounded-xl p-3 shadow-xl">
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {getSessionTasks(session.id).map((task, taskIndex) => (
                        <div key={taskIndex} className="flex items-center gap-2 p-2 bg-white/10 rounded-lg">
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
