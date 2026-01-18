
import React, { useState } from 'react';
import { Briefcase, CheckCircle, Share2 } from 'lucide-react';
import { AppState } from '../types';
import { SharePosterModal } from './SharePosterModal';

interface NavbarProps {
  currentState: AppState;
}

// UI/UX FIX: This component is updated to accurately reflect the 5 steps of the user journey.
const ProgressIndicator: React.FC<{ label: string; isActive: boolean; isCompleted: boolean }> = ({ label, isActive, isCompleted }) => {
    const baseClasses = "text-xs font-semibold px-3 py-1 rounded-full transition-all duration-300 whitespace-nowrap";
    const activeClasses = "bg-emerald-500 text-white shadow-md";
    const completedClasses = "bg-emerald-500/20 text-emerald-700"; // Made text darker for better visibility
    const upcomingClasses = "bg-slate-700 text-slate-400";

    let classes = upcomingClasses;
    if (isActive) classes = activeClasses;
    if (isCompleted) classes = completedClasses;

    return (
        <div className={`flex items-center ${baseClasses} ${classes}`}>
            {isCompleted && <CheckCircle className="w-4 h-4 mr-1.5 shrink-0" />}
            <span>{label}</span>
        </div>
    );
};

export const Navbar: React.FC<NavbarProps> = ({ currentState }) => {
    const [showShareModal, setShowShareModal] = useState(false);
    const statesOrder = [AppState.FORM, AppState.ANALYSIS, AppState.STRATEGY, AppState.DEAL, AppState.SUCCESS];
    const currentIndex = statesOrder.indexOf(currentState);

  return (
    <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
             <div className="bg-emerald-500 p-1.5 rounded-lg">
              <Briefcase className="h-6 w-6 text-slate-900" />
            </div>
            <span className="font-bold text-xl tracking-tight">全球外贸·智造领航员</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Service Progress Indicator - Now with 5 steps */}
            <div className="hidden md:flex items-center space-x-2 text-sm bg-slate-800 p-1 rounded-full">
                <ProgressIndicator label="需求分析" isActive={currentState === AppState.FORM} isCompleted={currentIndex > 0} />
                <ProgressIndicator label="市场洞察" isActive={currentState === AppState.ANALYSIS} isCompleted={currentIndex > 1} />
                <ProgressIndicator label="服务方案" isActive={currentState === AppState.STRATEGY} isCompleted={currentIndex > 2} />
                <ProgressIndicator label="资质审核" isActive={currentState === AppState.DEAL} isCompleted={currentIndex > 3} />
                <ProgressIndicator label="项目启动" isActive={currentState === AppState.SUCCESS} isCompleted={currentIndex > 4} />
            </div>

            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <Share2 className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">分享</span>
            </button>
          </div>
        </div>
      </div>
      {showShareModal && <SharePosterModal onClose={() => setShowShareModal(false)} />}
    </header>
  );
};
