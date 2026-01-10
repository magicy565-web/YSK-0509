import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { StateIdle } from './components/StateIdle';
import { StateAnalysis } from './components/StateAnalysis';
import { StateStrategy } from './components/StateStrategy';
import { StateDeal } from './components/StateDeal';
import { LoadingOverlay } from './components/LoadingOverlay';
import { SuccessState } from './components/SuccessState';
import { performAction } from './services/aiService';
import { AppState, AnalysisData, StrategyData, DealData } from './types';

function App() {
  const [currentState, setCurrentState] = useState<AppState>(AppState.IDLE);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  
  // Data holders
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [strategyData, setStrategyData] = useState<StrategyData | null>(null);
  const [dealData, setDealData] = useState<DealData | null>(null);

  const handleStart = async () => {
    setIsLoading(true);
    setLoadingMessage('AI is scanning global market demand...');
    
    try {
      const response = await performAction('init');
      if (response.data) {
        setAnalysisData(response.data as AnalysisData);
        setCurrentState(AppState.ANALYSIS);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveAnalysis = async () => {
    setIsLoading(true);
    setLoadingMessage('Generating outreach strategy & copywriting...');

    try {
      const response = await performAction('start');
      if (response.data) {
        setStrategyData(response.data as StrategyData);
        setCurrentState(AppState.STRATEGY);
      }
    } catch (error) {
        console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendStrategy = async () => {
    setIsLoading(true);
    setLoadingMessage('Sending emails & waiting for responses...');

    try {
      const response = await performAction('quote');
      if (response.data) {
        setDealData(response.data as DealData);
        setCurrentState(AppState.DEAL);
      }
    } catch (error) {
        console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignDeal = async () => {
      setIsLoading(true);
      setLoadingMessage('Generating contracts & shipping docs...');
      
      try {
          await performAction('sign');
          setCurrentState(AppState.SUCCESS);
      } catch (error) {
          console.error(error);
      } finally {
          setIsLoading(false);
      }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      <Navbar currentState={currentState} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Progress Stepper (Simple Visual) */}
        {currentState !== AppState.SUCCESS && (
            <div className="mb-8 hidden sm:flex items-center justify-center space-x-4 text-xs font-semibold tracking-wider text-slate-400">
            <span className={currentState === AppState.IDLE ? 'text-slate-900' : 'text-emerald-600'}>1. UPLOAD</span>
            <span className="w-8 h-px bg-slate-200"></span>
            <span className={currentState === AppState.ANALYSIS ? 'text-slate-900' : currentState === AppState.STRATEGY || currentState === AppState.DEAL ? 'text-emerald-600' : ''}>2. ANALYSIS</span>
            <span className="w-8 h-px bg-slate-200"></span>
            <span className={currentState === AppState.STRATEGY ? 'text-slate-900' : currentState === AppState.DEAL ? 'text-emerald-600' : ''}>3. STRATEGY</span>
            <span className="w-8 h-px bg-slate-200"></span>
            <span className={currentState === AppState.DEAL ? 'text-slate-900' : ''}>4. DEAL</span>
            </div>
        )}

        {currentState === AppState.IDLE && (
          <StateIdle onStart={handleStart} />
        )}

        {currentState === AppState.ANALYSIS && analysisData && (
          <StateAnalysis data={analysisData} onApprove={handleApproveAnalysis} />
        )}

        {currentState === AppState.STRATEGY && strategyData && (
          <StateStrategy data={strategyData} onSend={handleSendStrategy} />
        )}

        {currentState === AppState.DEAL && dealData && (
          <StateDeal data={dealData} onSign={handleSignDeal} />
        )}

        {currentState === AppState.SUCCESS && (
            <SuccessState />
        )}
      </main>

      {isLoading && <LoadingOverlay message={loadingMessage} />}
    </div>
  );
}

export default App;
