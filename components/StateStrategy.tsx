import React, { useState, useCallback, ChangeEvent } from 'react';
import { StrategyData, StrategyOption } from '../types';
import { Check, Edit, Upload, FileText, Bot, Factory, Gift, Briefcase } from 'lucide-react';

interface StateStrategyProps {
  data: StrategyData;
  onApprove: (selectedStrategy: StrategyOption) => void;
}

const ICONS: { [key: string]: React.ElementType } = {
  'strategy-1': Factory,
  'strategy-2': Gift,
  'strategy-3': Briefcase,
};

export const StateStrategy: React.FC<StateStrategyProps> = ({ data, onApprove }) => {
  const [strategies, setStrategies] = useState<StrategyData>(data);
  const [selectedTab, setSelectedTab] = useState<string>(data[0].id);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const selectedStrategy = strategies.find(s => s.id === selectedTab)!;

  const handleContentChange = (field: 'subject' | 'emailBody', value: string) => {
    const newStrategies = strategies.map(s => 
      s.id === selectedTab ? { ...s, [field]: value } : s
    );
    setStrategies(newStrategies);
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        // Assume the first line is the subject
        const firstLineEnd = content.indexOf('\n');
        const subject = content.substring(0, firstLineEnd).replace('Subject:', '').trim();
        const emailBody = content.substring(firstLineEnd + 1).trim();
        handleContentChange('subject', subject);
        handleContentChange('emailBody', emailBody);
        setIsEditing(true); 
      };
      reader.readAsText(file);
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="max-w-5xl mx-auto py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Strategy & Content Review</h2>
        <p className="text-slate-500 mt-1">Choose and customize your outreach email strategy.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left: Tab Navigation */}
        <div className="md:col-span-1">
          <div className="sticky top-8">
             <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                <Bot className="w-4 h-4 mr-2" />
                AI-Generated Strategies
            </h3>
            <div className="space-y-2">
              {strategies.map(strategy => {
                const Icon = ICONS[strategy.id] || Factory;
                return (
                <button 
                  key={strategy.id} 
                  onClick={() => setSelectedTab(strategy.id)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${selectedTab === strategy.id ? 'bg-blue-50 border-blue-300 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                    <div className="flex items-center">
                        <div className={`p-2 rounded-full mr-3 ${selectedTab === strategy.id ? 'bg-blue-100' : 'bg-slate-100'}`}>
                            <Icon className={`w-5 h-5 ${selectedTab === strategy.id ? 'text-blue-600' : 'text-slate-500'}`} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800">{strategy.title}</h4>
                            <p className="text-xs text-slate-500 mt-1">{strategy.description}</p>
                        </div>
                    </div>
                </button>
              ) })}
            </div>
          </div>
        </div>

        {/* Right: Content Display & Edit */}
        <div className="md:col-span-3">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Email Content Preview</h3>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="flex items-center text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md transition-colors">
                  <Upload className="w-4 h-4 mr-1.5" />
                  Upload TXT
                </button>
                <input type="file" accept=".txt" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />

                <button onClick={() => setIsEditing(!isEditing)} className={`flex items-center text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${isEditing ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  <Edit className="w-4 h-4 mr-1.5" />
                  {isEditing ? 'Lock Content' : 'Customize'}
                </button>
              </div>
            </div>
            
            <div className={`p-4 border rounded-lg ${isEditing ? 'border-blue-300 bg-white' : 'border-slate-200 bg-slate-50/80'}`}>
              <div className="mb-4">
                <label className="text-xs font-semibold text-slate-500 uppercase">Subject</label>
                <input 
                  type="text" 
                  value={selectedStrategy.subject}
                  onChange={e => handleContentChange('subject', e.target.value)}
                  readOnly={!isEditing}
                  className={`mt-1 w-full p-2 rounded ${isEditing ? 'border border-slate-300 focus:ring-2 focus:ring-blue-300' : 'border-transparent bg-transparent'} text-slate-800 font-semibold transition-all`}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">Body</label>
                <textarea 
                  value={selectedStrategy.emailBody}
                  onChange={e => handleContentChange('emailBody', e.target.value)}
                  readOnly={!isEditing}
                  className={`mt-1 w-full p-2 rounded ${isEditing ? 'border border-slate-300 focus:ring-2 focus:ring-blue-300' : 'border-transparent bg-transparent'} text-slate-600 leading-relaxed transition-all`}
                  rows={12}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-slate-200 p-4 shadow-lg md:static md:shadow-none md:bg-transparent md:border-0 md:p-0 md:mt-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between bg-slate-900 text-white p-2 rounded-xl md:pl-8">
          <div className="text-sm text-slate-300 mb-2 md:mb-0 text-center md:text-left">
            Choose a strategy and customize the content before launching the outreach.
          </div>
          <button
            onClick={() => onApprove(selectedStrategy)}
            className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all flex items-center justify-center"
          >
            <Check className="w-5 h-5 mr-2" />
            Confirm Strategy & Launch Outreach
          </button>
        </div>
      </div>
    </div>
  );
};