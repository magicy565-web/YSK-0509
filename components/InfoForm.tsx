
import React, { useState, useEffect } from 'react';
import { InfoFormData } from '../types';
import { ArrowRight, FileText, Globe, Target, ShieldCheck, Zap, Building, Search } from 'lucide-react';

// --- TASK 7: Typewriter Effect Component ---
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
      if (isDeleting) {
        currentText = currentPhrase.substring(0, charIndex--);
      } else {
        currentText = currentPhrase.substring(0, charIndex++);
      }
      setText(currentText);

      let typeSpeed = isDeleting ? 50 : 100;

      if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at the end
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        setPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
        typeSpeed = 500; // Pause before typing new phrase
      }

      timeoutId = setTimeout(type, typeSpeed);
    };

    type();

    return () => clearTimeout(timeoutId);
  }, [phraseIndex]);

  return (
    <div className="h-8 text-center text-sm text-slate-500 bg-slate-100 rounded-full px-4 py-1 flex items-center justify-center">
      <span>{text}</span>
      <span className="animate-pulse">|</span>
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-lg border border-slate-100">
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">输入产品，免费获取全球精准采购商名单</h1>
        <p className="text-slate-500 mt-3">
          已有 <span className="font-bold text-emerald-600">15,402</span> 家源头工厂通过平台成功对接订单 | 每日更新海关数据
        </p>
      </div>
      
      {/* --- TASK 7: Live Search Ticker --- */}
      <div className="mb-6 flex justify-center">
        <Typewriter />
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="productName" className="text-sm font-semibold text-slate-700 flex items-center">
            <FileText className="w-4 h-4 mr-2 text-slate-400" />
            产品名称
          </label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 transition"
            placeholder="请输入您的核心产品关键词，例如：锂电池、数控机床"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="productDetails" className="text-sm font-semibold text-slate-700 flex items-center">
            <Target className="w-4 h-4 mr-2 text-slate-400" />
            产品核心优势
          </label>
          <textarea
            id="productDetails"
            name="productDetails"
            value={formData.productDetails}
            onChange={handleChange}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 transition"
            placeholder="简单描述您的优势（如：自有模具、通过UL认证、支持OEM），信息越全，匹配的买家越精准！"
            rows={3}
            required
          />
        </div>

        <div className="pt-4">
          <button 
            type="submit"
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center justify-center"
          >
            立即启动全球匹配
            <ArrowRight className="w-5 h-5 ml-3" />
          </button>
        </div>
      </form>

      {/* --- TASK 7: Trust Badges --- */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center text-xs text-slate-500">
          <div className="flex items-center justify-center"><ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-600" />企业数据隐私保护</div>
          <div className="flex items-center justify-center"><Zap className="w-4 h-4 mr-1.5 text-emerald-600"/>AI 实时直连无需等待</div>
          <div className="flex items-center justify-center"><Building className="w-4 h-4 mr-1.5 text-emerald-600"/>仅限源头工厂加入</div>
      </div>
    </div>
  );
};
