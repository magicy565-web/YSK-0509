import React, { useState } from 'react';
import { DealData, ProductQuotation, QuotationItem } from '../types';
import { FiPlusCircle, FiTrash2 } from 'react-icons/fi';
import { ExcelUploader } from './ExcelUploader';

interface Props {
  data: DealData;
  onApprove: (finalDealData: DealData) => void;
}

export const StateDeal: React.FC<Props> = ({ data, onApprove }) => {
  const [dealData, setDealData] = useState<DealData>(data);

  const handleClientInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDealData(prev => ({ ...prev, clientInfo: { ...prev.clientInfo, [name]: value } }));
  };

  const handleQuotationChange = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedQuotation = dealData.quotation.map(item =>
      item.id === id ? { ...item, [name]: value } : item
    );
    setDealData(prev => ({ ...prev, quotation: updatedQuotation }));
  };

  const createEmptyProduct = (): ProductQuotation => ({
    id: Date.now(),
    productName: '',
    model: '',
    unit: 'pcs',
    exwPrice: '',
    moq: '',
  });

  const addProduct = () => {
    const newProduct = createEmptyProduct();
    setDealData(prev => ({ ...prev, quotation: [...prev.quotation, newProduct] }));
  };

  const removeProduct = (id: number) => {
    const updatedQuotation = dealData.quotation.filter(item => item.id !== id);
    if (updatedQuotation.length === 0) {
      setDealData(prev => ({ ...prev, quotation: [createEmptyProduct()] }));
    } else {
      setDealData(prev => ({ ...prev, quotation: updatedQuotation }));
    }
  };

  const handleDataExtracted = (extractedData: QuotationItem[]) => {
    if (extractedData.length > 0) {
      setDealData(prev => ({ ...prev, quotation: extractedData }));
    } else {
      setDealData(prev => ({ ...prev, quotation: [createEmptyProduct()] }));
    }
  };
  
  const handleClearQuotation = () => {
      setDealData(prev => ({ ...prev, quotation: [createEmptyProduct()] }));
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-5xl mx-auto animate-fade-in-up">
      <h2 className="text-2xl font-bold mb-2 text-slate-800">第四步：委托我们为您开发客户</h2>
      <p className="text-slate-600 mb-8">请填写您的公司信息和产品报价单，我们的专家团队将利用AI分析结果为您精准对接海外采购商。</p>

      {/* Client Information Section */}
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">1. 您的联系方式</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input type="text" name="companyName" placeholder="公司名称" value={dealData.clientInfo.companyName} onChange={handleClientInfoChange} className="p-2 border rounded-md" />
          <input type="text" name="contactPerson" placeholder="联系人" value={dealData.clientInfo.contactPerson} onChange={handleClientInfoChange} className="p-2 border rounded-md" />
          <input type="email" name="email" placeholder="邮箱" value={dealData.clientInfo.email} onChange={handleClientInfoChange} className="p-2 border rounded-md" />
          <input type="tel" name="phone" placeholder="电话" value={dealData.clientInfo.phone} onChange={handleClientInfoChange} className="p-2 border rounded-md" />
        </div>
      </div>

      {/* Quotation Section */}
      <div>
        <h3 className="text-lg font-semibold text-slate-700 mb-4">2. 产品报价单 (EXW)</h3>
        
        <div className='mb-6'>
            <p className='text-sm text-slate-600 mb-2'>您可以手动填写下表，或者 <span className='font-semibold'>从Excel文件批量导入</span>：</p>
            <ExcelUploader 
                onDataExtracted={handleDataExtracted} 
                onClear={handleClearQuotation}
            />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">产品名称</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">型号/规格</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">单位</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">EXW单价 (USD)</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">最小订单量</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {dealData.quotation.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2"><input type="text" name="productName" value={item.productName} onChange={(e) => handleQuotationChange(item.id, e)} className="w-full p-1 border rounded-md" /></td>
                  <td className="px-4 py-2"><input type="text" name="model" value={item.model} onChange={(e) => handleQuotationChange(item.id, e)} className="w-full p-1 border rounded-md" /></td>
                  <td className="px-4 py-2"><input type="text" name="unit" value={item.unit} onChange={(e) => handleQuotationChange(item.id, e)} className="w-20 p-1 border rounded-md" /></td>
                  <td className="px-4 py-2"><input type="text" name="exwPrice" value={item.exwPrice} onChange={(e) => handleQuotationChange(item.id, e)} className="w-28 p-1 border rounded-md" /></td>
                  <td className="px-4 py-2"><input type="text" name="moq" value={item.moq} onChange={(e) => handleQuotationChange(item.id, e)} className="w-24 p-1 border rounded-md" /></td>
                  <td className="px-4 py-2 text-center">
                    <button onClick={() => removeProduct(item.id)} className="text-slate-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed" disabled={dealData.quotation.length <= 1}>
                        <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={addProduct} className="mt-4 flex items-center text-sm text-emerald-600 hover:text-emerald-800">
          <FiPlusCircle className="mr-2" /> 添加新产品（手动）
        </button>
      </div>

      {/* Approval Button */}
      <div className="mt-10 flex justify-end border-t border-slate-200 pt-6">
        <button
          onClick={() => onApprove(dealData)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg">
          确认委托，立即对接
        </button>
      </div>
    </div>
  );
};
