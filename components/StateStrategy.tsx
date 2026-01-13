import React from 'react';
import { ShieldCheck, Search, Users, Briefcase, Check, ArrowRight } from 'lucide-react';

interface Props {
  onApprove: () => void;
}

export const StateStrategy: React.FC<Props> = ({ onApprove }) => {

  return (
    <div className="max-w-5xl mx-auto py-10 animate-fade-in-up pb-32">
      
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
          仅需 3 步，加入【出海严选】核心供应链
        </h2>
        <p className="text-slate-500 mt-4 text-lg max-w-2xl mx-auto">
          我们打破传统 B2B 平台的“卖铲子”模式。我们做您的<span className="text-emerald-600 font-bold">海外合伙人</span>，为您链接真实订单。
        </p>
      </div>

      {/* --- 图形化流程 (The Graphic) --- */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        
        {/* Step 1: 核心实力认证 */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 text-center">
          <div className="mb-4 inline-block bg-emerald-100 rounded-full p-3">
            <Briefcase className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">第 1 步: 核心实力认证</h3>
          <p className="text-sm text-slate-500">
            在线提交您的工厂信息、产品优势与资质认证。AI 将基于此进行深度分析，构建您的专属实力档案。
          </p>
        </div>

        {/* Step 2: AI 精准匹配 */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-emerald-500 text-center">
           <div className="mb-4 inline-block bg-emerald-100 rounded-full p-3">
            <Search className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">第 2 步: AI 精准匹配</h3>
          <p className="text-sm text-slate-500">
            我们的 AI 引擎将您的实力档案与全球买家需求库进行毫秒级匹配，筛选出最匹配的潜在买家。
          </p>
        </div>
        
        {/* Step 3: 链接全球买家 */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 text-center">
           <div className="mb-4 inline-block bg-emerald-100 rounded-full p-3">
            <Users className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">第 3 步: 链接全球买家</h3>
          <p className="text-sm text-slate-500">
            获取为您量身定制的买家报告，并授权我们为您进行下一步链接。高效、精准、结果导向。
          </p>
        </div>
      </div>

      {/* Trust & Safety */}
      <div className="bg-slate-100 p-8 rounded-2xl border border-slate-200 mb-12">
        <div className="flex flex-col md:flex-row items-center">
          <div className="mb-6 md:mb-0 md:mr-8 text-center">
            <ShieldCheck className="w-20 h-20 text-emerald-500 mx-auto" />
            <h3 className="text-xl font-bold text-slate-800 mt-2">卖家保护承诺</h3>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-slate-600">
            <div className="flex items-start">
              <Check className="w-5 h-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
              <span><span className="font-semibold text-slate-800">资料加密:</span> 所有提交数据经加密传输，保障商业机密。</span>
            </div>
            <div className="flex items-start">
              <Check className="w-5 h-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
              <span><span className="font-semibold text-slate-800">授权访问:</span> 您的资料仅在获得您授权后，才会展示给已签署NDA的买家。</span>
            </div>
            <div className="flex items-start">
              <Check className="w-5 h-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
              <span><span className="font-semibold text-slate-800">不收会员费:</span> 我们承诺不收取任何形式的会员年费、坑位费。</span>
            </div>
            <div className="flex items-start">
              <Check className="w-5 h-5 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
              <span><span className="font-semibold text-slate-800">订单驱动:</span> 我们只在成功为您撮合真实订单后，才从订单中获取合理佣金。</span>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <p className="text-slate-500 mb-6">准备好迎接来自全球 TOP 采购商的订单了吗？</p>
        <button 
          onClick={onApprove}
          className="bg-emerald-600 text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 animate-pulse"
        >
          <div className="flex items-center">
            <span>立即加入，获取订单</span>
            <ArrowRight className="w-6 h-6 ml-3" />
          </div>
        </button>
      </div>
    </div>
  );
}
