import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { InfoForm } from './components/InfoForm';
import { StateAnalysis } from './components/StateAnalysis';
import { StateStrategy } from './components/StateStrategy';
import { StateDeal } from './components/StateDeal';
import { LoadingOverlay } from './components/LoadingOverlay';
import { SuccessState } from './components/SuccessState';
import { aiService } from './services/aiService';
import { AppState, AnalysisData, StrategyData, DealData, InfoFormData, StrategyOption } from './types';

function App() {
  const [currentState, setCurrentState] = useState<AppState>(AppState.FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  
  // Data holders
  const [infoFormData, setInfoFormData] = useState<InfoFormData | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [strategyData, setStrategyData] = useState<StrategyData | null>(null);
  const [dealData, setDealData] = useState<DealData | null>(null);

  const handleFormSubmit = async (formData: InfoFormData) => {
    setIsLoading(true);
    setLoadingMessage('AI正在扫描全球市场需求...');
    setInfoFormData(formData);
    
    try {
      const response = await aiService('analysis', formData);
      if (response.data) {
        setAnalysisData(response.data as AnalysisData);
        setCurrentState(AppState.ANALYSIS);
      }
    } catch (error) {
      console.error(error);
      alert(`出现意外错误: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveAnalysis = async () => {
    if (!infoFormData || !analysisData) return;

    setIsLoading(true);
    setLoadingMessage('正在生成开发策略与开发信...');

    try {
      const response = await aiService('strategy', infoFormData, analysisData);
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

  const handleStrategyApproved = async (selectedStrategy: StrategyOption) => {
    if (!infoFormData) return;
    
    setIsLoading(true);
    setLoadingMessage('正在准备委托工作区...');

    try {
      const response = await aiService('deal', infoFormData, analysisData || undefined, strategyData || undefined);
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

  // --- UPDATED FOR STEP 4 ---
  const handleApproveDeal = async (finalDealData: DealData) => {
      setDealData(finalDealData); // Save the final data
      setIsLoading(true);
      setLoadingMessage('正在提交您的委托...');
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate submission
      setIsLoading(false);
      setCurrentState(AppState.SUCCESS);
  }
  // --- END OF UPDATE ---

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      <Navbar currentState={currentState} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Progress Stepper - UPDATED FOR STEP 4 */}
        {currentState !== AppState.SUCCESS && (
            <div className="mb-8 hidden sm:flex items-center justify-center space-x-4 text-xs font-semibold tracking-wider text-slate-400">
            <span className={currentState === AppState.FORM ? 'text-slate-900' : 'text-emerald-600'}>1. 提交产品</span>
            <span className="w-8 h-px bg-slate-200"></span>
            <span className={currentState === AppState.ANALYSIS ? 'text-slate-900' : currentState === AppState.STRATEGY || currentState === AppState.DEAL ? 'text-emerald-600' : ''}>2. 市场分析</span>
            <span className="w-8 h-px bg-slate-200"></span>
            <span className={currentState === AppState.STRATEGY ? 'text-slate-900' : currentState === AppState.DEAL ? 'text-emerald-600' : ''}>3. 开发策略</span>
            <span className="w-8 h-px bg-slate-200"></span>
            <span className={currentState === AppState.DEAL ? 'text-slate-900' : ''}>4. 委托开发</span>
            </div>
        )}

        {currentState === AppState.FORM && (
          <InfoForm onSubmit={handleFormSubmit} />
        )}

        {currentState === AppState.ANALYSIS && analysisData && (
          <StateAnalysis data={analysisData} onApprove={handleApproveAnalysis} />
        )}

        {currentState === AppState.STRATEGY && strategyData && (
          <StateStrategy data={strategyData} onApprove={handleStrategyApproved} />
        )}

        {/* UPDATED FOR STEP 4 */}
        {currentState === AppState.DEAL && dealData && (
          <StateDeal data={dealData} onApprove={handleApproveDeal} />
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
