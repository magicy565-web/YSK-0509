import React from 'react';
import { ChevronRight, ShieldCheck, Search, Users, Briefcase, X, Check, ArrowRight } from 'lucide-react';

interface Props {
  onApprove: () => void;
}

export const StateStrategy: React.FC<Props> = ({ onApprove }) => {

  return (
    <div className="max-w-5xl mx-auto py-10 animate-fade-in-up pb-32">
      
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
          仅需 1 步，加入【出海严选】核心供应链
        </h2>
        <p className="text-slate-500 mt-4 text-lg max-w-2xl mx-auto">
          我们打破传统 B2B 平台的“卖铲子”模式。我们不赚您的会员费，我们做您的<span className="text-emerald-600 font-bold">海外合伙人</span>，为您链接真实订单。
        </p>
      </div>

      {/* --- 图形化流程 (The Graphic) --- */}
      <div className="grid grid-cols-1 gap-6 mb-16 relative">
        {/* 连接线 (仅在大屏显示) */}
        
        {/* Step 1: 提交资料 */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 text-center">
          <div className="mb-4 inline-block">
            <div className="p-3 bg-emerald-100 rounded-full">
              <Briefcase className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">第 1 步: 提交工厂资料</h3>
          <p className="text-sm text-slate-500">
            仅需 3 分钟，在线提交您的工厂基本情况、核心产品和优势。所有资料将被严格保密，仅用于匹配和验厂。
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
