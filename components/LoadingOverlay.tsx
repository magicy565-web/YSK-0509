
import React from 'react';
import { Loader2, BrainCircuit } from 'lucide-react';

interface LoadingOverlayProps {
  isLoading: boolean;
  message: string; // Add message to the props
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading, message }) => {

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center animate-fade-in">
      <div className="bg-white p-8 rounded-2xl shadow-2xl border border-slate-100 flex flex-col items-center max-w-sm w-full">
        <div className="relative mb-6">
            <div className="absolute -inset-2 bg-emerald-100 rounded-full animate-ping"></div>
            <div className="relative bg-emerald-500 rounded-full p-4">
                <BrainCircuit className="w-8 h-8 text-white" />
            </div>
        </div>
        <h3 className="text-xl font-bold text-slate-900 text-center mb-2">AI 正在处理...</h3>
        {/* Use the message from props */}
        <p className="text-slate-500 text-center text-sm h-10 flex items-center">{message || '正在初始化...'}</p>
        
        <div className="w-full bg-slate-100 h-2 mt-6 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 animate-[progress_2.5s_ease-in-out_infinite] w-full rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
