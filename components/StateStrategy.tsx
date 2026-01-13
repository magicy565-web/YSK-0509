
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
          仅需 3 步，加入【出海严选】核心供应链
        </h2>
        <p className="text-slate-500 mt-4 text-lg max-w-2xl mx-auto">
          我们打破传统 B2B 平台的“卖铲子”模式。我们不赚您的会员费，我们做您的<span className="text-emerald-600 font-bold">海外合伙人</span>，为您链接真实订单。
        </p>
      </div>

      {/* --- 图形化流程 (The Graphic) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 relative">
        {/* 连接线 (仅在大屏显示) */}
        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-200 -z-10"></div>

        {/* Step 1 */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 text-center relative group hover:-translate-y-1 transition-transform duration-300">
          <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform">
            1
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">资质验厂与入库</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            提交您的工厂硬实力证明。通过人工核验后，您将进入我们的<span className="text-emerald-600 font-medium">【核心供应商白名单】</span>，对数万海外买家可见。
          </p>
          <div className="mt-4 inline-flex items-center text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            <ShieldCheck className="w-3 h-3 mr-1" /> 严选门槛
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 text-center relative group hover:-translate-y-1 transition-transform duration-300">
          <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
            2
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">加入出海操盘社群</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            不仅是接单。入驻即由专人拉入<span className="text-emerald-600 font-medium">【核心资源群】</span>，共享行业红皮书、物流底价与避坑指南，与行业大咖同行。
          </p>
          <div className="mt-4 inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            <Users className="w-3 h-3 mr-1" /> 资源共享
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 text-center relative group hover:-translate-y-1 transition-transform duration-300">
          <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform">
            3
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">坐享询盘与成交</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            无论是样品单还是柜货，我们负责搞定买家信任与谈判。您只需专注<span className="text-emerald-600 font-medium">产品交付</span>，做最省心的外贸。
          </p>
          <div className="mt-4 inline-flex items-center text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            <Briefcase className="w-3 h-3 mr-1" /> 结果导向
          </div>
        </div>
      </div>

      {/* --- 价值对比表 (The Table) --- */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 mb-12">
        <div className="bg-slate-900 p-4 text-center">
          <h3 className="text-white font-bold text-lg">为什么要选择【出海严选】？</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium w-1/4">核心维度</th>
                <th scope="col" className="px-6 py-4 font-medium w-1/3 text-slate-400">传统付费 B2B 平台</th>
                <th scope="col" className="px-6 py-4 font-bold text-emerald-600 bg-emerald-50/30 w-1/3">出海严选联盟</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                <td className="px-6 py-4 font-medium text-slate-900">入驻门槛</td>
                <td className="px-6 py-4 text-slate-500">给钱就能上 (29,800/年起)</td>
                <td className="px-6 py-4 font-bold text-emerald-600 bg-emerald-50/30 flex items-center">
                  <Check className="w-4 h-4 mr-2" /> 0 元 (需通过资质验厂)
                </td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                <td className="px-6 py-4 font-medium text-slate-900">流量逻辑</td>
                <td className="px-6 py-4 text-slate-500">竞价排名 (谁出钱多谁在前面)</td>
                <td className="px-6 py-4 font-bold text-emerald-600 bg-emerald-50/30 flex items-center">
                  <Check className="w-4 h-4 mr-2" /> 严选匹配 (好产品优先)
                </td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                <td className="px-6 py-4 font-medium text-slate-900">运营模式</td>
                <td className="px-6 py-4 text-slate-500">需自聘运营团队 (成本高)</td>
                <td className="px-6 py-4 font-bold text-emerald-600 bg-emerald-50/30 flex items-center">
                  <Check className="w-4 h-4 mr-2" /> 全托管 / 社群专家赋能
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-medium text-slate-900">结果保障</td>
                <td className="px-6 py-4 text-slate-500 flex items-center">
                  <X className="w-4 h-4 mr-2 text-red-400" /> 无订单保障
                </td>
                <td className="px-6 py-4 font-bold text-emerald-600 bg-emerald-50/30 flex items-center">
                  <Check className="w-4 h-4 mr-2" /> 结果导向 (社群资源兜底)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <button
          onClick={onApprove}
          className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-emerald-600 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 hover:bg-emerald-700 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
        >
          我已确认权益，立即申请验厂
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          <div className="absolute -top-3 -right-3">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
            </span>
          </div>
        </button>
        <p className="mt-4 text-sm text-slate-400">
          * 每日限额审核 50 家工厂，今日剩余名额紧张
        </p>
      </div>
    </div>
  );
};
