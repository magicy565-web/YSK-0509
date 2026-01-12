
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { InfoForm } from './components/InfoForm';
import { StateAnalysis } from './components/StateAnalysis';
import { StateStrategy } from './components/StateStrategy';
import { StateDeal } from './components/StateDeal';
import { LoadingOverlay } from './components/LoadingOverlay';
import { SuccessState } from './components/SuccessState';
import { aiService } from './services/aiService';
// BUG FIX: Removed unused ProductQuotation, updated DealData to be FactoryQualification
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

// BUG FIX: Removed obsolete initialDealData and related functions.
// The state for the deal form is now managed within StateDeal.tsx itself.

function App() {
  const [currentState, setCurrentState] = useState<AppState>(AppState.FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // This state holds the data from the very first form (product info).
  const [infoFormData, setInfoFormData] = useState<InfoFormData | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  // This state will hold the final data from the Deal/Qualification form.
  const [dealData, setDealData] = useState<DealData | null>(null);
  const [streamedAnalysis, setStreamedAnalysis] = useState("");

  const handleFormSubmit = async (formData: InfoFormData) => {
    setIsLoading(true);
    setLoadingMessage('AI正在分析全球市场匹配度...');
    setInfoFormData(formData); // Save the initial form data
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
      } catch (e) { /* Incomplete JSON, wait for more data */ }
    }
  }, [streamedAnalysis]);

  const handleApproveAnalysis = async () => {
    setIsLoading(true);
    setLoadingMessage('正在为您生成服务与行动方案 (SOP)...');
    setError(null);

    await aiService.getStrategy(
      () => {
        setIsLoading(false);
        setCurrentState(AppState.STRATEGY);
      },
      (err) => {
        console.error(err);
        setError(`生成服务方案失败: ${err.message}`);
        setIsLoading(false);
      }
    );
  };

  // BUG FIX: Simplified this function. Its only job is to move to the next state.
  const handleStrategyApproved = () => {
    setCurrentState(AppState.DEAL);
  };

  const handleApproveDeal = async (finalDealData: DealData) => {
      setDealData(finalDealData);
      setIsLoading(true);
      setLoadingMessage('正在提交您的资质申请以供审核...');
      setError(null);

      try {
        // Assuming aiService.submitApplication is updated to handle the new DealData format
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
        
        {/* --- CRITICAL FIX --- */}
        {/* Render StateDeal ONLY when in DEAL state AND we have the initial form data. */}
        {/* Pass the initial form data to StateDeal to connect the user journey. */}
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
