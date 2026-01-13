
import React from 'react';
import { Loader2, Globe, Search, Database, Check } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter'; // TASK: Import the new component

interface LoadingOverlayProps {
  isLoading: boolean;
  message: string;
  step: number; // Current step (1, 2, 3)
  progress: number; // Overall progress (0-100)
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading, message, step, progress }) => {
  if (!isLoading) return null;

  const steps = [
    { id: 1, label: "全球扫描", icon: Globe },
    { id: 2, label: "精准匹配", icon: Search },
    { id: 3, label: "数据验证", icon: Database },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[100] flex flex-col items-center justify-center animate-fade-in text-white">
      <div className="w-full max-w-lg p-8">
        
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/30 rounded-full animate-ping blur-md"></div>
            <div className="relative bg-slate-800 p-6 rounded-full border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <Loader2 className="w-12 h-12 text-emerald-400 animate-spin" />
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-center mb-2 tracking-wide">系统正在处理</h3>
        <p className="text-emerald-400 text-center text-sm mb-10 h-6 font-mono">{message}</p>

        {/* --- TASK: Add AnimatedCounter for Step 1 --- */}
        {step === 1 && (
            <div className="grid grid-cols-2 gap-4 mb-8 animate-fade-in">
                <AnimatedCounter target={3567} duration={14000} label="海关数据库" />
                <AnimatedCounter target={147} duration={14000} label="独家采购商库" />
            </div>
        )}

        <div className="space-y-6">
          <div className="relative">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-700">
              <div 
                style={{ width: `${progress}%` }} 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-300 ease-out"
              ></div>
            </div>
          </div>

          <div className="flex justify-between items-start relative">
            <div className="absolute top-4 left-0 w-full h-0.5 bg-slate-700 -z-10"></div>
            
            {steps.map((s) => {
              const isActive = step === s.id;
              const isCompleted = step > s.id;
              const Icon = s.icon;

              return (
                <div key={s.id} className="flex flex-col items-center group w-1/3">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500
                    ${isCompleted ? 'bg-emerald-500 border-emerald-500' : isActive ? 'bg-slate-900 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.6)]' : 'bg-slate-800 border-slate-600'}
                  `}>
                    {isCompleted ? <Check className="w-4 h-4 text-white" /> : <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />}
                  </div>
                  <span className={`mt-3 text-xs font-medium transition-colors duration-300 ${isActive || isCompleted ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs mt-12">
          正在连接加密通道处理敏感数据，请勿关闭页面...
        </p>
      </div>
    </div>
  );
};
