
import React from 'react';
import { ChevronRight, ShieldCheck, Search, Send, Briefcase } from 'lucide-react';

interface Props {
  onApprove: () => void;
}

const strategySteps = [
  {
    id: '1',
    timeline: '第一周',
    serviceStep: '海关大数据筛选与画像构建',
    description: '我们聚合分析海关数据、B2B数据库和企业征信信息，识别并描绘出与您产品完美匹配的高意向买家画像。',
    icon: Search,
  },
  {
    id: '2',
    timeline: '第二周',
    serviceStep: '本地化、多渠道开发',
    description: '我们在目标市场的本地团队将通过电话、领英和个性化邮件序列，与关键决策人建立联系。',
    icon: Send,
  },
  {
    id: '3',
    timeline: '第三周',
    serviceStep: '暖性询盘机会移交',
    description: '我们将所有积极响应和暖性询盘直接转交给您进行商务谈判和成交，实现无缝对接。',
    icon: Briefcase,
  },
];

export const StateStrategy: React.FC<Props> = ({ onApprove }) => {

  return (
    <div className="max-w-4xl mx-auto py-8 animate-fade-in-up">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900">我们成熟的服务方案 (SOP)</h2>
        <p className="text-slate-500 mt-2 text-lg">我们不只是提供名单，更是为您连接真实的、有质量的买家。这是我们的工作流程。</p>
      </div>

      <div className="relative">
        <div className="absolute left-5 top-5 h-full w-0.5 bg-slate-200" aria-hidden="true"></div>

        <div className="space-y-12">
          {strategySteps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="relative flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold z-10">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="ml-6">
                  <p className="text-sm font-semibold text-emerald-600">{step.timeline}</p>
                  <h4 className="mt-1 text-xl font-bold text-slate-800">{step.serviceStep}</h4>
                  <p className="mt-2 text-slate-600">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-16 text-center bg-slate-100 border border-slate-200 rounded-2xl p-8">
        <ShieldCheck className="w-12 h-12 mx-auto text-emerald-500 mb-4" />
        <h4 className="font-bold text-xl text-slate-800">我们的服务承诺</h4>
        <p className="text-slate-600 mt-2 max-w-2xl mx-auto">
          我们的合作模式基于共同成功。供应商的参与完全免费。我们仅在交易成功后向买方收取少量佣金，确保为您提供零风险的合作体验。
        </p>
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={onApprove}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center justify-center mx-auto"
        >
          我已了解服务方案，继续进行资质审核
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
};
