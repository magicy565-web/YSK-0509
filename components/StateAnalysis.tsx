import React from 'react';
import { Users, DollarSign, MapPin, Check, TrendingUp, Building, Globe, Briefcase, Target } from 'lucide-react';
import { AnalysisData } from '../types';

interface StateAnalysisProps {
  data: AnalysisData;
  onApprove: () => void;
}

export const StateAnalysis: React.FC<StateAnalysisProps> = ({ data, onApprove }) => {
  return (
    <div className="max-w-7xl mx-auto py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 px-4 sm:px-0">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">AI Market Analysis Report</h2>
          <p className="text-slate-500 mt-1">High-potential opportunities have been identified for your product.</p>
        </div>
        <div className="mt-4 sm:mt-0 px-4 py-2 bg-blue-50 text-blue-800 rounded-full text-sm font-semibold border border-blue-200 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2" />
          Status: High-Confidence Analysis
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Buyers & Competitors */}
        <div className="lg:col-span-2 space-y-8">

          {/* 1. Potential Buyers */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <Users className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Potential Buyers Directory</h3>
                <p className="text-slate-500">Total Identified Leads: <span className="font-bold text-green-700">{data.potentialBuyers.total}</span></p>
              </div>
            </div>
            <div className="space-y-3">
              {data.potentialBuyers.top10.map((buyer, index) => (
                <div key={index} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                  <p className="font-semibold text-slate-800">{buyer.name}</p>
                  <p className="text-slate-600">{buyer.address}</p>
                  <p className="text-slate-600 font-medium">{buyer.contact}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Top Competitors */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-red-100 rounded-full mr-4">
                <Target className="h-6 w-6 text-red-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Top 5 Competitors</h3>
            </div>
            <div className="space-y-3">
              {data.topCompetitors.map((competitor, index) => (
                <div key={index} className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="flex-1 font-semibold text-slate-800">{competitor.name}</p>
                  <a href={`http://${competitor.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                    {competitor.website}
                  </a>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Niche Markets & Strategies */}
        <div className="space-y-8">

          {/* 2. Niche Markets */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-100 rounded-full mr-4">
                <Briefcase className="h-6 w-6 text-purple-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Niche Market Volume</h3>
            </div>
            <div className="space-y-3">
              {data.nicheMarkets.map((market, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="font-semibold text-slate-700">{market.name}</p>
                  <p className="font-bold text-lg text-purple-700">{market.volume}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 4. B2B Strategies */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <div className="flex items-center mb-4">
              <div className="p-3 bg-yellow-100 rounded-full mr-4">
                <Globe className="h-6 w-6 text-yellow-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Core B2B Strategies</h3>
            </div>
            <ul className="space-y-2.5 text-sm text-slate-700">
              {data.b2bStrategies.map((strategy, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-4 h-4 mr-2.5 mt-0.5 text-emerald-500 flex-shrink-0" />
                  <span>{strategy}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-slate-200 p-4 shadow-lg md:static md:shadow-none md:bg-transparent md:border-0 md:p-0 md:mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between bg-slate-900 text-white p-2 rounded-xl md:pl-8">
          <div className="text-sm text-slate-300 mb-2 md:mb-0 text-center md:text-left">
            Ready to proceed? The next step is to generate a marketing strategy and launch the automated outreach campaign.
          </div>
          <button
            onClick={onApprove}
            className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all flex items-center justify-center"
          >
            <Check className="w-5 h-5 mr-2" />
            Approve & Generate Outreach
          </button>
        </div>
      </div>
    </div>
  );
};