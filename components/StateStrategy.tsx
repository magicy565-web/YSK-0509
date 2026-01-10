import React from 'react';
import { Send, Target, Eye, MessageSquare, Zap } from 'lucide-react';
import { StrategyData } from '../types';

interface StateStrategyProps {
  data: StrategyData;
  onSend: () => void;
}

export const StateStrategy: React.FC<StateStrategyProps> = ({ data, onSend }) => {
  return (
    <div className="max-w-5xl mx-auto py-8 animate-fade-in pb-24 md:pb-8">
       <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Strategy & Content Review</h2>
          <p className="text-slate-500">Review the AI-generated outreach plan before mass execution.</p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Strategy Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900">Core Strategy</h3>
            </div>
            <p className="text-lg font-medium text-slate-800 leading-snug">{data.tactic}</p>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Channels</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {data.channels.map((channel, idx) => (
                  <span key={idx} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded border border-indigo-100">
                    {channel}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
             <div className="flex items-start space-x-3">
                <Zap className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-800 text-sm">Why this works?</h4>
                  <p className="text-xs text-amber-700 mt-1">
                    AI detected that competitor delivery times have increased by 2 weeks in this region. Emphasizing <b>Lead Time</b> + <b>Price</b> creates urgency.
                  </p>
                </div>
             </div>
          </div>
        </div>

        {/* Right Col: Email Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <MessageSquare className="w-4 h-4" />
                <span className="font-medium">Email Preview</span>
              </div>
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-4 space-y-2">
                <div className="flex border-b border-slate-100 pb-2">
                  <span className="text-slate-400 text-sm w-16">Subject:</span>
                  <span className="text-slate-800 text-sm font-medium">{data.subject}</span>
                </div>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-lg font-mono text-sm text-slate-700 whitespace-pre-line leading-relaxed border border-slate-100">
                {data.emailBody}
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end items-center space-x-4">
              <button className="text-slate-500 text-sm hover:text-slate-800 font-medium transition-colors">
                Edit Template
              </button>
              <button 
                onClick={onSend}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center font-bold"
              >
                <Send className="w-4 h-4 mr-2" />
                Confirm & Launch Campaign
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};