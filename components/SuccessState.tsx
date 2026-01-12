
import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';

const base64QrCode = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

export const SuccessState = () => {
  return (
    <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-xl shadow-lg border border-gray-200 text-center">
      
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
      
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        申请已提交，正在为您匹配买家...
      </h1>
      
      <p className="text-gray-600 mb-6">
        我们已收到您的资质申请，初步审核将在24小时内完成。
      </p>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-8 text-left">
        <h2 className="font-bold text-yellow-800">加速您的审核进程！</h2>
        <p className="text-sm text-yellow-700 mt-1">
          为了确保我们能快速核实您的工厂资质并优先为您对接买家，请<strong className="font-semibold">务必添加下方审核专员的企业微信</strong>，并发送您的名片。
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6">
        {/* QR Code Section */}
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <img 
            // BUG FIX: Replaced file path with a valid Base64 Data URL.
            src={base64QrCode} 
            alt="审核专员企业微信二维码"
            className="w-48 h-48 mx-auto"
          />
        </div>

        {/* Instructions Section */}
        <div className="text-left">
          <p className="text-lg font-semibold text-gray-800">扫码添加专员</p>
          <p className="text-gray-600 mt-1">备注您的 <strong className="text-blue-600">【工厂名】</strong></p>
          <div className="mt-4 text-sm text-gray-500 bg-gray-100 p-3 rounded-md">
            <p className="flex items-center"><ArrowRight className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> 优先安排资质审核</p>
            <p className="flex items-center mt-1"><ArrowRight className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> 优先获得买家推荐</p>
            <p className="flex items-center mt-1"><ArrowRight className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> 获取一对一操作指导</p>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-gray-400 mt-8">
        如果您未在24小时内收到好友请求，请联系我们的客服 support@export-autopilot.com
      </p>
    </div>
  );
};
