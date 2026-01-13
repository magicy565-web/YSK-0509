
import React, { useState, useEffect } from 'react';
import { InfoFormData } from '../types';
import { ArrowRight, Search, Globe, Target, ShieldCheck, Zap, Building, Sparkles, TrendingUp } from 'lucide-react';

// --- 组件：打字机特效 (视觉升级版) ---
const Typewriter: React.FC = () => {
  const phrases = [
    "🔍 刚刚 广东照明厂 成功匹配 32 个美国买家",
    "🔍 刚刚 浙江五金厂 获取了 德国采购商 询盘",
    "🔍 刚刚 江苏医疗器械厂 匹配到 巴西 分销商",
    "🔍 刚刚 山东轮胎厂 对接上 中东 采购代表",
  ];
  const [text, setText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    let currentText = '';
    let isDeleting = false;
    let charIndex = 0;
    let timeoutId: NodeJS.Timeout;

    const type = () => {
      const currentPhrase = phrases[phraseIndex];
      // 简单的打字机逻辑
      if (isDeleting) {
        currentText = currentPhrase.substring(0, charIndex--);
      } else {
        currentText = currentPhrase.substring(0, charIndex++);
      }
      setText(currentText);

      let typeSpeed = isDeleting ? 30 : 80;

      if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typeSpeed = 2500; // 停留时间
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        setPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
        typeSpeed = 500;
      }

      timeoutId = setTimeout(type, typeSpeed);
    };

    type();
    return () => clearTimeout(timeoutId);
  }, [phraseIndex]);

  return (
    <div className="inline-flex items-center bg-slate-100/80 border border-slate-200 rounded-full px-4 py-1.5 text-sm text-slate-600 shadow-sm backdrop-blur-sm">
      <TrendingUp className="w-4 h-4 mr-2 text-emerald-500" />
      <span className="font-medium mr-1">实时动态:</span>
      <span className="min-w-[200px] text-left">{text}<span className="animate-pulse text-emerald-500">|</span></span>
    </div>
  );
};

interface InfoFormProps {
  onSubmit: (formData: InfoFormData) => void;
}

export const InfoForm: React.FC<InfoFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<InfoFormData>({
    productName: '',
    productDetails: '',
    targetMarket: 'North America', 
  });
  const [isHovered, setIsHovered] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* 背景装饰光效 */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-emerald-400/20 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 md:p-12 overflow-hidden">
        
        {/* 顶部标题区 */}
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center justify-center space-x-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-100">
            <Sparkles className="w-3 h-3" />
            <span>AI 驱动 · 海关数据实时同步</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            输入产品，<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">一键匹配全球买家</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            已有 <span className="font-bold text-slate-900 border-b-2 border-emerald-400/50">15,402</span> 家源头工厂通过平台成功出海，平均 3 天对接首个意向客户。
          </p>
          
          {/* 打字机动态 */}
          <div className="pt-2">
            <Typewriter />
          </div>
        </div>
        
        {/* 核心表单区 */}
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto relative z-10">
          
          {/* 产品关键词输入 */}
          <div className="group relative">
            <label htmlFor="productName" className="block text-sm font-semibold text-slate-700 mb-2 pl-1">
              核心产品关键词 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              </div>
              <input
                type="text"
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 focus:bg-white transition-all shadow-sm group-hover:shadow-md"
                placeholder="例如：锂离子电池、数控机床、LED屏"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* 核心优势 */}
            <div className="group relative">
              <label htmlFor="productDetails" className="block text-sm font-semibold text-slate-700 mb-2 pl-1">
                核心优势 <span className="text-xs font-normal text-slate-400">(越详细匹配越准)</span>
              </label>
              <div className="relative">
                <div className="absolute top-4 left-4 pointer-events-none">
                  <Target className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <textarea
                  id="productDetails"
                  name="productDetails"
                  value={formData.productDetails}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 focus:bg-white transition-all shadow-sm group-hover:shadow-md resize-none h-[120px]"
                  placeholder="例如：拥有私模，通过UL/CE认证，支持OEM/ODM，日产能5万件..."
                  required
                />
              </div>
            </div>

            {/* 目标市场 */}
            <div className="flex flex-col">
               <label htmlFor="targetMarket" className="block text-sm font-semibold text-slate-700 mb-2 pl-1">
                目标市场 <span className="text-xs font-normal text-slate-400">(可选)</span>
              </label>
              <div className="relative h-full">
                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none top-0">
                    <Globe className="h-5 w-5 text-slate-400" />
                 </div>
                 <select
                    id="targetMarket"
                    name="targetMarket"
                    value={formData.targetMarket}
                    onChange={handleChange}
                    className="block w-full h-[120px] pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 focus:bg-white transition-all shadow-sm cursor-pointer appearance-none"
                    // style={{ paddingTop: '1rem' }} 
                  >
                    <option>北美 (North America)</option>
                    <option>欧洲 (Europe)</option>
                    <option>东南亚 (Southeast Asia)</option>
                    <option>中东 (Middle East)</option>
                    <option>南美 (South America)</option>
                    <option>全球 (Global)</option>
                  </select>
                  {/* Custom Arrow */}
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
              </div>
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="pt-4">
            <button 
              type="submit"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group relative w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-5 px-8 rounded-xl shadow-xl hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center text-lg tracking-wide">
                立即启动全球资源匹配
                <ArrowRight className={`ml-3 w-6 h-6 transition-transform duration-300 ${isHovered ? 'translate-x-2' : ''}`} />
              </div>
              {/* 光效扫过动画 */}
              <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12 transition-all duration-1000 group-hover:left-[100%]"></div>
            </button>
          </div>
        </form>

        {/* 底部信任背书 */}
        <div className="mt-10 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="flex items-center justify-center text-slate-500 text-sm font-medium">
              <div className="bg-emerald-100 p-1.5 rounded-full mr-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              企业数据银行级加密
            </div>
            <div className="flex items-center justify-center text-slate-500 text-sm font-medium">
              <div className="bg-blue-100 p-1.5 rounded-full mr-2">
                <Zap className="w-4 h-4 text-blue-600" />
              </div>
              AI 实时直连无需等待
            </div>
            <div className="flex items-center justify-center text-slate-500 text-sm font-medium">
              <div className="bg-purple-100 p-1.5 rounded-full mr-2">
                <Building className="w-4 h-4 text-purple-600" />
              </div>
              仅限源头工厂加入
            </div>
        </div>

      </div>
    </div>
  );
};