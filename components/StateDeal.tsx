
import React, { useState } from 'react';
import { DealData, FactoryQualification, SuccessCase, InfoFormData } from '../types'; 
import { ArrowRight, CheckCircle, ImagePlus, Package, ShieldCheck, UserCheck, Zap } from 'lucide-react';

// --- Mock Data ---
const liveStats = { matchedAmount: 2.4, activeBuyers: 342, waitingDemands: 18 };
const base64Placeholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

// --- CRITICAL NARRATIVE FIX (v2.3) ---
// The success stories now BOTH align with the matchmaking SOP presented in StateStrategy.
const successStories: SuccessCase[] = [
  {
    id: 'case-1',
    title: '广东中山灯具厂 → 美国 Home Depot 供应商',
    tags: ['灯具照明', '美国', '首单$12k'],
    imageUrl: base64Placeholder,
    description: '通过平台快速匹配，2周内拿下了美国知名建材零售商的试单，解决了传统渠道开发客户慢的难题。',
    metrics: [{ label: '匹配周期', value: '2周' }, { label: '合作买家', value: '美国头部零售商' }],
  },
  {
    id: 'case-2',
    // MODIFIED: Replaced "Full-service operation" with a story about market entry via matchmaking.
    title: '河北沧州管件厂 → 俄罗斯新市场',
    tags: ['管道配件', '俄罗斯', '精准匹配'],
    imageUrl: base64Placeholder,
    description: '工厂虽有外贸团队，但一直无法打入俄罗斯市场。通过我们对买家需求的精准分析，成功匹配并签约了第一家当地大型分销商。',
    metrics: [{ label: '核心价值', value: '打破市场壁垒' }, { label: '关键成果', value: '签约新区域分销商' }],
  },
];

// --- Sub-Components ---
const TrustBadge = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center text-sm text-slate-300"><span className="text-emerald-500 mr-2">{icon}</span>{text}</div>
);

