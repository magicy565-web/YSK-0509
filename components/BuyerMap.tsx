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
  color: string;
  className: string;
  style: React.CSSProperties;
}

export const BuyerMap: React.FC<BuyerMapProps> = ({ region }) => {
  const dots = useMemo(() => {
    const generatedDots: Dot[] = [];
    // 画布设定
    const width = 800;
    const height = 400;
    const gap = 12; // 点间距，越小越密

    // 1. 定义大陆板块的近似几何形状 (中心坐标+半径)
    // 这种方法比随机点更能呈现出“地图”的视觉感
    const continents = [
      { name: 'North America', cx: 160, cy: 110, rx: 90, ry: 60 },
      { name: 'South America', cx: 240, cy: 280, rx: 50, ry: 85 },
      { name: 'Europe', cx: 410, cy: 100, rx: 55, ry: 40 },
      { name: 'Africa', cx: 430, cy: 220, rx: 70, ry: 80 },
      { name: 'Asia', cx: 580, cy: 130, rx: 130, ry: 90 },
      { name: 'Oceania', cx: 700, cy: 300, rx: 45, ry: 45 },
    ];

    // 2. 智能判断活跃区域
    const isTargetRegion = (x: number, y: number, continentName: string) => {
      // 全球模式：所有板块都活跃
      if (region === 'Global') return true;
      
      // 区域匹配逻辑
      if (region.includes('North America') && continentName === 'North America') return true;
      if (region.includes('South America') && continentName === 'South America') return true;
      if (region.includes('Europe') && continentName === 'Europe') return true;
      if (region.includes('Africa') && continentName === 'Africa') return true;
      if ((region.includes('Asia') || region.includes('Southeast Asia')) && continentName === 'Asia') return true;
      
      // 中东特殊处理 (位于亚非欧交界)
      if (region.includes('Middle East') && x > 450 && x < 550 && y > 120 && y < 180) return true;
      
      return false;
    };

    // 3. 遍历网格生成点阵
    for (let y = gap; y < height; y += gap) {
      for (let x = gap; x < width; x += gap) {
        let belongsToContinent = null;

        // 检查当前坐标是否落在某个大陆板块内
        for (const cont of continents) {
          // 椭圆方程检查
          const normalizedDist = Math.pow(x - cont.cx, 2) / Math.pow(cont.rx, 2) + Math.pow(y - cont.cy, 2) / Math.pow(cont.ry, 2);
          
          // normalizedDist <= 1 表示在椭圆内。
          // 加上随机噪点 (0.8-1.1) 让边缘产生不规则的自然感
          if (normalizedDist <= 1.05 - Math.random() * 0.25) {
            belongsToContinent = cont.name;
            break;
          }
        }

        // 如果是陆地，就绘制点
        if (belongsToContinent) {
          const isActive = isTargetRegion(x, y, belongsToContinent);
          
          // 决定是否高亮：活跃区域有 50% 概率高亮，其他区域仅 5% (模拟背景噪音)
          const isHot = isActive ? Math.random() > 0.5 : Math.random() > 0.95;

          generatedDots.push({
            id: x * 1000 + y,
            cx: x,
            cy: y,
            r: isHot && isActive ? 2.5 : 1.5, // 活跃点稍大
            opacity: isHot && isActive ? 1 : 0.25, // 活跃点不透明
            color: isHot && isActive ? '#10b981' : '#475569', // 活跃=翠绿, 普通=深灰
            className: isHot && isActive ? 'animate-pulse' : '',
            style: {
              // 随机打乱呼吸节奏，看起来更自然
              animationDuration: `${Math.random() * 2 + 1.5}s`, 
              animationDelay: `${Math.random()}s`
            }
          });
        }
      }
    }
    return generatedDots;
  }, [region]);

  return (
    <div className="relative w-full h-64 md:h-80 bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 mb-8 group">
      
      {/* --- UI: 顶部悬浮状态栏 --- */}
      <div className="absolute top-4 left-4 z-20 flex items-center space-x-3 bg-slate-800/90 backdrop-blur border border-slate-600 rounded-full px-4 py-1.5 shadow-lg transition-all group-hover:border-emerald-500/50">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
        <span className="text-xs font-semibold text-slate-200 tracking-wide uppercase">
          Live Activity: <span className="text-emerald-400 font-bold ml-1">{region}</span>
        </span>
      </div>

      {/* --- 动效: 垂直扫描线 --- */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent z-10 animate-scan pointer-events-none"></div>

      {/* --- 核心: SVG 点阵地图 --- */}
      <svg viewBox="0 0 800 400" className="w-full h-full absolute inset-0 pointer-events-none">
        {dots.map((dot) => (
          <circle
            key={dot.id}
            cx={dot.cx}
            cy={dot.cy}
            r={dot.r}
            fill={dot.color}
            fillOpacity={dot.opacity}
            className={`transition-all duration-700 ${dot.className}`}
            style={dot.style}
          />
        ))}
      </svg>
      
      {/* --- 装饰: 底部渐变遮罩 (增加空间深邃感) --- */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent pointer-events-none"></div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
      `}</style>
    </div>
  );
};
