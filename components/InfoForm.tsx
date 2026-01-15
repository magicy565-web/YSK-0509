import React, { useState } from 'react';
import { InfoFormData, InfoFormProps } from '../src/types';
import { motion } from 'framer-motion';
import { ArrowRight, Info } from 'lucide-react';

const inputStyle = "w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300";
const labelStyle = "block text-sm font-medium text-gray-400 mb-2";
const tooltipStyle = "absolute left-full ml-4 w-64 bg-gray-900 text-white text-sm rounded-lg p-3 border border-gray-700 shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300";

const FormInput = ({ id, label, type = 'text', value, onChange, placeholder, tooltip }) => (
  <div className="relative group">
    <label htmlFor={id} className={labelStyle}>{label}</label>
    <div className="flex items-center">
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputStyle}
        required
      />
      <span className="ml-3 text-gray-500"><Info size={18} /></span>
    </div>
    <div className={tooltipStyle}>{tooltip}</div>
  </div>
);

export const InfoForm: React.FC<InfoFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<InfoFormData>({
    productName: '',
    productDetails: '',
    targetMarket: 'North America',
    companyName: '',
    contactPerson: '',
    contactPhone: ''
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-8 bg-gray-900 rounded-2xl shadow-2xl border border-gray-700/50"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">开启您的全球商机</h1>
          <p className="text-lg text-gray-400">只需1分钟，AI将为您分析全球潜在买家</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-white border-b border-gray-600 pb-3">核心产品信息</h3>
            <FormInput id="productName" label="您的核心产品/服务" value={formData.productName} onChange={handleChange} placeholder="例如：太阳能电池板、工业机器人" tooltip="这是AI分析的起点。请使用行业标准术语，以便我们能精准匹配您的潜在买家。" />
            <div>
                <label htmlFor="productDetails" className={labelStyle}>产品核心优势与特点</label>
                <textarea id="productDetails" name="productDetails" value={formData.productDetails} onChange={handleChange} placeholder="例如：转化率高、寿命长达25年、通过TÜV认证..." rows={4} className={inputStyle} required />
            </div>
            <div className="relative group">
                <label htmlFor="targetMarket" className={labelStyle}>意向出口市场</label>
                <select id="targetMarket" name="targetMarket" value={formData.targetMarket} onChange={handleChange} className={inputStyle}>
                    <option>North America</option>
                    <option>Europe</option>
                    <option>Asia</option>
                    <option>South America</option>
                    <option>Africa</option>
                    <option>Oceania</option>
                    <option>Global</option>
                </select>
                <div className={tooltipStyle}>选择您最感兴趣的市场，AI将重点分析该区域的买家。选择“Global”则进行全球扫描。</div>
            </div>
          </div>

          <div className="space-y-6 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-white border-b border-gray-600 pb-3">企业基本信息</h3>
            <FormInput id="companyName" label="公司名称" value={formData.companyName} onChange={handleChange} placeholder="请输入您的公司全称" tooltip="用于生成合作方案和最终的CRM记录，请确保准确。"/>
            <FormInput id="contactPerson" label="联系人" value={formData.contactPerson} onChange={handleChange} placeholder="您的姓名" tooltip="我们将通过此信息与您联系，讨论AI分析结果。" />
            <FormInput id="contactPhone" label="联系电话" type="tel" value={formData.contactPhone} onChange={handleChange} placeholder="您的手机或座机号码" tooltip="紧急沟通或快速确认合作意向时使用。"/>
          </div>
        </div>

        <div className="pt-6 text-center">
            <button type="submit" className="w-full max-w-md mx-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50 flex items-center justify-center space-x-2">
                <span>开启全球扫描</span>
                <ArrowRight size={22} />
            </button>
            <p className="text-xs text-gray-500 mt-4">点击提交，即表示您同意我们的服务条款和隐私政策</p>
        </div>
      </form>
    </motion.div>
  );
};