const SuccessStoryCard = ({ story }: { story: SuccessCase }) => (
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

// --- Main StateDeal Component ---

interface StateDealProps {
  initialFormData: InfoFormData;
  onApprove: (data: DealData) => void;
}

export const StateDeal: React.FC<StateDealProps> = ({ initialFormData, onApprove }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FactoryQualification>({
    companyName: '',
    contactPerson: '',
    position: 'manager',
    hasExportRights: null,
    accepts30PercentDeposit: null,
    factoryPicture: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, factoryPicture: e.target.files![0] }));
    }
  };

  const canGoToStep2 = formData.companyName && formData.contactPerson && formData.position;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApprove(formData);
  };

  return (
    <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-xl shadow-2xl">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        
        {/* Left Side: The Pitch */}
        <div className="md:w-1/2 flex flex-col">
          <h1 className="text-3xl font-bold text-emerald-400 leading-tight">加入优选供应商网络，<br/>与全球 500+ 顶尖买家建立连接</h1>
          <p className="text-slate-300 mt-4 mb-6">我们已帮助数百家像您一样的工厂成功出海。现在，轮到您了。</p>

          <div className="grid grid-cols-3 gap-4 bg-slate-800/50 p-4 rounded-lg mb-6 text-center">
            <div><p className="text-3xl font-bold">${liveStats.matchedAmount}M</p><p className="text-xs text-slate-400">本月已撮合订单</p></div>
            <div><p className="text-3xl font-bold">{liveStats.activeBuyers}</p><p className="text-xs text-slate-400">活跃采购商</p></div>
            <div><p className="text-3xl font-bold">{liveStats.waitingDemands}</p><p className="text-xs text-slate-400">待匹配需求</p></div>
          </div>

          <h3 className="font-bold text-lg text-white mb-3 border-b border-slate-700 pb-2">近期成功案例</h3>
          <div className="space-y-4">
            {successStories.map(story => <SuccessStoryCard key={story.id} story={story} />)}
          </div>

           <div className="mt-auto pt-8 grid grid-cols-3 gap-4 text-center">
             <TrustBadge icon={<UserCheck />} text="真实买家验证" />
             <TrustBadge icon={<ShieldCheck />} text="交易资金担保" />
             <TrustBadge icon={<Zap />} text="对供应商永久免费" />
           </div>
        </div>

        {/* Right Side: The Conversion Form */}
        <div className="md:w-1/2 bg-slate-800 p-6 rounded-lg border border-slate-700">
          
          <div className="bg-slate-700/50 p-4 rounded-lg mb-6">
              <p className="text-sm text-slate-400 flex items-center"><Package className="w-4 h-4 mr-2"/>您申请匹配的产品</p>
              <h3 className="font-bold text-lg text-emerald-400">{initialFormData.productName}</h3>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">优势: {initialFormData.productDetails}</p>
          </div>
          
          <h2 className="font-bold text-xl text-center">完善您的企业资质</h2>
          <p className="text-center text-sm text-emerald-400 font-semibold mb-6">最后一步，即可免费对接买家 (今日剩余 3 席)</p>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: step === 1 ? 'block' : 'none' }}>
              <h3 className="font-semibold mb-4 text-slate-300">第一步: 基础信息</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-slate-400 mb-1">公司名称</label>
                  <input type="text" name="companyName" id="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full bg-slate-700 border-slate-600 rounded-md p-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder='例如：XX电子科技有限公司' required />
                </div>
                <div>
                  <label htmlFor="contactPerson" className="block text-sm font-medium text-slate-400 mb-1">联系人姓名</label>
                  <input type="text" name="contactPerson" id="contactPerson" value={formData.contactPerson} onChange={handleInputChange} className="w-full bg-slate-700 border-slate-600 rounded-md p-2" placeholder='您的姓名' required />
                </div>
                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-slate-400 mb-1">您的职位</label>
                  <select name="position" id="position" value={formData.position} onChange={handleInputChange} className="w-full bg-slate-700 border-slate-600 rounded-md p-2">
                    <option value="owner">公司法人/股东</option>
                    <option value="manager">外贸经理/业务主管</option>
                    <option value="other">其他</option>
                  </select>
                </div>
              </div>
              <button type="button" onClick={() => setStep(2)} disabled={!canGoToStep2} className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 font-bold py-2 px-4 rounded-md transition-all disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center">下一步 <ArrowRight className="w-4 h-4 ml-2" /></button>
            </div>

            <div style={{ display: step === 2 ? 'block' : 'none' }}>
              <h3 className="font-semibold mb-4 text-slate-300">第二步: 实力自证</h3>
              <div className="space-y-5">
                 <div className="p-3 bg-slate-700/50 rounded-md"><p className="block text-sm font-medium text-slate-400 mb-2">贵司有自主出口权吗？</p><div className="flex gap-4"><button type="button" onClick={() => setFormData(p=>({...p, hasExportRights: true}))} className={`flex-1 p-2 rounded text-sm ${formData.hasExportRights === true ? 'bg-emerald-500' : 'bg-slate-600'}`}>有</button><button type="button" onClick={() => setFormData(p=>({...p, hasExportRights: false}))} className={`flex-1 p-2 rounded text-sm ${formData.hasExportRights === false ? 'bg-rose-500' : 'bg-slate-600'}`}>没有，需代理</button></div></div>
                 <div className="p-3 bg-slate-700/50 rounded-md"><p className="block text-sm font-medium text-slate-400 mb-2">能否接受 30% 预付款？</p><div className="flex gap-4"><button type="button" onClick={() => setFormData(p=>({...p, accepts30PercentDeposit: true}))} className={`flex-1 p-2 rounded text-sm ${formData.accepts30PercentDeposit === true ? 'bg-emerald-500' : 'bg-slate-600'}`}>能接受</button><button type="button" onClick={() => setFormData(p=>({...p, accepts30PercentDeposit: false}))} className={`flex-1 p-2 rounded text-sm ${formData.accepts30PercentDeposit === false ? 'bg-rose-500' : 'bg-slate-600'}`}>希望调整</button></div></div>
                 <div>
                    <label htmlFor="factoryPicture" className="w-full cursor-pointer bg-slate-700/50 p-4 rounded-md flex flex-col items-center justify-center border-2 border-dashed border-slate-600 hover:border-emerald-500"><ImagePlus className="w-8 h-8 text-slate-400 mb-2" /><span className="text-sm text-slate-300">上传工厂/车间实拍图</span><span className="text-xs text-slate-500 mt-1">有图的供应商将获优先匹配</span><input type="file" id="factoryPicture" name="factoryPicture" onChange={handleFileChange} className="hidden" accept="image/*" /></label>
                    {formData.factoryPicture && <p className="text-xs text-emerald-400 mt-2 text-center">已选择文件: {formData.factoryPicture.name}</p>}
                 </div>
              </div>
              <button type="submit" className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 font-bold py-3 px-4 rounded-lg transition-all text-base shadow-[0_0_15px_rgba(34,197,94,0.5)] hover:shadow-[0_0_25px_rgba(34,197,94,0.8)]">提交资质，获取买家联系方式</button>
               <p className="text-xs text-slate-400 mt-2 text-center">提交后，专属顾问将在24小时内联系您进行核验。</p>
               <button type="button" onClick={() => setStep(1)} className="text-center w-full text-xs text-slate-500 mt-4 hover:text-slate-300">返回上一步</button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};
