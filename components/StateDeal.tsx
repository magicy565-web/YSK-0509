
import React, { useState } from 'react';
import { 
  DealData, 
  FactoryQualification, 
  SuccessCase, 
  InfoFormData,
  ESTABLISHED_YEARS,
  ANNUAL_REVENUES,
  CERTIFICATES
} from '../types'; 
import { ArrowRight, ArrowLeft, Package, ShieldCheck, Users, CheckCircle, Building, Shield, User, Phone, Target } from 'lucide-react'; // TASK 8: Import new icons
import { LiveTicker } from './LiveTicker.tsx';

const base64Placeholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

const successStories: SuccessCase[] = [
  {
    id: 'case-1',
    title: '广东中山灯具厂 → 美国 Home Depot 供应商',
    tags: ['灯具照明', '美国', '首单$12k'],
    imageUrl: base64Placeholder,
    description: '通过我们第一周的“海关数据筛选”，第二周的“本地化开发”，成功在第三周将一个真实的、匹配的买家询盘移交给他们，并最终签约了当地大型分销商。',
    metrics: [{ label: '匹配周期', value: '3周' }, { label: '关键成果', value: '签约新区域分销商' }],
  },
  {
    id: 'case-2',
    title: '河北沧州管件厂 → 俄罗斯新市场',
    tags: ['管道配件', '俄罗斯', '精准匹配'],
    imageUrl: base64Placeholder,
    description: '工厂虽有外贸团队，但一直无法打入俄罗斯市场。通过我们对买家需求的精准分析，成功匹配并签约了第一家当地大型分销商。',
    metrics: [{ label: '核心价值', value: '打破市场壁垒' }, { label: '关键成果', value: '签约新区域分销商' }],
  },
];

const TrustBadge = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center text-sm text-slate-300"><span className="text-emerald-500 mr-2">{icon}</span>{text}</div>
);

interface SuccessStoryCardProps {
    story: SuccessCase;
}

const SuccessStoryCard: React.FC<SuccessStoryCardProps> = ({ story }) => (
    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:border-emerald-500 transition-all">
      <h4 className="font-bold text-emerald-400">{story.title}</h4>
      <p className="text-sm text-slate-300 mt-1 mb-3">{story.description}</p>
      <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex space-x-2">
            {story.tags.map(tag => <span key={tag} className="bg-slate-700 px-2 py-0.5 rounded">{tag}</span>)}
          </div>
      </div>
    </div>
);

const ProgressBar = ({ current, total }: { current: number, total: number }) => (
    <div className="w-full bg-slate-700 rounded-full h-2.5 mb-6">
        <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: `${(current / total) * 100}%` }}></div>
    </div>
);

interface StateDealProps {
  initialFormData: InfoFormData;
  onApprove: (data: DealData) => void;
}

