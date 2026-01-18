import React from 'react';
import { Briefcase, Globe, TrendingUp, ShieldCheck } from 'lucide-react';

export const ShareCard = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] bg-gray-100 p-10">
      <h2 className="text-slate-500 mb-6 font-mono text-sm">
        ▼ 下方卡片为 5:4 标准比例，可直接截图作为分享封面
      </h2>

      {/* --- 卡片容器 (500px x 400px) --- */}
      <div 
        className="relative w-[500px] h-[400px] bg-slate-900 text-white rounded-xl overflow-hidden shadow-2xl flex flex-col border border-slate-700"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {/* 背景装饰：光晕与网格 */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

        {/* 顶部：品牌标识 */}
        <div className="relative z-10 px-8 pt-8 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-500 p-1.5 rounded-lg shadow-lg shadow-emerald-500/20">
              <Briefcase className="h-5 w-5 text-slate-900" />
            </div>
            <span className="font-bold text-lg tracking-wide text-emerald-50">
              出海严选
            </span>
          </div>
          <div className="bg-slate-800/80 backdrop-blur-sm px-3 py-1 rounded-full border border-slate-600">
             <span className="text-xs font-mono text-emerald-400">AI 驱动</span>
          </div>
        </div>

        {/* 中部：核心价值主张 */}
        <div className="relative z-10 px-8 flex-grow flex flex-col justify-center mt-2">
          <h1 className="text-3xl font-extrabold leading-tight mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              链接全球<br/>TOP 采购商
            </span>
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-[80%]">
            拒绝盲目开发。上传产品资料，AI 自动为您匹配北美、欧洲核心供应链买家。
          </p>
        </div>

        {/* 底部：数据可视化展示 (模拟图表) */}
        <div className="relative z-10 mx-6 mb-6 p-4 bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 flex items-center justify-around">
          
          <div className="text-center">
            <div className="bg-slate-700/50 p-2 rounded-full inline-flex mb-1">
              <Globe className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-xs text-slate-400">覆盖国家</div>
            <div className="font-bold text-lg text-white">120+</div>
          </div>

          <div className="w-px h-10 bg-slate-700"></div>

          <div className="text-center">
             <div className="bg-slate-700/50 p-2 rounded-full inline-flex mb-1">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-xs text-slate-400">实名买家</div>
            <div className="font-bold text-lg text-white">3,500+</div>
          </div>

           <div className="w-px h-10 bg-slate-700"></div>

           <div className="text-center">
             <div className="bg-slate-700/50 p-2 rounded-full inline-flex mb-1">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-xs text-slate-400">撮合效率</div>
            <div className="font-bold text-lg text-white">98%</div>
          </div>
        </div>

        {/* 底部装饰条 */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-cyan-500"></div>
      </div>
    </div>
  );
};
