
import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { InfoForm } from './components/InfoForm';
import { StateAnalysis } from './components/StateAnalysis';
import { StateStrategy } from './components/StateStrategy';
import { StateDeal } from './components/StateDeal';
import { LoadingOverlay } from './components/LoadingOverlay';
import { SuccessState } from './components/SuccessState';
import { aiService } from './services/aiService';
import { AppState, AnalysisData, DealData, FactoryQualification, InfoFormData } from './types';

const ErrorDisplay = ({ message, onClose }: { message: string, onClose: () => void }) => (
  <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
    <strong className="font-bold">发生错误! </strong>
    <span className="block sm:inline">{message}</span>
    <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={onClose}>
      <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>关闭</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
    </span>
  </div>
);

function App() {
  const [currentState, setCurrentState] = useState<AppState>(AppState.FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const [infoFormData, setInfoFormData] = useState<InfoFormData | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [dealData, setDealData] = useState<DealData | null>(null);
  const [streamedAnalysis, setStreamedAnalysis] = useState("");

  const loadingTimers = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimers = () => {
    loadingTimers.current.forEach(timer => clearTimeout(timer));
    loadingTimers.current = [];
  };

  const handleFormSubmit = async (formData: InfoFormData) => {
    setIsLoading(true);
    setInfoFormData(formData);
    setError(null);
    setStreamedAnalysis("");
    clearAllTimers();

    setLoadingMessage(`正在扫描【${formData.targetMarket}】市场的海关数据与采购商线索...`);

    const timer1 = setTimeout(() => {
      setLoadingMessage(`正在独家采购商库中进行精准匹配 (基于产品核心优势识别)...`);
    }, 15000);

    const timer2 = setTimeout(() => {
      setLoadingMessage(`已找到海外采购商线索，正在进行联系人数据验证与清洗...`);
    }, 35000);

    loadingTimers.current.push(timer1, timer2);

    const minWaitTime = new Promise(resolve => setTimeout(resolve, 45000));

    const aiRequest = new Promise<void>((resolve, reject) => {
      aiService.getAnalysis(formData, 
        (chunk) => setStreamedAnalysis(prev => prev + chunk), 
        () => resolve(),
        (err) => reject(err)
      );
    });

    try {
      await Promise.all([aiRequest, minWaitTime]);
      
      clearAllTimers();
      setIsLoading(false);
      setCurrentState(AppState.ANALYSIS);

    } catch (err: any) {
      console.error(err);
      clearAllTimers();
      setError(`市场分析中断: ${err.message}`);
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (streamedAnalysis) {
      try {
        const parsed = JSON.parse(streamedAnalysis);
        setAnalysisData(parsed);
      } catch (e) { /* Incomplete JSON, wait for more data */ }
    }
  }, [streamedAnalysis]);

  const handleApproveAnalysis = async () => {
    setIsLoading(true);
    setLoadingMessage('正在为您生成服务与行动方案 (SOP)...');
    setError(null);

    aiService.getStrategy(
      () => {
        setIsLoading(false);
        setCurrentState(AppState.STRATEGY);
      }
    );
  };

  const handleStrategyApproved = () => {
    setCurrentState(AppState.DEAL);
  };

  const handleApproveDeal = async (finalDealData: DealData) => {
      setDealData(finalDealData);
      setIsLoading(true);
      setLoadingMessage('正在提交您的资质申请以供审核...');
      setError(null);

      try {
        await aiService.submitApplication(finalDealData);
        setCurrentState(AppState.SUCCESS);
      } catch (err: any) {
        console.error(err);
        setError(`提交失败: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      <Navbar currentState={currentState} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {error && <ErrorDisplay message={error} onClose={() => setError(null)} />}

        {currentState === AppState.FORM && <InfoForm onSubmit={handleFormSubmit} />}
        
        {currentState === AppState.ANALYSIS && analysisData && <StateAnalysis data={analysisData} onApprove={handleApproveAnalysis} />}
        
        {currentState === AppState.STRATEGY && <StateStrategy onApprove={handleStrategyApproved} />}
        
        {currentState === AppState.DEAL && infoFormData && (
          <StateDeal 
            initialFormData={infoFormData} 
            onApprove={handleApproveDeal} 
          />
        )}
        
        {currentState === AppState.SUCCESS && <SuccessState />}
      </main>

      <LoadingOverlay isLoading={isLoading} message={loadingMessage} />
    </div>
  );
}

export default App;
