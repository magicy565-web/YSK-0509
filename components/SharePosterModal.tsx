import React, { useRef, useState, useEffect } from 'react';
import { X, Download, Loader2, Award, CheckCircle2, Trophy, ArrowRight, Handshake } from 'lucide-react';
import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';

// 您的网站地址
const SITE_URL = "https://cnsubscribe.xyz/";

// 专家照片路径
const EXPERT_IMAGE_URL = "/expert-photo.png";

interface SharePosterModalProps {
  onClose: () => void;
}

export const SharePosterModal: React.FC<SharePosterModalProps> = ({ onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = EXPERT_IMAGE_URL;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => {
        console.error("专家图片加载失败，请检查 URL");
        setImageLoaded(true); 
    }
  }, []);

  const handleDownload = async () => {
    if (!cardRef.current || !imageLoaded) return;
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); 

      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        scale: 3, 
        backgroundColor: '#0f172a',
        logging: false,
      });

      const link = document.createElement('a');
      link.download = '出海严选-订单撮合海报.png';
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (err) {
      console.error("生成海报失败:", err);
      alert("海报生成遇到问题，请尝试直接截屏保存。");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
      
      <div className="relative bg-slate-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-md w-full flex flex-col items-center overflow-hidden border border-slate-700/50 my-auto">
        
        <div className="w-full flex justify-between items-center p-4 border-b border-slate-700/50 bg-slate-800/80">
          <h3 className="text-white font-bold pl-2">生成专家分享海报</h3>
          <button onClick={onClose} className="p-1 bg-slate-700 rounded-full text-slate-300 hover:text-white hover:bg-slate-600 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= 核心：海报绘制区域 ================= */}
        <div className="p-4 bg-slate-900/50 w-full flex justify-center">
          <div 
            ref={cardRef} 
            className="relative w-[375px] h-[600px] bg-slate-900 overflow-hidden flex flex-col shadow-2xl shrink-0 rounded-[20px] border-[4px] border-slate-800/80 box-border font-sans"
          >
             {/* --- 1. 背景氛围层 --- */}
             <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-no-repeat bg-center bg-cover mix-blend-overlay pointer-events-none"></div>
             <div className="absolute top-[-10%] left-[-20%] w-[80%] h-[40%] bg-emerald-500/20 rounded-full blur-[80px] mix-blend-screen pointer-events-none"></div>
             <div className="absolute bottom-[-10%] right-[-20%] w-[80%] h-[50%] bg-blue-600/20 rounded-full blur-[80px] mix-blend-screen pointer-events-none"></div>
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 mix-blend-soft-light pointer-events-none"></div>

             {/* --- 2. 内容主体层 --- */}
             <div className="relative z-20 flex-grow flex flex-col">
                 {/* Logo Header */}
                 <div className="px-6 pt-7 flex items-center justify-between">
                    <div className="flex items-center">
                        <img 
                          src="/logo.png" 
                          alt="鸿亿鸿" 
                          className="h-10 w-auto object-contain drop-shadow-md"
                          crossOrigin="anonymous"
                        />
                    </div>
                    <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                        <Handshake className="w-3 h-3 text-yellow-400" />
                        <span className="text-[10px] font-medium text-yellow-100">官方推荐</span>
                    </div>
                 </div>

                 {/* 主标题区 */}
                 <div className="px-6 mt-8 relative z-20 max-w-[72%]">
                   {/* 标签 */}
                   <h2 className="text-emerald-400 font-medium tracking-wider text-sm mb-2 flex items-center">
                     <span className="inline-block w-8 h-[2px] bg-emerald-400 mr-2"></span>
                     不玩虚的 · 效果付费
                   </h2>
                   
                   <h1 className="text-[32px] font-extrabold leading-[1.15] text-white mb-3 drop-shadow-lg">
                     为您精准撮合<br/>
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-400">
                       海外真实订单
                     </span>
                   </h1>
                   
                   {/* 描述 */}
                   <div className="text-slate-300 text-xs leading-relaxed border-l-2 border-slate-600 pl-3 space-y-1">
                     <p>订单经过海外人工核实，确保真实</p>
                     <p>不做虚假承诺，只给靠谱投产比</p>
                   </div>
                 </div>

                 {/* --- 专家形象与文案层 --- */}
                 <div className="absolute right-[-25px] top-[130px] w-[260px] h-[340px] z-10 flex items-end justify-end pointer-events-none">
                    
                    {/* 专家文案标签 */}
                    <div className="absolute left-[15px] bottom-[75px] z-20 animate-fade-in-up w-[200px]">
                        
                        {/* 主标签 */}
                        <div className="bg-slate-900/90 backdrop-blur-md border border-emerald-500/30 text-white px-3 py-2 rounded-lg shadow-xl flex items-center mb-2 transform -rotate-1 hover:rotate-0 transition-transform origin-bottom-left">
                            <div className="bg-emerald-500 rounded-full p-1 mr-2 flex-shrink-0">
                                <CheckCircle2 className="w-3 h-3 text-slate-900" />
                            </div>
                            <div>
                                <div className="text-[9px] text-emerald-400 font-bold leading-none mb-0.5">Magic Yang</div>
                                <div className="text-xs font-bold whitespace-nowrap">跨境出海 8 年实战专家</div>
                            </div>
                        </div>

                        {/* 副标签 */}
                        <div className="bg-slate-800/80 backdrop-blur-md border border-yellow-500/30 text-white px-2.5 py-1.5 rounded-lg shadow-lg flex items-start transform rotate-1 hover:rotate-0 transition-transform origin-top-left ml-4">
                             <div className="bg-yellow-500/20 rounded-full p-0.5 mr-1.5 mt-0.5 flex-shrink-0">
                                <Trophy className="w-2.5 h-2.5 text-yellow-400" />
                            </div>
                            <div className="text-[10px] leading-tight text-slate-200">
                                单品类 <span className="text-yellow-400 font-bold">半年</span><br/>
                                <span className="text-yellow-400 font-bold">$3000万</span> 业绩
                            </div>
                        </div>

                    </div>

                    {/* 专家照片 */}
                    <img 
                        src={EXPERT_IMAGE_URL}
                        alt="Magic Yang" 
                        className={`w-full h-full object-cover object-top transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        style={{
                            maskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)'
                        }}
                    />
                 </div>

                 {/* 数据卡片区 */}
                 <div className="relative z-20 mx-5 mt-auto mb-4 grid grid-cols-3 gap-2.5 pt-4">
                    <div className="bg-slate-800/60 backdrop-blur-md rounded-xl p-3 border border-slate-700/50 text-center shadow-lg">
                        <div className="text-lg font-bold text-white leading-none mb-1">120+</div>
                        <div className="text-[9px] text-slate-400">覆盖国家</div>
                    </div>
                     <div className="bg-slate-800/60 backdrop-blur-md rounded-xl p-3 border border-slate-700/50 text-center shadow-lg">
                        <div className="text-lg font-bold text-white leading-none mb-1">3.5k+</div>
                        <div className="text-[9px] text-slate-400">实名买家</div>
                    </div>
                     <div className="bg-slate-800/60 backdrop-blur-md rounded-xl p-3 border border-slate-700/50 text-center shadow-lg">
                        <div className="text-lg font-bold text-emerald-400 leading-none mb-1">98%</div>
                        <div className="text-[9px] text-slate-400">撮合效率</div>
                    </div>
                 </div>
             </div>

             {/* --- 3. 底部二维码层 --- */}
             <div className="relative z-30 mt-auto bg-white p-5 flex items-center justify-between">
                 {/* 波浪分割线 */}
                 <div className="absolute top-[-28px] left-0 w-full overflow-hidden leading-[0] rotate-180">
                     <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[30px]">
                         <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#ffffff"></path>
                     </svg>
                 </div>
                 
                 <div className="text-slate-900 pr-2">
                    {/* 文案更新：资源有限，抢先合作 */}
                    <p className="font-extrabold text-lg flex items-center mb-1">
                        <span className="bg-emerald-500 w-1.5 h-4 mr-2 rounded-full"></span>
                        资源有限，抢先合作 <ArrowRight className="w-4 h-4 ml-1 text-emerald-500" />
                    </p>
                    <p className="text-[10px] text-slate-500 leading-tight">
                        提交产品资料，免费匹配<br/>
                        <span className="font-bold text-emerald-700">一手海外采购需求</span>
                    </p>
                 </div>
                 <div className="bg-white p-1 rounded-lg border border-slate-100 shadow-sm shrink-0">
                    <QRCodeSVG 
                        value={SITE_URL} 
                        size={75} 
                        level="Q" 
                        fgColor="#0f172a" 
                    />
                 </div>
             </div>
          </div>
        </div>
        {/* ================= 海报区域结束 ================= */}

        <div className="w-full p-4 border-t border-slate-700/50 bg-slate-800/80 flex flex-col gap-3">
           <button 
             onClick={handleDownload}
             disabled={isGenerating || !imageLoaded}
             className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 shadow-lg"
           >
             {isGenerating ? (
               <><Loader2 className="w-5 h-5 mr-2 animate-spin"/> 生成中...</>
             ) : (
               <><Download className="w-5 h-5 mr-2"/> 保存高清海报</>
             )}
           </button>
        </div>

      </div>
    </div>
  );
};