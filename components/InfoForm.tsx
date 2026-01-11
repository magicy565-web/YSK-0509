
import React, { useState } from 'react';
import { Briefcase, User, Phone, Package, Globe, Upload, FileText, Sparkles } from 'lucide-react';
import { InfoFormData } from '../types'; // Use the global type

interface InfoFormProps {
  onSubmit: (data: InfoFormData) => void;
}

export const InfoForm: React.FC<InfoFormProps> = ({ onSubmit }) => {
  // The form now manages more fields than the InfoFormData requires for the API call.
  // This is fine, as we will construct the correct object on submit.
  const [formState, setFormState] = useState({
    companyName: '',
    contactPerson: '',
    contactPhone: '',
    productName: '',
    targetCountry: 'USA',
    productBrochure: null as File | null,
    productImages: null as FileList | null,
    auxiliaryFiles: null as FileList | null,
    analysisType: 'database' as 'database' | 'ai', // Add analysisType to state
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files) {
      if (e.target.multiple) {
        setFormState(prev => ({ ...prev, [name]: files }));
      } else {
        setFormState(prev => ({ ...prev, [name]: files[0] }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pass only the data needed by the global InfoFormData type
    onSubmit({
      productName: formState.productName,
      targetCountry: formState.targetCountry,
      analysisType: formState.analysisType,
    });
  };

  const countries = ["USA", "Canada", "Mexico", "UK", "Germany", "France", "Japan", "Australia"];

  return (
    <div className="max-w-3xl mx-auto py-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">第一步：提供基础信息</h2>
      <p className="text-slate-500 mb-6">提供您的产品和服务信息，开启海外商业智能分析。</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center"><Package className="w-5 h-5 mr-2 text-indigo-600"/>核心产品信息</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">产品名称</label>
              <input type="text" name="productName" value={formState.productName} onChange={handleChange} className="w-full p-2 mt-1 border rounded-md" required placeholder="例如：Lithium-ion Battery" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">目标市场（国家）</label>
              <select name="targetCountry" value={formState.targetCountry} onChange={handleChange} className="w-full p-2 mt-1 border rounded-md">
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* --- NEW: Analysis Mode Selection --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-indigo-600"/>分析模式选择
          </h3>
          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setFormState(prev => ({ ...prev, analysisType: 'database' }))}
              className={`flex-1 text-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                formState.analysisType === 'database' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-200'
              }`}
            >
              精准匹配
            </button>
            <button
              type="button"
              onClick={() => setFormState(prev => ({ ...prev, analysisType: 'ai' }))}
              className={`flex-1 text-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                formState.analysisType === 'ai' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-200'
              }`}
            >
              AI 探索
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-3 text-center px-2">
            {formState.analysisType === 'database'
              ? '访问我们已验证的采购商数据库，为您精准匹配最可靠的买家。'
              : '利用 AI 分析全球市场，为您探索新兴的利基市场和潜在买家机会。'}
          </p>
        </div>
        {/* --- END OF NEW SECTION --- */}

        <div className="flex justify-end pt-4">
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-indigo-500/50 transition-all text-base">
            生成分析报告
          </button>
        </div>
      </form>
    </div>
  );
};
