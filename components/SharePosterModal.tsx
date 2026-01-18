import React, { useRef, useState } from 'react';
import { X, Download, Loader2, Briefcase, Globe, TrendingUp, ShieldCheck } from 'lucide-react';
import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';

// 您的网站地址
const SITE_URL = "https://cnsubscribe.xyz/";

interface SharePosterModalProps {
  onClose: () => void;
}

export const SharePosterModal: React.FC<SharePosterModalProps> = ({ onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    
    try {
      // 1. 等待图片加载（如果有外部图片）
      await new Promise(resolve => setTimeout(resolve, 500)); 

      // 2. 将 DOM 转换为 Canvas
      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        scale: 2, // 2倍清晰度，保证手机上看清晰
        backgroundColor: '#0f172a', // 确保背景色正确 (Slate-900)
      });

      // 3. 触发下载
      const link = document.createElement('a');
      link.download = '出海严选-分享卡片.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("生成海报失败:", err);
      alert("海报生成失败，请截屏保存");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      
      {/* 这里的 div 是实际显示给用户看的操作区 */}
      <div className="relative bg-slate-800 rounded-2xl shadow-2xl max-w-xl w-full flex flex-col items-center overflow-hidden border border-slate-700">
        
        {/* 顶部标题栏 */}
        <div className="w-full flex justify-between items-center p-4 border-b border-slate-700">
          <h3 className="text-white font-bold">分享专属海报</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* --- 核心：这里是即将被截图的卡片区域 --- */}
        <div className="p-6 bg-slate-900 w-full flex justify-center overflow-auto max-h-[70vh]">
          <div 
            ref={cardRef} 
            className="relative w-[375px] h-[550px] bg-slate-900 text-white overflow-hidden flex flex-col border border-slate-800 shadow-2xl shrink-0"
            // id="share-card-node" 
          >
             {/* 装饰背景 */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
             <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
             {/* Logo */}
             <div className="relative z-10 px-6 pt-8 flex items-center space-x-2">
                <div className="bg-emerald-500 p-1.5 rounded-lg">
                  <Briefcase className="h-5 w-5 text-slate-900" />
                </div>
                <span className="font-bold text-lg text-emerald-50">出海严选</span>
             </div>

             {/* 主标题 */}
             <div className="relative z-10 px-6 mt-8">
               <h1 className="text-4xl font-extrabold leading-tight mb-2">
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                   链接全球<br/>TOP 采购商
                 </span>
               </h1>
               <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                 AI 驱动的 B2B 询盘匹配系统。<br/>拒绝盲目开发，直连真实需求。
               </p>
             </div>

             {/* 数据栏 */}
             <div className="relative z-10 mx-6 mt-8 p-4 bg-slate-800/60 backdrop-blur rounded-xl border border-slate-700 grid grid-cols-3 gap-2">
                <div className="text-center">
                    <div className="text-xs text-slate-400 mb-1">覆盖国家</div>
                    <div className="font-bold text-white">120+</div>
                </div>
                <div className="text-center border-l border-slate-700">
                    <div className="text-xs text-slate-400 mb-1">实名买家</div>
                    <div className="font-bold text-white">3.5k+</div>
                </div>
                <div className="text-center border-l border-slate-700">
                    <div className="text-xs text-slate-400 mb-1">撮合效率</div>
                    <div className="font-bold text-emerald-400">98%</div>
                </div>
             </div>

             {/* 底部：二维码区域 */}
             <div className="mt-auto bg-white p-6 flex items-center justify-between relative z-10">
                <div className="text-slate-900">
                    <p className="font-bold text-lg">长按识别二维码</p>
                    <p className="text-xs text-slate-500 mt-1">立即免费获取买家线索</p>
                </div>
                {/* 动态生成的二维码 */}
                <div className="bg-white p-1 rounded">
                    <QRCodeSVG 
                        value={SITE_URL} 
                        size={80} 
                        level="H"
                        fgColor="#0f172a"
                    />
                </div>
             </div>
          </div>
        </div>

        {/* 底部按钮栏 */}
        <div className="w-full p-4 border-t border-slate-700 bg-slate-800 flex flex-col gap-2">
           <button 
             onClick={handleDownload}
             disabled={isGenerating}
             className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
           >
             {isGenerating ? (
               <><Loader2 className="w-5 h-5 mr-2 animate-spin"/> 生成中...</>
             ) : (
               <><Download className="w-5 h-5 mr-2"/> 保存图片到相册</>
             )}
           </button>
           <p className="text-xs text-slate-500 text-center">
             保存后可发送给好友或分享至朋友圈
           </p>
        </div>

      </div>
    </div>
  );
};
