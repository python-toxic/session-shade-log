
import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

interface MainGoalProps {
  goal: string;
  onUpdate: (goal: string) => void;
}

const MainGoal = ({ goal, onUpdate }: MainGoalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(goal);

  const handleSave = () => {
    onUpdate(editValue.trim() || 'Focus on what matters most today');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(goal);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 mb-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Today's Main Goal</span>
      </div>
      
      {!isEditing ? (
        <div 
          onClick={() => setIsEditing(true)}
          className="mt-2 text-lg font-medium text-white cursor-pointer hover:text-blue-300 transition-colors p-2 -mx-2 rounded-lg hover:bg-slate-700/30"
        >
          {goal}
        </div>
      ) : (
        <div className="mt-2 flex items-center gap-2">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
            maxLength={100}
          />
          <button
            onClick={handleSave}
            className="p-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors"
          >
            <Check size={16} />
          </button>
          <button
            onClick={handleCancel}
            className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default MainGoal;
