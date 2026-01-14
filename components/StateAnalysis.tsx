import React from 'react';
import { 
  Users, Lock, TrendingUp, ChevronRight, Database, LocateFixed, 
  Star, Award, Calendar, DollarSign, Package, Factory, CheckCircle2 
} from 'lucide-react';
import { AnalysisData, PotentialBuyer, RecommendedBuyer } from '../types';
import { LiveTicker } from './LiveTicker'; 
import { BuyerMap } from './BuyerMap'; 

interface StateAnalysisProps {
  data: AnalysisData;
  onApprove: () => void;
  region: string; 
}

// [修复] 完整还原 BestMatchCard，确保数据结构不缺失
const BestMatchCard: React.FC<{ buyer: RecommendedBuyer }> = ({ buyer }) => {
  const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(buyer.name)}&backgroundColor=059669`;

  return (
    <div className="bg-white rounded-2xl shadow-xl border-2 border-emerald-500/30 overflow-hidden relative transform hover:scale-[1.01] transition-all duration-300">
      {/* 顶部高亮条 */}
      <div className="bg-emerald-600 text-white px-5 py-2 text-sm font-bold flex justify-between items-center">
        <div className="flex items-center">
          <Star className="w-4 h-4 mr-2 fill-yellow-400 text-yellow-400" />
          大数据严选 · 今日最佳匹配
        </div>
        <span className="bg-white/20 px-2 py-0.5 rounded text-xs backdrop-blur-sm">匹配度 {buyer.matchScore || 98}%</span>
      </div>

      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* 左侧：买家画像 */}
          <div className="flex-shrink-0 flex flex-col items-center md:items-start text-center md:text-left min-w-[160px] border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-6">
            <div className="relative">
              <img src={avatarUrl} alt="Buyer" className="w-24 h-24 rounded-full border-4 border-emerald-50 mb-4 shadow-sm" />
              <div className="absolute bottom-4 right-0 bg-emerald-500 text-white text-[10px] px-1.5 rounded-full border-2 border-white">
                V
              </div>
            </div>
            <h3 className="font-bold text-slate-900 text-xl">{buyer.name}</h3>
            <p className="text-emerald-700 font-medium text-sm mb-2">{buyer.companyMasked}</p>
            <div className="text-xs text-slate-500 flex items-center justify-center md:justify-start bg-slate-50 px-3 py-1 rounded-full mt-1">
              <LocateFixed className="w-3 h-3 mr-1" />
              {buyer.location}
            </div>
          </div>

          {/* 右侧：详细情报矩阵 (恢复原有结构) */}
          <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 text-sm">
            {/* 维度 1 */}
            <div className="space-y-1">
              <div className="flex items-center text-slate-500 text-xs font-medium mb-1">
                <Package className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> 意向采购范围
              </div>
              <p className="font-bold text-slate-800 text-base">{buyer.productScope}</p>
            </div>
            
            {/* 维度 2 */}
            <div className="space-y-1">
              <div className="flex items-center text-slate-500 text-xs font-medium mb-1">
                <Factory className="w-3.5 h-3.5 mr-1.5 text-purple-500" /> 偏好工厂类型
              </div>
              <p className="font-bold text-slate-800 text-base">{buyer.factoryPreference}</p>
            </div>

            {/* 维度 3 */}
            <div className="space-y-1">
              <div className="flex items-center text-slate-500 text-xs font-medium mb-1">
                <Award className="w-3.5 h-3.5 mr-1.5 text-amber-500" /> 资质硬性要求
              </div>
              <div className="flex flex-wrap gap-1.5">
                {buyer.qualifications?.map(tag => (
                  <span key={tag} className="bg-amber-50 text-amber-700 text-xs px-2 py-0.5 rounded border border-amber-100 font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 维度 4 */}
            <div className="space-y-1">
              <div className="flex items-center text-slate-500 text-xs font-medium mb-1">
                <DollarSign className="w-3.5 h-3.5 mr-1.5 text-green-600" /> 最近采购规模
              </div>
              <p className="font-bold text-green-600 text-xl font-mono">{buyer.lastOrderSize}</p>
            </div>
          </div>
        </div>

        {/* 底部信息条 */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            加入平台: <span className="text-slate-600 ml-1">{buyer.joinDate}</span>
          </div>
          <div className="flex items-center text-emerald-700 font-medium bg-emerald-50 px-3 py-1.5 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
            已完成实名认证 & 资金核验
          </div>
        </div>
      </div>
    </div>
  );
};

// ... LockedBuyer 组件保持不变 ...
const LockedBuyer: React.FC<{ buyer: PotentialBuyer; index: number }> = ({ buyer, index }) => {
    const maskName = (name: string) => {
        if (!name) return '***';
        if (name.length < 4) return '***';
        return name.substring(0, 3) + '***';
    };
    return (
        <div className="relative group flex items-center p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-300 transition-all hover:shadow-md">
             <div className="bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-slate-500 mr-4 flex-shrink-0">
                {index + 2}
             </div>
             <div className="flex-grow z-10 min-w-0">
                <p className="font-semibold text-slate-800 truncate pr-2">{maskName(buyer.name)}</p>
                 <div className="text-xs text-slate-500 flex items-center mt-1 truncate">
                  <LocateFixed className="w-3 h-3 mr-1 flex-shrink-0" />
                  {buyer.location}, {buyer.country}
                </div>
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
      
      {/* Header Stats */}
      <div className="text-center mb-8">
         <h2 className="text-3xl font-bold tracking-tight text-slate-900">全球市场机会洞察报告</h2>
         <p className="mt-2 text-slate-500">
           基于海关大数据为您匹配 <span className="font-bold text-slate-800">{region === 'Global' ? '全球' : region}</span> 市场的优质买家
         </p>
      </div>

      {/* 地图与统计 - 视觉中心 */}
      <BuyerMap region={region} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
             <span className="text-slate-400 text-xs uppercase tracking-wider mb-1">潜在匹配总数</span>
             <span className="text-3xl font-bold text-emerald-600">{totalCount}</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
             <span className="text-slate-400 text-xs uppercase tracking-wider mb-1">高意向买家</span>
             <span className="text-3xl font-bold text-slate-800">{bestMatch ? 1 + topBuyers.length : topBuyers.length}</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
             <span className="text-slate-400 text-xs uppercase tracking-wider mb-1">今日最佳推荐</span>
             <span className="text-3xl font-bold text-yellow-500">Top 1</span>
          </div>
      </div>

      {/* 实时播报 */}
      <div className="mb-10 -mt-2 px-1">
        <LiveTicker />
      </div>

      {/* 买家列表展示区 */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* 左侧：Best Match (占 2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {bestMatch ? (
            <section>
               <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 mr-2" />
                    今日最佳推荐
                  </h3>
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">AI 智能精选</span>
                </div>
              <BestMatchCard buyer={bestMatch} />
            </section>
          ) : (
             <div className="h-64 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 animate-pulse">
                正在分析最佳匹配买家...
             </div>
          )}

          <section>
             <h3 className="text-lg font-bold text-slate-900 mb-4 px-1 mt-8">其他高潜力买家</h3>
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

        {/* 右侧：侧边栏 (占 1/3) */}
        <div className="lg:col-span-1">
          <div className="bg-indigo-900 text-white rounded-2xl p-6 shadow-xl sticky top-24">
            <h4 className="font-bold text-lg mb-6 flex items-center">
                <Users className="w-5 h-5 mr-2" /> 为什么选择我们？
            </h4>
            <ul className="space-y-5 text-sm text-indigo-100">
              <li className="flex items-start">
                <div className="bg-indigo-700 p-1.5 rounded-full mr-3 mt-0.5 flex-shrink-0"><CheckCircle2 className="w-3 h-3" /></div>
                <span><strong className="text-white">去中间化：</strong>直接获取决策人联系方式，跳过前台和中介。</span>
              </li>
              <li className="flex items-start">
                <div className="bg-indigo-700 p-1.5 rounded-full mr-3 mt-0.5 flex-shrink-0"><CheckCircle2 className="w-3 h-3" /></div>
                <span><strong className="text-white">全托管服务：</strong>让我们的本地化专家团队为您处理客户开发。</span>
              </li>
              <li className="flex items-start">
                <div className="bg-indigo-700 p-1.5 rounded-full mr-3 mt-0.5 flex-shrink-0"><CheckCircle2 className="w-3 h-3" /></div>
                <span><strong className="text-white">结果负责：</strong>按效果付费，无需承担高额推广费。</span>
              </li>
            </ul>
            
            <div className="mt-8 pt-6 border-t border-indigo-800/50">
              <p className="text-xs text-indigo-300 mb-3 text-center">已有 1,240+ 工厂正在使用</p>
              <button
                onClick={onApprove}
                className="w-full bg-white text-indigo-900 font-bold py-3.5 px-4 rounded-xl shadow-lg hover:bg-indigo-50 transition-all flex items-center justify-center group"
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