export const StateDeal: React.FC<StateDealProps> = ({ initialFormData, onApprove }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FactoryQualification>({
    companyName: '',
    establishedYear: ESTABLISHED_YEARS[0],
    annualRevenue: ANNUAL_REVENUES[0],
    mainProductCategory: '',
    mainCertificates: [],
    contactPerson: '',
    position: 'manager',
    contactPhone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCertificateChange = (certificate: string) => {
    setFormData(prev => {
        const newCerts = prev.mainCertificates.includes(certificate)
            ? prev.mainCertificates.filter(c => c !== certificate)
            : [...prev.mainCertificates, certificate];
        return { ...prev, mainCertificates: newCerts };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApprove(formData);
  };

  const canGoToStep2 = formData.companyName && formData.establishedYear && formData.annualRevenue;
  const canGoToStep3 = formData.mainProductCategory && formData.mainCertificates.length > 0;
  const canSubmit = formData.contactPerson && formData.position && formData.contactPhone;

  return (
    <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-xl shadow-2xl">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        
        {/* Left Side: The Pitch */}
        <div className="md:w-1/2 flex flex-col">
          {/* TASK 8: Update title and subtitle */}
          <h1 className="text-3xl font-bold text-emerald-400 leading-tight">加入【出海严选】供应商联盟</h1>
          <p className="text-slate-300 mt-4 mb-6">对产品有信心？我们为您免费链接全球订单。此通道仅限拥有自主出口意愿的源头工厂/个人。</p>
          
          <h3 className="font-bold text-lg text-white mb-3 border-b border-slate-700 pb-2">近期成功案例</h3>
          <div className="space-y-4 mb-6">
            {successStories.map(story => <SuccessStoryCard key={story.id} story={story} />)}
          </div>

          <LiveTicker />

           {/* TASK 8: Update trust badges */}
           <div className="mt-auto pt-8 grid grid-cols-3 gap-4 text-center">
             <TrustBadge icon={<ShieldCheck className="w-4 h-4"/>} text="0费用入驻" />
             <TrustBadge icon={<Users className="w-4 h-4"/>} text="社群资源共享" />
             <TrustBadge icon={<Target className="w-4 h-4"/>} text="结果导向" />
           </div>
        </div>

        {/* Right Side: The Conversion Form */}
        <div className="md:w-1/2 bg-slate-800 p-6 rounded-lg border border-slate-700">
          <div className="bg-slate-700/50 p-4 rounded-lg mb-6">
              <p className="text-sm text-slate-400 flex items-center"><Package className="w-4 h-4 mr-2"/>您申请匹配的产品</p>
              <h3 className="font-bold text-lg text-emerald-400">{initialFormData.productName}</h3>
          </div>
          
          <h2 className="font-bold text-xl text-center">供应商实力评估 (3步)</h2>
          <p className="text-center text-sm text-slate-400 mb-4">完成评估，我们将为您优先匹配买家资源</p>
          <ProgressBar current={step} total={3} />
          
          <form onSubmit={handleSubmit}>
            {/* --- Step 1: 企业硬实力 --- */}
            <div style={{ display: step === 1 ? 'block' : 'none' }}>
              <h3 className="font-semibold mb-4 text-emerald-400 flex items-center"><Building className="w-5 h-5 mr-2"/>第一步: 企业硬实力</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-slate-300 mb-1">公司名称</label>
                  <input type="text" name="companyName" id="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full bg-slate-700 border-slate-600 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder='例如：XX电子科技有限公司' required />
                </div>
                <div>
                  <label htmlFor="establishedYear" className="block text-sm font-medium text-slate-300 mb-1">成立年限</label>
                  <select name="establishedYear" id="establishedYear" value={formData.establishedYear} onChange={handleInputChange} className="w-full bg-slate-700 border-slate-600 rounded-md p-2">
                    {ESTABLISHED_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="annualRevenue" className="block text-sm font-medium text-slate-300 mb-1">年出口额 (美元)</label>
                  <select name="annualRevenue" id="annualRevenue" value={formData.annualRevenue} onChange={handleInputChange} className="w-full bg-slate-700 border-slate-600 rounded-md p-2">
                    {ANNUAL_REVENUES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <button type="button" onClick={() => setStep(2)} disabled={!canGoToStep2} className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 font-bold py-2 px-4 rounded-md transition-all disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center">下一步 <ArrowRight className="w-4 h-4 ml-2" /></button>
            </div>

            {/* --- Step 2: 合规与认证 --- */}
            <div style={{ display: step === 2 ? 'block' : 'none' }}>
              <h3 className="font-semibold mb-4 text-emerald-400 flex items-center"><Shield className="w-5 h-5 mr-2"/>第二步: 合规与认证</h3>
               <div className="space-y-4">
                  <div>
                    <label htmlFor="mainProductCategory" className="block text-sm font-medium text-slate-300 mb-1">主营产品类目</label>
                    <input type="text" name="mainProductCategory" id="mainProductCategory" value={formData.mainProductCategory} onChange={handleInputChange} className="w-full bg-slate-700 border-slate-600 rounded-md p-2" placeholder='例如：LED照明 或 汽车配件' required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">核心认证 (可多选)</label>
                    <div className="grid grid-cols-3 gap-2">
                        {CERTIFICATES.map(cert => (
                            <button type="button" key={cert} onClick={() => handleCertificateChange(cert)} className={`p-2 text-sm rounded-md border ${formData.mainCertificates.includes(cert) ? 'bg-emerald-600 border-emerald-500' : 'bg-slate-700 border-slate-600 hover:bg-slate-600'}`}>
                                {cert}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-yellow-400 mt-3 p-2 bg-yellow-900/50 rounded-md">💡 提示：拥有 ISO/BSCI 认证的工厂将获得 3 倍流量推荐。</p>
                  </div>
               </div>
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setStep(1)} className="w-full bg-slate-600 hover:bg-slate-500 font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center"><ArrowLeft className="w-4 h-4 mr-2" />上一步</button>
                <button type="button" onClick={() => setStep(3)} disabled={!canGoToStep3} className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold py-2 px-4 rounded-md transition-all disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center">下一步 <ArrowRight className="w-4 h-4 ml-2" /></button>
              </div>
            </div>

            {/* --- Step 3: 决策人对接 --- */}
            <div style={{ display: step === 3 ? 'block' : 'none' }}>
                <h3 className="font-semibold mb-4 text-emerald-400 flex items-center"><User className="w-5 h-5 mr-2"/>第三步: 决策人对接</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="contactPerson" className="block text-sm font-medium text-slate-300 mb-1">联系人姓名</label>
                        <input type="text" name="contactPerson" id="contactPerson" value={formData.contactPerson} onChange={handleInputChange} className="w-full bg-slate-700 border-slate-600 rounded-md p-2" placeholder='您的姓名' required />
                    </div>
                    <div>
                        <label htmlFor="position" className="block text-sm font-medium text-slate-300 mb-1">您的职位</label>
                        <select name="position" id="position" value={formData.position} onChange={handleInputChange} className="w-full bg-slate-700 border-slate-600 rounded-md p-2">
                            <option value="owner">公司法人/股东</option>
                            <option value="manager">外贸经理/业务主管</option>
                            <option value="other">其他</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="contactPhone" className="block text-sm font-medium text-slate-300 mb-1">手机号</label>
                        <input type="tel" name="contactPhone" id="contactPhone" value={formData.contactPhone} onChange={handleInputChange} className="w-full bg-slate-700 border-slate-600 rounded-md p-2" placeholder='您的手机号码' required />
                    </div>
                </div>
                 <p className="text-xs text-yellow-400 mt-3 p-2 bg-yellow-900/50 rounded-md">🔒 信息将严格保密。为保证对接效率，仅限工厂法人或外贸总监对接。</p>
                <div className="flex gap-4 mt-6">
                    <button type="button" onClick={() => setStep(2)} className="w-full bg-slate-600 hover:bg-slate-500 font-bold py-2 px-4 rounded-md transition-all flex items-center justify-center"><ArrowLeft className="w-4 h-4 mr-2" />上一步</button>
                    <button type="submit" disabled={!canSubmit} className="w-full bg-emerald-500 hover:bg-emerald-600 font-bold py-2 px-4 rounded-lg transition-all text-base shadow-[0_0_15px_rgba(34,197,94,0.5)] hover:shadow-[0_0_25px_rgba(34,197,94,0.8)] disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none">提交资质，获取买家联系方式</button>
                </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};
