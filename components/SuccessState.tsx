import React from 'react';
import { CheckCircle } from 'lucide-react';

export const SuccessState: React.FC = () => {
  // A real QR code for a more polished and professional feel.
  const qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Thank%20you%20for%20your%20business!";

  return (
    <div className="bg-white shadow-lg rounded-lg p-12 max-w-2xl mx-auto text-center animate-fade-in-up">
      <CheckCircle className="text-emerald-500 w-16 h-16 mx-auto mb-6" />
      <h2 className="text-3xl font-bold text-slate-800 mb-3">委托提交成功！</h2>
      <p className="text-slate-600 mb-8">我们的客户成功团队将在24小时内与您联系，启动客户开发流程。</p>

      <div className="bg-slate-50 rounded-lg p-6 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="flex-shrink-0">
          <img src={qrCodeUrl} alt="客户服务二维码" className="w-32 h-32 rounded-md" />
        </div>
        <div className="text-left">
          <h4 className="font-semibold text-slate-700">添加您的专属客服</h4>
          <p className="text-sm text-slate-500 mt-1">扫描左侧二维码，添加您的专属外贸增长顾问，我们将为您提供一对一服务，并邀请您加入项目专属沟通群。</p>
        </div>
      </div>

      <div className="mt-10">
        <button 
          onClick={() => window.location.reload()} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg">
          开启新的分析
        </button>
      </div>
    </div>
  );
};
