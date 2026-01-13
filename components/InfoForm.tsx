
import React, { useState } from 'react';
import { InfoFormData } from '../types';
import { ArrowRight, FileText, Globe, Target } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-lg border border-slate-100">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">提供您的产品信息</h1>
        <p className="text-slate-500 mt-2">只需30秒，系统将基于海关数据为您评估全球潜在买家。</p>
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
            placeholder="例如：锂离子电池" // TEXT FIX: Changed to full Chinese
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
            placeholder="简单描述您的产品独特卖点，例如：\n- 能量密度比市场平均水平高20%\n- 独特的安全阀设计，通过了UL认证\n- 循环寿命达到5000次以上"
            rows={4}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="targetMarket" className="text-sm font-semibold text-slate-700 flex items-center">
            <Globe className="w-4 h-4 mr-2 text-slate-400" />
            目标市场 (可选)
          </label>
          <select
            id="targetMarket"
            name="targetMarket"
            value={formData.targetMarket}
            onChange={handleChange}
            className="w-full p-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 transition"
          >
            <option>北美</option>
            <option>欧洲</option>
            <option>东南亚</option>
            <option>南美</option>
            <option>中东</option>
            <option>全球</option>
          </select>
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
    </div>
  );
};
