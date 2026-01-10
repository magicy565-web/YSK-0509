import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  message: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex flex-col items-center justify-center animate-fade-in">
      <div className="bg-white p-8 rounded-2xl shadow-2xl border border-slate-100 flex flex-col items-center max-w-sm w-full">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-75"></div>
          <div className="relative bg-emerald-500 rounded-full p-4">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-slate-900 text-center mb-2">Processing</h3>
        <p className="text-slate-500 text-center text-sm">{message}</p>
        
        {/* Progress Bar Simulation */}
        <div className="w-full bg-slate-100 h-1.5 mt-6 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 animate-[progress_1.5s_ease-in-out_infinite] w-1/2 rounded-full origin-left"></div>
        </div>
      </div>
    </div>
  );
};