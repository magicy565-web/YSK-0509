
import React from 'react';
import { Users, Lock, TrendingUp, ChevronRight, Database, LocateFixed } from 'lucide-react';
import { AnalysisData, PotentialBuyer } from '../types';

interface StateAnalysisProps {
  data: AnalysisData;
  onApprove: () => void;
}

const LockedBuyer: React.FC<{ buyer: PotentialBuyer }> = ({ buyer }) => {
  const maskName = (name: string) => {
    if (name.length < 4) return '***';
    return name.substring(0, 3) + '***' + name.substring(name.length - 2);
  };

  return (
    <div className="relative group flex items-center text-left p-4 bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
      <div className="flex-grow z-10">
        <p className="font-semibold text-slate-800">{maskName(buyer.name)}</p>
        <div className="text-xs text-slate-500 flex items-center mt-1">
          <LocateFixed className="w-3 h-3 mr-1.5" />
          {buyer.location}, {buyer.country}
        </div>
        <div className="text-xs text-slate-500 flex items-center mt-1">
          <Users className="w-3 h-3 mr-1.5" />
          {buyer.industry} - {buyer.buyerType}
        </div>
      </div>
      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <Lock className="w-6 h-6 text-slate-700 mr-2" />
        <span className="font-semibold text-slate-700">委托后解锁详细联系方式</span>
      </div>
    </div>
  );
};

export const StateAnalysis: React.FC<StateAnalysisProps> = ({ data, onApprove }) => {
  const topBuyers = data.potentialBuyers.top10 || [];

  return (
    <div className="max-w-7xl mx-auto py-8 animate-fade-in">
      <div className="bg-slate-800 text-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">AI市场分析完毕</h2>
        <p className="mt-2 text-lg text-slate-300">我们为您的产品识别了多个高潜力海外市场机会。</p>
        <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 rounded-full">
              <Users className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="text-3xl font-bold">{data.potentialBuyers.total}</div>
              <div className="text-sm text-slate-400">总匹配买家</div>
            </div>
          </div>
          <div className="w-px h-12 bg-slate-600 hidden md:block"></div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/10 rounded-full">
                <TrendingUp className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <div className="text-3xl font-bold">{topBuyers.length}</div>
              <div className="text-sm text-slate-400">高意向买家</div>
            </div>
          </div>
        </div>
        <div className="mt-6 text-xs text-slate-500 flex items-center justify-center">
          <Database className="w-3 h-3 mr-1.5" />
          数据源: 已验证海关数据 & B2B数据库
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold text-slate-800 text-center mb-2">Top 10 高意向买家</h3>
        <p className="text-slate-500 text-center mb-6">确认委托后，您将获得完整的公司背景和决策人联系方式。</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topBuyers.map((buyer) => (
            <LockedBuyer key={buyer.id} buyer={buyer} />
          ))}
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-slate-200 p-4 shadow-lg md:static md:shadow-none md:bg-transparent md:border-0 md:p-0 md:mt-12">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-center bg-slate-900 text-white p-4 rounded-xl">
          <div className="text-center md:text-left">
            <h4 className="font-bold text-lg">准备好接触这些买家了吗？</h4>
            <p className="text-sm text-slate-300 mt-1">让我们的AI驱动的本地团队为您处理客户开发。</p>
          </div>
          <button
            onClick={onApprove}
            className="w-full mt-4 md:mt-0 md:w-auto md:ml-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all flex items-center justify-center shrink-0"
          >
            查看我们的服务方案
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};
