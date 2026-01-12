
import React, { useState } from 'react';
import { DealData, ProductQuotation, FactoryQualification } from '../types';
import { UploadCloud, PlusCircle, Trash2, Check, AlertTriangle, Briefcase, DollarSign, Globe, Award, Factory } from 'lucide-react';

interface Props {
  data: DealData;
  onApprove: (finalDealData: DealData) => void;
}

// Helper to create an empty product row.
const createEmptyProduct = (): ProductQuotation => ({
  id: Date.now(),
  productName: '',
  model: '',
  unit: 'pcs',
  exwPrice: '',
  moq: '',
  leadTime: '',
});

export const StateDeal: React.FC<Props> = ({ data, onApprove }) => {
  const [factoryInfo, setFactoryInfo] = useState<FactoryQualification>(data.factoryInfo);
  const [quotation, setQuotation] = useState<ProductQuotation[]>(data.quotation.length > 0 ? data.quotation : [createEmptyProduct()]);

  const handleFactoryInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFactoryInfo(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFactoryInfo(prev => ({ ...prev, certificates: files }));
    }
  };

  const handleQuotationChange = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedQuotation = quotation.map(item => 
        item.id === id ? { ...item, [name]: value } : item
    );
    setQuotation(updatedQuotation);
  };

  const addProduct = () => {
    setQuotation(prev => [...prev, createEmptyProduct()]);
  };

  const removeProduct = (id: number) => {
    if (quotation.length > 1) {
      setQuotation(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleSubmit = () => {
    onApprove({ factoryInfo, quotation });
  };

  return (
    <div className="max-w-5xl mx-auto py-8 animate-fade-in-up">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900">供应商资质审核</h2>
        <p className="text-slate-500 mt-2 text-lg">为确保买家获得高质量的对接服务，我们需要对供应商进行简单的资质审核。请提供以下信息。</p>
      </div>

      {/* Main form grid */}
      <div className="space-y-12">
        {/* Section 1: Basic Info */}
        <div className="border-b border-slate-200 pb-12">
          <h3 className="text-xl font-semibold text-slate-800 flex items-center mb-6"><Factory className="w-6 h-6 mr-3 text-slate-500" /> 公司基本信息</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" name="companyName" placeholder="公司名称" value={factoryInfo.companyName} onChange={handleFactoryInfoChange} className="p-3 border rounded-md" />
            <input type="text" name="website" placeholder="官方网站 (例如 https://yourcompany.com)" value={factoryInfo.website} onChange={handleFactoryInfoChange} className="p-3 border rounded-md" />
            <input type="text" name="contactPerson" placeholder="联系人" value={factoryInfo.contactPerson} onChange={handleFactoryInfoChange} className="p-3 border rounded-md" />
          </div>
        </div>

        {/* Section 2: Strength & Qualification */}
        <div className="border-b border-slate-200 pb-12">
          <h3 className="text-xl font-semibold text-slate-800 flex items-center mb-6"><Award className="w-6 h-6 mr-3 text-slate-500"/> 实力与资质</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">年出口额 (美元)</label>
                <input type="text" name="annualExportValue" placeholder="例如, 5,000,000" value={factoryInfo.annualExportValue} onChange={handleFactoryInfoChange} className="p-3 w-full border rounded-md" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">核心产品优势</label>
                <input type="text" name="mainProductAdvantage" placeholder="例如, 专利设计, 更优的材料..." value={factoryInfo.mainProductAdvantage} onChange={handleFactoryInfoChange} className="p-3 w-full border rounded-md" />
            </div>
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">上传资质文件 (例如 ISO, CE, 营业执照)</label>
                <div className="mt-2 flex justify-center items-center w-full h-32 px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                        <div className="flex text-sm text-slate-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none">
                                <span>上传文件</span>
                                <input id="file-upload" name="certificates" type="file" multiple className="sr-only" onChange={handleFileChange} />
                            </label>
                            <p className="pl-1">或拖拽到此处</p>
                        </div>
                        <p className="text-xs text-slate-500">支持 PNG, JPG, PDF, 单个文件最大10MB</p>
                        {factoryInfo.certificates && factoryInfo.certificates.length > 0 && <p className='text-xs text-emerald-600 pt-1'>{factoryInfo.certificates.length} 个文件已选择。</p>}
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Section 3: Quotation */}
        <div className="border-b border-slate-200 pb-12">
            <h3 className="text-xl font-semibold text-slate-800 flex items-center mb-6"><DollarSign className="w-6 h-6 mr-3 text-slate-500"/> 产品报价</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                    <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase">产品名</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase">型号</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase">最小订单量(MOQ)</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase">出厂价(EXW USD)</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase">交货期</th>
                        <th className="w-12"></th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                    {quotation.map((item) => (
                        <tr key={item.id}>
                            <td><input type="text" name="productName" value={item.productName} onChange={(e) => handleQuotationChange(item.id, e)} className="w-full p-2 border rounded-md" /></td>
                            <td><input type="text" name="model" value={item.model} onChange={(e) => handleQuotationChange(item.id, e)} className="w-full p-2 border rounded-md" /></td>
                            <td><input type="number" name="moq" value={item.moq} onChange={(e) => handleQuotationChange(item.id, e)} className="w-24 p-2 border rounded-md" /></td>
                            <td><input type="number" name="exwPrice" value={item.exwPrice} onChange={(e) => handleQuotationChange(item.id, e)} className="w-28 p-2 border rounded-md" /></td>
                            <td><input type="text" name="leadTime" placeholder="例如, 15 天" onChange={(e) => handleQuotationChange(item.id, e)} className="w-28 p-2 border rounded-md" /></td>
                            <td>
                                <button onClick={() => removeProduct(item.id)} className="text-slate-400 hover:text-red-500 disabled:opacity-50" disabled={quotation.length <= 1}>
                                    <Trash2 className="w-4 h-4"/>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <button onClick={addProduct} className="mt-4 flex items-center text-sm text-emerald-600 hover:text-emerald-800">
                <PlusCircle className="mr-2 w-4 h-4" /> 添加产品
            </button>
        </div>

        {/* Section 4: Commitment & Submission */}
        <div>
            <div className="flex items-start mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-semibold text-yellow-800">最后一步：确认承诺</h4>
                    <div className="flex items-start mt-2">
                        <input id="hasCommitment" name="hasCommitment" type="checkbox" checked={factoryInfo.hasCommitment} onChange={handleFactoryInfoChange} className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 mt-1" />
                        <label htmlFor="hasCommitment" className="ml-3 block text-sm text-yellow-700">
                            我在此承诺，所提供的所有信息均真实有效，并授权平台将这些信息独家用于买家匹配目的。
                        </label>
                    </div>
                </div>
            </div>
            
            <div className="text-center">
                <button
                    onClick={handleSubmit}
                    disabled={!factoryInfo.hasCommitment}
                    className="w-full md:w-auto bg-emerald-600 text-white font-bold py-4 px-12 rounded-lg shadow-lg transition-all flex items-center justify-center mx-auto disabled:bg-slate-400 disabled:cursor-not-allowed disabled:shadow-none hover:bg-emerald-700"
                >
                    <Check className="w-5 h-5 mr-2" />
                    提交资质审核，获取免费买家匹配
                </button>
                <p className="text-xs text-slate-500 mt-3">我们的团队将在 2 个工作日内审核您的申请。</p>
            </div>
        </div>
      </div>
    </div>
  );
};
