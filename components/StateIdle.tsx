import React from 'react';
import { Upload, Camera, Zap } from 'lucide-react';

interface StateIdleProps {
  onStart: () => void;
}

export const StateIdle: React.FC<StateIdleProps> = ({ onStart }) => {
  return (
    <div className="animate-fade-in py-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
          Start Your Export Engine
        </h1>
        <p className="text-slate-500 mb-8">Upload your product image to let AI identify markets and generate leads.</p>

        {/* Upload Area */}
        <div className="border-4 border-dashed border-slate-200 rounded-xl bg-slate-50 p-12 transition-all hover:border-slate-300 hover:bg-slate-100 group cursor-pointer relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-slate-400 font-medium">Click to select file</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="bg-white p-4 rounded-full shadow-sm">
              <Camera className="h-10 w-10 text-slate-400" />
            </div>
            <div className="text-slate-600">
              <span className="font-semibold text-slate-900">Drag & drop</span> or click to upload
            </div>
            <p className="text-xs text-slate-400">Supports JPG, PNG (Max 10MB)</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-10">
          <button
            onClick={onStart}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-slate-900 rounded-full hover:bg-slate-800 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 w-full md:w-auto"
          >
            <Zap className="w-5 h-5 mr-2 text-yellow-400 group-hover:animate-pulse" />
            Start Full-Managed Engine
          </button>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-3 gap-4 max-w-4xl mx-auto text-center opacity-60">
        <div className="p-4">
          <h3 className="font-bold text-slate-900">1. Analyze</h3>
          <p className="text-sm text-slate-500">Market & Profit Prediction</p>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-slate-900">2. Strategize</h3>
          <p className="text-sm text-slate-500">Auto-Content Generation</p>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-slate-900">3. Close</h3>
          <p className="text-sm text-slate-500">Negotiation & Logistics</p>
        </div>
      </div>
    </div>
  );
};