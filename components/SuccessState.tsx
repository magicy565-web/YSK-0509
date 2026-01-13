
import React from 'react';

// Using a more realistic QR code placeholder.
const base64QrCode = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAbFBMVEX///8AAADc3Nzu7u7Gxsbs7Ozn5+fNzc1hYWHs7Oyrq6vT09Pe3t43NzeioqLX19f29vYWFhbJycmYmJg/Pz+Pj4+AgIBbW1uZmZl+fn5kZGSKiop2dnYpKSkRERESEhJSUlJwcHAdHZ1mAAAEjUlEQVR4nO3d63aqOBSFYUpYQ0EpQkW0qLX2/V/iFbGFEkI3w5k5k/8/Z/bZl03nJDNkMhogCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCEI39S/df/Y/VILze2b9qL2yqs+sP25jHj/RCRxG/TD7n1sJ3O5v5r/eS+C279/+M+sX9/h78fPZfzMvgeufP/tP1l/oZTy0BIVn3S/Wp/o15xPZPx9/ov7in2tJ/Pb9h/aD8/sP6l/4s9aEj61r/sP+k/rX/Kwl/P79h/qD8/sP6l/4s9aE3zT/9p/UX/VnaQn/sv7D/UH5/Qf1L/xZa0L4zfrP/lP9qzpLyQ8tf6H+pP41P2tL+F39w/qD8vMP6l/6s7SE6/41/2H/iX7VnaVkvq3/iH5Qfn/h/Uv/lp2lJIx/qT+s//A/a09Y8n/8X/i/0X9Zewl/3f/+/kH9y/qrT9Kyv/Zf/F/ov6w9YX3yP/q/Uf/L+ktY+x/8n/pf6r+sveT/+B/4P6h/y95Lemf/v/2D+jf/LWm/+h/8H6j/5b2lP/B/4H+g/s17S+/qP/B/oP7Newt/0f+B/wH9m/eW3tF/4P+A+s2Ghe/pP/A/oH6zYWFD+k/8D6jfbFj4g/4T/wPqNxsWnqH/xP+A+s2GhfPpf/E/oL7ZsPBY/if+B9Rvdix8hf8T/wPqNxsWfqL/xP+A+s2Ghafpf/E/oH6zYWFB+l/8D6hfbFiY/9f8h/Un9a95WAm/af7DP1F/1Z2kRP8r/sP6g/P7D+pf+LDuJlPBr9w/3h/UX/awjM82/yX/Yf1L/mhb++j8s/6H+Qfn5B/Uv/Vla4q/6l/qT+tf8rAXhN/sv+0/qX/GzFvxb/sP6l/rX/Kyl4Zf0p/Un9a/9WVvC9/T/sf6k/rU/a0k4X/6T/Un9a/9WVtJ/69/qT+pf87OVhP9t/9n/Sf1rXtYyPqj/1J/WX/XzloS/rX/xf6P+tD/rKy0J/5t/z3/Q/4P+lvaEv++//7+g/pW/a2/x/5c/2D/i39rr/Hj82/qf7D/g34tfvP/+j/0f1R/9t/9L9Y/qP/sf+t/1P+t/wH/Af8B/yH/Af8R/wH/E/+B/yH/G/+D/z/Af0P9P/tH9D/gD6k/+I/yH/Cf8B/wH/Ef8B/wH/Cf8D/gP+I/0L/n7+i/w39V/R/of8t/f/8B/S/t/8N/bf1//Uf1H+j/1f9T9j/1P/b/x7/d/4j/of87/gf0P+H/wf+v/wP+B/yn/F/4v/b/5v/Q/4/+t/yf+7/wf+b/1f+b/z/+j/xP+L/x/+N/5v/N/7f/P/7v/T//n/4P+D//3/g//r/yf/H/4//p/5P/l/7f+L/3P+D/zP+h/w//F/6v/a/4n/e/5P/K/9X/pf/P/6f/N/7v/L/2//7//f8h+jQhCEIQgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCCJ2P1M/vH4jHPaD43q9o1Y/l1O+X81vd3o9X9Fv8D9k8Fv2BwRBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEO2m/wfQ/YVPEfSgWwAAAABJRU5ErkJggg==';

export const SuccessState = () => {
  return (
    <div className="max-w-4xl mx-auto my-12 p-8 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 text-white animate-fade-in">

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-emerald-400">
          申请已提交，专属顾问正在为您审核
        </h1>
        <p className="text-slate-400 mt-2">
          为保证最高的匹配效率，我们将在4小时内完成您的资质初审。
        </p>
         <div className="inline-block bg-yellow-900/50 text-yellow-300 text-sm px-4 py-2 mt-4 rounded-full">
            当前审核队列：<span className="font-bold">12 人</span>排队中
        </div>
      </div>
      
      {/* Main Card */}
      <div className="bg-slate-900 rounded-xl shadow-lg flex flex-col md:flex-row items-center p-6 md:p-8 gap-8 border border-slate-700">
        
        {/* Left Side: Expert Profile */}
        <div className="flex-shrink-0 text-center w-full md:w-auto">
          <img 
            src="https://api.dicebear.com/7.x/adventurer/svg?seed=Alex&backgroundType=gradientLinear&backgroundColor=059669,06b6d4"
            alt="Alex - 高级供应链选品官"
            className="w-32 h-32 rounded-full mx-auto border-4 border-slate-700 shadow-lg"
          />
          <h2 className="text-xl font-bold text-white mt-4">Alex</h2>
          <p className="text-slate-400 text-sm">高级供应链选品官</p>
          <div className="mt-2 text-sm font-semibold flex items-center justify-center gap-2 bg-slate-800 px-3 py-1 rounded-full">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-green-400">在线</span>
            <span className="text-slate-500">|</span>
            <span>正在审核您的资料</span>
          </div>
        </div>

        {/* Right Side: Action instructions */}
        <div className="flex-grow text-center md:text-left border-t-2 md:border-t-0 md:border-l-2 border-slate-700/50 pt-8 md:pt-0 md:pl-8">
           <h3 className="text-2xl font-bold text-white">我已收到您的申请</h3>
           <p className="text-slate-300 mt-2 mb-6">
            您的资质初审预计需要 4 小时。为防止错失匹配机会，请直接添加我的企业微信，备注<strong className="text-emerald-400 font-bold mx-1">【工厂名】</strong>，我将把您拉入<strong className="text-emerald-400 font-bold mx-1">‘核心资源对接群’</strong>。
          </p>
          <div className="flex justify-center md:justify-start">
             <div className="p-4 bg-white rounded-lg">
                <img 
                    src={base64QrCode} 
                    alt="企业微信二维码"
                    className="w-40 h-40"
                />
             </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 text-center md:text-left">
            如果您未在24小时内收到好友请求，请联系我们的客服 support@export-autopilot.com
          </p>
        </div>
      </div>
    </div>
  );
};
