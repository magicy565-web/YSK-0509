import React from 'react';
import { FiCheckCircle, FiDownload } from 'react-icons/fi';

export const SuccessState: React.FC = () => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-12 max-w-2xl mx-auto text-center animate-fade-in-up">
      <FiCheckCircle className="text-emerald-500 text-6xl mx-auto mb-6" />
      <h2 className="text-3xl font-bold text-slate-800 mb-3">委托提交成功！</h2>
      <p className="text-slate-600 mb-8">我们的客户成功团队将在24小时内与您联系，启动客户开发流程。</p>

      <div className="bg-slate-50 rounded-lg p-6 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="flex-shrink-0">
          {/* --- QR CODE PLACEHOLDER --- */}
          <div className="w-32 h-32 bg-slate-200 rounded-md flex items-center justify-center">
            <span className="text-sm text-slate-500">[微信二维码]</span>
          </div>
          {/* --- END OF PLACEHOLDER --- */}
        </div>
        <div className="text-left">
          <h4 className="font-semibold text-slate-700">添加您的专属客服</h4>
          <p className="text-sm text-slate-500 mt-1">扫描左侧二维码，添加您的专属外贸增长顾问，我们将为您提供一对一服务，并邀请您加入项目专属沟通群。</p>
        </div>
      </div>

      <div className="mt-10">
        <button 
          onClick={() => window.location.reload()} 
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg">
          开启新的分析
        </button>
      </div>
    </div>
  );
};
