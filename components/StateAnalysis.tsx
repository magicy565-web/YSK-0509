import React from 'react';
import { Users, DollarSign, MapPin, ArrowRight, Check, TrendingUp } from 'lucide-react';
import { AnalysisData } from '../types';

interface StateAnalysisProps {
  data: AnalysisData;
  onApprove: () => void;
}

export const StateAnalysis: React.FC<StateAnalysisProps> = ({ data, onApprove }) => {
  return (
    <div className="max-w-5xl mx-auto py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">AI Market Analysis Complete</h2>
          <p className="text-slate-500">The engine has identified high-potential opportunities for your product.</p>
        </div>
        <div className="px-4 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100 flex items-center">
          <TrendingUp className="w-4 h-4 mr-1.5" />
          High Confidence
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Potential Leads */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center hover:border-blue-300 transition-colors">
          <div className="p-3 bg-blue-50 rounded-full mb-4">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Identified Leads</h3>
          <p className="text-4xl font-extrabold text-slate-900 mt-2">{data.leads}</p>
          <p className="text-xs text-green-600 mt-2 flex items-center">
            <span className="bg-green-100 px-1.5 py-0.5 rounded mr-1">Active</span>
            Looking for suppliers now
          </p>
        </div>

        {/* Card 2: Profit */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center hover:border-emerald-300 transition-colors">
          <div className="p-3 bg-emerald-50 rounded-full mb-4">
            <DollarSign className="h-8 w-8 text-emerald-600" />
          </div>
          <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Est. Monthly Profit</h3>
          <p className="text-4xl font-extrabold text-slate-900 mt-2">{data.profit}</p>
          <p className="text-xs text-slate-400 mt-2">Based on avg. margin of 22%</p>
        </div>

        {/* Card 3: Market */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center hover:border-purple-300 transition-colors">
          <div className="p-3 bg-purple-50 rounded-full mb-4">
            <MapPin className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Target Market</h3>
          <p className="text-xl font-bold text-slate-900 mt-2 leading-tight px-4">{data.market}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-1">
            {data.topKeywords.map((kw, idx) => (
              <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-2xl md:static md:shadow-none md:bg-transparent md:border-0 md:p-0 md:mt-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between bg-slate-900 text-white md:p-1 rounded-full md:pl-8">
          <div className="hidden md:block text-sm text-slate-300">
            Next: Marketing strategy generation and automated outreach setup.
          </div>
          <button
            onClick={onApprove}
            className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all flex items-center justify-center"
          >
            <Check className="w-5 h-5 mr-2" />
            Approve Execution (Launch Outreach)
          </button>
        </div>
      </div>
    </div>
  );
};