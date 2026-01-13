
import React from 'react';
import { ArrowRight, Award, CheckCircle, Users } from 'lucide-react';

interface StateStrategyProps {
  onApprove: () => void;
}

const StepCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
    <div className="flex items-start">
      <div className="bg-emerald-100 text-emerald-700 p-3 rounded-full mr-4">{icon}</div>
      <div>
        <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
        <p className="text-slate-600 mt-1">{description}</p>
      </div>
    </div>
  </div>
);

export const StateStrategy: React.FC<StateStrategyProps> = ({ onApprove }) => {
  return (
    <div className="max-w-4xl mx-auto p-8 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">仅需 3 步，加入【出海严选】核心供应链</h1>
        <p className="text-slate-500 mt-3 text-lg">我们审核的不是资质，而是合作共赢的决心</p>
      </div>

      <div className="space-y-8 mb-12">
        <StepCard 
          icon={<Award className="w-6 h-6" />} 
          title="第一步: 大数据验厂与入库"
          description="提交资质，通过人工核验后，您的工厂将进入我们的【核心供应商白名单】，对海外买家可见。"
        />
        <StepCard 
          icon={<Users className="w-6 h-6" />} 
          title="第二步: 加入出海操盘手社群"
          description="不仅是接单。入驻即由专人拉入【社群】，共享行业红皮书、物流底价与避坑指南。"
        />
        <StepCard 
          icon={<CheckCircle className="w-6 h-6" />} 
          title="第三步: 坐享询盘与交易撮合"
          description="不管是样品单还是柜货，我们负责搞定买家信任。您只需专注产品交付。"
        />
      </div>

      <div className="bg-slate-800 text-white rounded-xl p-8 text-center shadow-lg">
        <h3 className="text-2xl font-bold mb-3">我们郑重承诺</h3>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
          对源头工厂 <span className="text-yellow-400 font-bold">0</span> 会员费、
          <span className="text-yellow-400 font-bold">0</span> 入驻费、
          <span className="text-yellow-400 font-bold">0</span> 广告费。
        </p>
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={onApprove}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-10 rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center justify-center mx-auto"
        >
          我已了解，继续提交资质
          <ArrowRight className="w-5 h-5 ml-3" />
        </button>
      </div>
    </div>
  );
};
