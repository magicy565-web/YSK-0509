import React from 'react';
import { 
  Users, Lock, TrendingUp, ChevronRight, Database, LocateFixed, 
  Star, Award, Calendar, DollarSign, Package, Factory, CheckCircle2 
} from 'lucide-react';
import { AnalysisData, PotentialBuyer, RecommendedBuyer } from '../types';
import { LiveTicker } from './LiveTicker';

interface StateAnalysisProps {
  data: AnalysisData;
  onApprove: () => void;
}

// ... (BestMatchCard 和 LockedBuyer 组件代码保持不变，此处省略) ...
// 请保留原有的 BestMatchCard 和 LockedBuyer 组件定义

const BestMatchCard: React.FC<{ buyer: RecommendedBuyer }> = ({ buyer }) => {
    // ... (保持原样)
    const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(buyer.name)}&backgroundColor=059669`;
    return (
        <div className="bg-white rounded-2xl shadow-xl border-2 border-emerald-500/30 overflow-hidden relative transform hover:scale-[1.01] transition-all duration-300">
          <div className="bg-emerald-600 text-white px-4 py-1 text-sm font-bold flex justify-between items-center">
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
              大数据严选 - 最佳匹配
            </div>
            <span className="bg-white/20 px-2 py-0.5 rounded text-xs">98% 匹配度</span>
          </div>
    
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              
              <div className="flex-shrink-0 flex flex-col items-center md:items-start text-center md:text-left min-w-[140px]">
                <img src={avatarUrl} alt="Buyer" className="w-20 h-20 rounded-full border-4 border-emerald-50 mb-3 shadow-sm" />
                <h3 className="font-bold text-slate-800 text-lg">{buyer.name}</h3>
                <p className="text-emerald-600 font-medium text-sm mb-1">{buyer.companyMasked}</p>
                <div className="text-xs text-slate-500 flex items-center justify-center md:justify-start">
                  <LocateFixed className="w-3 h-3 mr-1" />
                  {buyer.location}
                </div>
              </div>
    
              <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="bg-blue-50 p-1.5 rounded mr-3 mt-0.5"><Package className="w-4 h-4 text-blue-600" /></div>
                    <div>
                      <p className="text-slate-400 text-xs">意向采购范围</p>
                      <p className="font-semibold text-slate-800">{buyer.productScope}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-purple-50 p-1.5 rounded mr-3 mt-0.5"><Factory className="w-4 h-4 text-purple-600" /></div>
                    <div>
                      <p className="text-slate-400 text-xs">偏好工厂类型</p>
                      <p className="font-semibold text-slate-800">{buyer.factoryPreference}</p>
                    </div>
                  </div>
                </div>
    
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="bg-amber-50 p-1.5 rounded mr-3 mt-0.5"><Award className="w-4 h-4 text-amber-600" /></div>
                    <div>
                      <p className="text-slate-400 text-xs">资质硬性要求</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {buyer.qualifications.map(tag => (
                          <span key={tag} className="bg-slate-100 text-slate-600 text-xs px-1.5 py-0.5 rounded border border-slate-200">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-green-50 p-1.5 rounded mr-3 mt-0.5"><DollarSign className="w-4 h-4 text-green-600" /></div>
                    <div>
                      <p className="text-slate-400 text-xs">最近采购规模</p>
                      <p className="font-bold text-slate-800 text-lg leading-tight">{buyer.lastOrderSize}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
    
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center">
                <Calendar className="w-3 h-3 mr-1.5" />
                加入平台: {buyer.joinDate}
              </div>
              <div className="flex items-center text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded">
                <CheckCircle2 className="w-3 h-3 mr-1.5" />
                实名认证买家
              </div>
            </div>
          </div>
        </div>
      );
};

const LockedBuyer: React.FC<{ buyer: PotentialBuyer; index: number }> = ({ buyer, index }) => {
    // ... (保持原样)
    const maskName = (name: string) => {
        if (name.length < 4) return '***';
        return name.substring(0, 3) + '***';
      };
    
      return (
        <div className="relative group flex items-center p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-300 transition-all hover:shadow-md">
          <div className="bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-slate-500 mr-4 flex-shrink-0">
            {index + 2}
          </div>
          <div className="flex-grow z-10 min-w-0">
            <div className="flex justify-between items-start">
              <p className="font-semibold text-slate-800 truncate pr-2">{maskName(buyer.name)}</p>
              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded whitespace-nowrap">
                {buyer.buyerType}
              </span>
            </div>
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

export const StateAnalysis: React.FC<StateAnalysisProps> = ({ data, onApprove }) => {
  // [修复核心]：安全访问 + 默认值
  // 即使 data.potentialBuyers 是 undefined，也不会报错，而是使用空对象
  const potentialBuyers = data?.potentialBuyers || {};
  
  // 安全获取 top10，如果是 undefined 则默认为空数组
  const topBuyers = potentialBuyers.top10 || [];
  
  // 安全获取 bestMatch
  const bestMatch = potentialBuyers.bestMatch;

  // 安全获取 total
  const totalCount = potentialBuyers.total || 0;

  return (
    <div className="max-w-6xl mx-auto py-8 animate-fade-in pb-32">
      
      {/* Header Stats */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl shadow-2xl p-8 mb-4 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

        <h2 className="text-3xl font-bold tracking-tight relative z-10">全球市场机会洞察报告</h2>
        <p className="mt-2 text-slate-300 relative z-10">基于全球海关数据与B2B行为分析</p>
        
        <div className="mt-8 flex flex-wrap justify-center gap-4 md:gap-12 relative z-10">
          <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/10">
            <div className="text-3xl font-bold text-emerald-400">{totalCount}</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">潜在匹配总数</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/10">
            <div className="text-3xl font-bold text-white">
              {bestMatch ? 1 + topBuyers.length : topBuyers.length}
            </div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">高意向买家</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/10">
            <div className="text-3xl font-bold text-yellow-400">Top 1</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">完美匹配推荐</div>
          </div>
        </div>
      </div>

       <div className="mb-8 -mt-2 px-4 md:px-0">
        <LiveTicker />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* [修复]：只有当 bestMatch 存在时才渲染卡片，防止报错 */}
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
              <p className="text-xs text-slate-400 mt-3 ml-1 flex items-center">
                <Database className="w-3 h-3 mr-1.5" />
                该买家数据来源于最近3个月的活跃询盘记录与海关提单。
              </p>
            </section>
          ) : (
            // 可选：添加一个加载占位符或空状态
            <div className="h-64 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400">
               正在生成最佳匹配...
            </div>
          )}

          <section>
             <h3 className="text-lg font-bold text-slate-900 mb-4 px-1">其他高潜力买家</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* [修复]：topBuyers 默认为 []，这里 map 不会报错 */}
                {topBuyers.map((buyer, index) => (
                  <LockedBuyer key={buyer.id} buyer={buyer} index={index} />
                ))}
                {topBuyers.length === 0 && (
                    <p className="text-sm text-slate-400 col-span-2 text-center py-4">正在检索更多买家数据...</p>
                )}
             </div>
          </section>
        </div>

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