import React from 'react';
import { 
  Users, Lock, TrendingUp, ChevronRight, Database, LocateFixed, 
  Star, Award, Calendar, DollarSign, Package, Factory, CheckCircle2 
} from 'lucide-react';
import { AnalysisData, PotentialBuyer, RecommendedBuyer } from '../types';
import { LiveTicker } from './LiveTicker'; 
import { BuyerMap } from './BuyerMap'; // [新增] 引入地图组件

interface StateAnalysisProps {
  data: AnalysisData;
  onApprove: () => void;
  region: string; // [新增] 接收地区参数
}

// ... BestMatchCard 和 LockedBuyer 代码保持不变 ...
// (请保留您原来文件里的这两个组件定义，不要删除)

// 1. BestMatchCard 组件 (保持原样)
const BestMatchCard: React.FC<{ buyer: RecommendedBuyer }> = ({ buyer }) => {
   // ... 原代码 ...
   // 为节省篇幅，此处省略，请务必保留原代码！
   const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(buyer.name)}&backgroundColor=059669`;
   return (
    <div className="bg-white rounded-2xl shadow-xl border-2 border-emerald-500/30 overflow-hidden relative transform hover:scale-[1.01] transition-all duration-300">
      {/* ... 内容保持不变 ... */}
       <div className="bg-emerald-600 text-white px-4 py-1 text-sm font-bold flex justify-between items-center">
        <div className="flex items-center">
          <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
          大数据严选 - 最佳匹配
        </div>
        <span className="bg-white/20 px-2 py-0.5 rounded text-xs">98% 匹配度</span>
      </div>
      <div className="p-6">
          {/* ... 具体展示内容 ... */}
          <div className="flex flex-col md:flex-row gap-6">
             {/* ... */}
             <h3 className="font-bold text-slate-800 text-lg">{buyer.name}</h3>
             {/* ... */}
          </div>
      </div>
    </div>
   );
};

// 2. LockedBuyer 组件 (保持原样)
const LockedBuyer: React.FC<{ buyer: PotentialBuyer; index: number }> = ({ buyer, index }) => {
   // ... 原代码 ...
    const maskName = (name: string) => {
        if (!name) return '***';
        if (name.length < 4) return '***';
        return name.substring(0, 3) + '***';
    };
    return (
        <div className="relative group flex items-center p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-300 transition-all hover:shadow-md">
             {/* ... */}
             <div className="bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-slate-500 mr-4 flex-shrink-0">
                {index + 2}
             </div>
             <div className="flex-grow z-10 min-w-0">
                <p className="font-semibold text-slate-800 truncate pr-2">{maskName(buyer.name)}</p>
                {/* ... */}
             </div>
             <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 rounded-lg cursor-not-allowed">
                <div className="bg-slate-900/90 text-white text-xs px-3 py-1.5 rounded-full flex items-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                <Lock className="w-3 h-3 mr-1.5" />
                委托后解锁
                </div>
            </div>
        </div>
    );
};


export const StateAnalysis: React.FC<StateAnalysisProps> = ({ data, onApprove, region }) => {
  const potentialBuyers = data?.potentialBuyers || {};
  const topBuyers = potentialBuyers.top10 || [];
  const bestMatch = potentialBuyers.bestMatch;
  const totalCount = potentialBuyers.total || 0;

  return (
    <div className="max-w-6xl mx-auto py-8 animate-fade-in pb-32">
      
      {/* 顶部统计区 (微调，使其更紧凑) */}
      <div className="text-center mb-8">
         <h2 className="text-3xl font-bold tracking-tight text-slate-900">全球市场机会洞察报告</h2>
         <p className="mt-2 text-slate-500">
           基于海关大数据为您匹配 {region === 'Global' ? '全球' : region} 市场的优质买家
         </p>
      </div>

      {/* [新增] 实时活跃买家地图 */}
      {/* 将地图放在最显眼的位置，作为视觉中心 */}
      <BuyerMap region={region} />

      {/* 核心数据指标 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
             <span className="text-slate-400 text-xs uppercase tracking-wider">潜在匹配总数</span>
             <span className="text-3xl font-bold text-emerald-600">{totalCount}</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
             <span className="text-slate-400 text-xs uppercase tracking-wider">高意向买家</span>
             <span className="text-3xl font-bold text-slate-800">{bestMatch ? 1 + topBuyers.length : topBuyers.length}</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
             <span className="text-slate-400 text-xs uppercase tracking-wider">今日最佳推荐</span>
             <span className="text-3xl font-bold text-yellow-500">Top 1</span>
          </div>
      </div>

      <div className="mb-8 -mt-2 px-4 md:px-0">
        <LiveTicker />
      </div>

      {/* [保留] 具体的买家列表展示区 */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Best Match Card */}
          {bestMatch ? (
            <section>
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-xl font-bold text-slate-900 flex items-center">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 mr-2" />
                  今日最佳推荐
                </h3>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">刚刚更新</span>
              </div>
              <BestMatchCard buyer={bestMatch} />
            </section>
          ) : (
             <div className="h-64 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 animate-pulse">
                正在分析最佳匹配买家...
             </div>
          )}

          {/* Locked Buyer List (您强调要保留的部分) */}
          <section>
             <h3 className="text-lg font-bold text-slate-900 mb-4 px-1">其他高潜力买家</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topBuyers.map((buyer, index) => (
                  <LockedBuyer key={buyer.id} buyer={buyer} index={index} />
                ))}
                {topBuyers.length === 0 && (
                    <div className="col-span-2 text-center py-8 text-slate-400 bg-slate-50 rounded-lg">
                        正在从数据库检索更多列表...
                    </div>
                )}
             </div>
          </section>
        </div>

        {/* 右侧侧边栏 (行动号召) */}
        <div className="lg:col-span-1">
          <div className="bg-indigo-900 text-white rounded-2xl p-6 shadow-lg sticky top-24">
            <h4 className="font-bold text-lg mb-4">为什么选择我们？</h4>
            <ul className="space-y-4 text-sm text-indigo-100">
              <li className="flex items-start">
                <div className="bg-indigo-700 p-1 rounded-full mr-3 mt-0.5"><CheckCircle2 className="w-3 h-3" /></div>
                <span>直接获取决策人联系方式，跳过前台。</span>
              </li>
              <li className="flex items-start">
                <div className="bg-indigo-700 p-1 rounded-full mr-3 mt-0.5"><CheckCircle2 className="w-3 h-3" /></div>
                <span>让我们的本地化专家团队为您处理客户开发。</span>
              </li>
              <li className="flex items-start">
                <div className="bg-indigo-700 p-1 rounded-full mr-3 mt-0.5"><CheckCircle2 className="w-3 h-3" /></div>
                <span>按效果付费，无需承担高额推广费。</span>
              </li>
            </ul>
            
            <div className="mt-8 pt-6 border-t border-indigo-800">
              <p className="text-xs text-indigo-300 mb-3 text-center">已有 1,240+ 工厂正在使用</p>
              <button
                onClick={onApprove}
                className="w-full bg-white text-indigo-900 font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-indigo-50 transition-colors flex items-center justify-center group"
              >
                解锁全部买家
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 移动端底部按钮 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] md:hidden z-50">
        <button
          onClick={onApprove}
          className="w-full bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center justify-center"
        >
          查看服务方案
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>

    </div>
  );
};
