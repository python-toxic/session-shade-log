
import React, { useState } from 'react';
import { X, Target } from 'lucide-react';
import { SessionConfig } from '@/types/productivity';

interface SessionTargetSettingsProps {
  isVisible: boolean;
  onClose: () => void;
  sessionTargets: { [sessionName: string]: number };
  customSessions: SessionConfig[];
  onUpdateTargets: (targets: { [sessionName: string]: number }) => void;
}

const SessionTargetSettings = ({ 
  isVisible, 
  onClose, 
  sessionTargets, 
  customSessions,
  onUpdateTargets 
}: SessionTargetSettingsProps) => {
  const [tempTargets, setTempTargets] = useState(sessionTargets);

  React.useEffect(() => {
    setTempTargets(sessionTargets);
  }, [sessionTargets]);

  const handleSave = () => {
    onUpdateTargets(tempTargets);
    onClose();
  };

  const handleCancel = () => {
    setTempTargets(sessionTargets);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 animate-fade-in">
      <div className="bg-slate-800 border border-slate-600 rounded-xl p-6 max-w-md w-full mx-4 animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target size={20} className="text-blue-400" />
            <h3 className="text-lg font-semibold">Session Targets</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded text-gray-300"
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="space-y-4 mb-6">
          <p className="text-sm text-gray-400">
            Set your target number of tasks for each session period.
          </p>
          
          {customSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  {session.name}
                </label>
                <span className="text-xs text-gray-400">{session.timeRange}</span>
              </div>
              <input
                type="number"
                value={tempTargets[session.id] || 3}
                onChange={(e) => setTempTargets({ 
                  ...tempTargets, 
                  [session.id]: Number(e.target.value) 
                })}
                className="w-16 px-2 py-1 bg-slate-700 text-white text-sm rounded border border-slate-600"
                min="1"
                max="20"
              />
            </div>
          ))}
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
          >
            Save Changes
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionTargetSettings;
