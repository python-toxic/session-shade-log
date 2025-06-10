
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
    <div className="mb-8 animate-fade-in">
      {!isEditing ? (
        <h1 
          onClick={() => setIsEditing(true)}
          className="text-3xl font-bold text-white cursor-pointer hover:text-purple-300 transition-colors duration-300 text-center"
        >
          {goal}
        </h1>
      ) : (
        <div className="flex items-center justify-center gap-3">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyPress}
            className="text-3xl font-bold bg-transparent border-b-2 border-purple-400 text-white text-center focus:outline-none focus:border-purple-300 transition-colors"
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
