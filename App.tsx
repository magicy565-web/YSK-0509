import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { InfoForm } from './components/InfoForm';
import { StateAnalysis } from './components/StateAnalysis';
import { StateStrategy } from './components/StateStrategy';
import { StateDeal } from './components/StateDeal';
import { LoadingOverlay } from './components/LoadingOverlay';
import { SuccessState } from './components/SuccessState';
import { aiService } from './services/aiService';
import { AppState, AnalysisData, StrategyData, DealData, InfoFormData, StrategyOption } from './types';

// A simple, local component to display errors.
const ErrorDisplay = ({ message, onClose }: { message: string, onClose: () => void }) => (
  <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
    <strong className="font-bold">发生错误! </strong>
    <span className="block sm:inline">{message}</span>
    <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={onClose}>
      <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
    </span>
  </div>
);

function App() {
  const [currentState, setCurrentState] = useState<AppState>(AppState.FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Data holders
  const [infoFormData, setInfoFormData] = useState<InfoFormData | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [strategyData, setStrategyData] = useState<StrategyData | null>(null);
  const [dealData, setDealData] = useState<DealData | null>(null);

  // For streaming data
  const [streamedAnalysis, setStreamedAnalysis] = useState("");
  const [streamedStrategy, setStreamedStrategy] = useState("");

  const handleFormSubmit = async (formData: InfoFormData) => {
    setIsLoading(true);
    setLoadingMessage('AI正在扫描全球市场需求...');
    setInfoFormData(formData);
    setError(null);
    setStreamedAnalysis("");
    
    aiService.getAnalysis(formData, 
      (chunk) => setStreamedAnalysis(prev => prev + chunk), 
      () => {
        setIsLoading(false);
        setCurrentState(AppState.ANALYSIS);
      },
      (err) => {
        console.error(err);
        setError(`AI市场分析失败: ${err.message}`);
        setIsLoading(false);
      }
    );
  };

  useEffect(() => {
    if (streamedAnalysis) {
      try {
        const parsed = JSON.parse(streamedAnalysis);
        setAnalysisData(parsed);
      } catch (e) {
        // Not a complete JSON object yet, do nothing
      }
    }
  }, [streamedAnalysis]);

  const handleApproveAnalysis = async () => {
    if (!infoFormData || !analysisData) return;

    setIsLoading(true);
    setLoadingMessage('正在生成开发策略与开发信...');
    setError(null);
    setStreamedStrategy("");

    aiService.getStrategy(infoFormData, analysisData, 
      (chunk) => setStreamedStrategy(prev => prev + chunk),
      () => {
        setIsLoading(false);
        setCurrentState(AppState.STRATEGY);
      },
      (err) => {
        console.error(err);
        setError(`生成开发策略失败: ${err.message}`);
        setIsLoading(false);
      }
    );
  };

  useEffect(() => {
    if (streamedStrategy) {
      try {
        const parsed = JSON.parse(streamedStrategy);
        setStrategyData(parsed);
      } catch (e) {
        // Not a complete JSON object yet
      }
    }
  }, [streamedStrategy]);

  const handleStrategyApproved = async (selectedStrategy: StrategyOption) => {
    if (!infoFormData) return;
    
    setIsLoading(true);
    setLoadingMessage('正在准备委托工作区...');
    setError(null);

    try {
      const deal = await aiService.getDeal(infoFormData);
      setDealData(deal);
      setCurrentState(AppState.DEAL);
    } catch (err: any) {
        console.error(err);
        setError(`创建委托失败: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveDeal = async (finalDealData: DealData) => {
      setDealData(finalDealData);
      setIsLoading(true);
      setLoadingMessage('正在提交您的委托...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLoading(false);
      setCurrentState(AppState.SUCCESS);
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      <Navbar currentState={currentState} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {error && <ErrorDisplay message={error} onClose={() => setError(null)} />}

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
