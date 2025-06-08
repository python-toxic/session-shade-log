
import React, { useState } from 'react';
import { Plus, Zap } from 'lucide-react';

interface TaskTemplatesProps {
  templates: string[];
  onAddTask: (task: string) => void;
  onUpdateTemplates: (templates: string[]) => void;
}

const TaskTemplates = ({ templates, onAddTask, onUpdateTemplates }: TaskTemplatesProps) => {
  const [showTemplates, setShowTemplates] = useState(false);
  const [newTemplate, setNewTemplate] = useState('');

  const addTemplate = () => {
    if (newTemplate.trim() && !templates.includes(newTemplate.trim())) {
      onUpdateTemplates([...templates, newTemplate.trim()]);
      setNewTemplate('');
    }
  };

  const removeTemplate = (index: number) => {
    onUpdateTemplates(templates.filter((_, i) => i !== index));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowTemplates(!showTemplates)}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-slate-700/50 hover:bg-slate-700 rounded-lg text-gray-300 transition-colors"
      >
        <Zap size={14} />
        Quick Templates
      </button>

      {showTemplates && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl z-10 animate-scale-in">
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {templates.map((template, index) => (
              <div key={index} className="flex items-center justify-between group">
                <button
                  onClick={() => {
                    onAddTask(template);
                    setShowTemplates(false);
                  }}
                  className="flex-1 text-left text-sm text-gray-300 hover:text-white p-2 rounded hover:bg-slate-700 transition-colors"
                >
                  {template}
                </button>
                <button
                  onClick={() => removeTemplate(index)}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 p-1 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2 mt-3 pt-3 border-t border-slate-600">
            <input
              type="text"
              value={newTemplate}
              onChange={(e) => setNewTemplate(e.target.value)}
              placeholder="New template..."
              className="flex-1 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && addTemplate()}
            />
            <button
              onClick={addTemplate}
              disabled={!newTemplate.trim()}
              className="p-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 rounded text-white transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTemplates;
