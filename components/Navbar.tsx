import React from 'react';
import { Anchor, Activity, CheckCircle, Globe } from 'lucide-react';
import { AppState } from '../types';

interface NavbarProps {
  currentState: AppState;
}

export const Navbar: React.FC<NavbarProps> = ({ currentState }) => {
  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-500 p-1.5 rounded-lg">
              <Anchor className="h-6 w-6 text-slate-900" />
            </div>
            <span className="font-bold text-xl tracking-tight">Export Auto-Pilot</span>
          </div>

          {/* Status Indicators */}
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2 text-slate-400">
              <Globe className="h-4 w-4" />
              <span>Global Node: <span className="text-emerald-400 font-medium">Online</span></span>
            </div>
            <div className="h-4 w-px bg-slate-700"></div>
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">System Status:</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                currentState === AppState.IDLE ? 'bg-slate-700 text-slate-300' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {currentState === AppState.IDLE ? 'STANDBY' : 'ACTIVE EXECUTION'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};