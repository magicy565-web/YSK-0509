import React, { useMemo } from 'react';

interface BuyerMapProps {
  region: string;
}

interface Dot {
  id: number;
  cx: number;
  cy: number;
  r: number;
  opacity: number;
  isActive: boolean;
  delay: number;
}

// 简化的世界地图点阵坐标数据 (模拟)
// 这是一个艺术化的处理，为了代码简洁，我们通过算法在一个大致的世界地图轮廓内生成点
const generateWorldDots = (region: string): Dot[] => {
  const dots: Dot[] = [];
  const width = 800;
  const height = 360;
  
  // 简单的区域判断函数
  const isInLand = (x: number, y: number) => {
    // 北美
    if (x > 50 && x < 250 && y > 30 && y < 150) return true;
    // 南美
    if (x > 180 && x < 280 && y > 180 && y < 320) return true;
    // 欧洲
    if (x > 380 && x < 480 && y > 40 && y < 110) return true;
    // 非洲
    if (x > 380 && x < 500 && y > 120 && y < 280) return true;
    // 亚洲
    if (x > 500 && x < 750 && y > 40 && y < 200) return true;
    // 澳洲
    if (x > 650 && x < 750 && y > 250 && y < 320) return true;
    return false;
  };

  // 判断是否属于用户选中的活跃区域
  const isTargetRegion = (x: number, y: number) => {
    if (region === 'North America' && x < 280 && y < 180) return true;
    if (region === 'Europe' && x > 350 && x < 500 && y < 120) return true;
    if ((region === 'Southeast Asia' || region === 'Asia') && x > 550) return true;
    if (region === 'South America' && x < 300 && y > 180) return true;
    if (region === 'Middle East' && x > 450 && x < 550 && y > 100 && y < 160) return true;
    if (region === 'Global') return true;
    return false;
  };

  // 生成点阵
  for (let x = 0; x < width; x += 12) {
    for (let y = 0; y < height; y += 12) {
      // 稍微加一点随机偏移，让它看起来不那么死板
      const offsetX = Math.random() * 2;
      const offsetY = Math.random() * 2;
      
      if (isInLand(x, y)) {
        const active = isTargetRegion(x, y) && Math.random() > 0.7; // 目标区域30%的点是活跃的
        dots.push({
          id: x * 1000 + y,
          cx: x + offsetX,
          cy: y + offsetY,
          r: active ? 2 : 1.5,
          opacity: active ? 0.9 : 0.2,
          isActive: active,
          delay: Math.random() * 3
        });
      }
    }
  }
  return dots;
};

export const BuyerMap: React.FC<BuyerMapProps> = ({ region }) => {
  const dots = useMemo(() => generateWorldDots(region), [region]);

  return (
    <div className="relative w-full h-64 md:h-80 bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 mb-8 group">
      
      {/* 顶部状态栏 */}
      <div className="absolute top-4 left-4 z-20 flex items-center space-x-3 bg-slate-800/90 backdrop-blur border border-slate-600 rounded-full px-4 py-1.5">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
        <span className="text-xs font-semibold text-slate-200 tracking-wide">
          LIVE ACTIVITY: <span className="text-emerald-400">{region}</span>
        </span>
      </div>

      {/* 扫描线动画 */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent z-10 animate-scan pointer-events-none"></div>

      {/* 地图绘制区 */}
      <svg viewBox="0 0 800 360" className="w-full h-full absolute inset-0 py-8 px-4">
        {dots.map((dot) => (
          <circle
            key={dot.id}
            cx={dot.cx}
            cy={dot.cy}
            r={dot.r}
            fill={dot.isActive ? '#10b981' : '#475569'} // 活跃点绿色，非活跃深灰
            className="transition-colors duration-500"
            style={{
              opacity: dot.opacity,
              animation: dot.isActive ? `pulse-dot 2s infinite ${dot.delay}s` : 'none'
            }}
          />
        ))}
      </svg>
      
      {/* 底部装饰 */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { r: 2; opacity: 0.8; fill: #10b981; }
          50% { r: 3.5; opacity: 1; fill: #34d399; }
        }
      `}</style>
    </div>
  );
};
