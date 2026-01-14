import React, { useMemo } from 'react';

interface BuyerMapProps {
  region: string;
}

// 精简版世界地图 SVG 路径
const WORLD_MAP_PATH = "M156.4,142.6c-4.8-1.7-8.9-6.3-5.2-11.1c2.6-3.4,7.4-3.4,10.7-0.7c3.7,3,2.6,8.5-1.5,11.3 C159.2,142.9,157.8,143.1,156.4,142.6z M266.3,313.6c-2.6-2.2-5.9-4.8-1.9-8.1c3.3-2.6,7.8-1.5,11.5-0.4c3.3,1.1,7.4,3,6.3,7 c-1.1,4.1-5.9,5.2-9.6,6.3C270.4,319.2,268.1,315.2,266.3,313.6z M579.3,277.6c-3.3-3.7-7-7-4.1-12.2c2.2-4.1,7.4-4.8,11.5-4.4 c4.4,0.4,8.5,3.3,8.5,8.1c0,4.4-3.3,8.1-7.4,9.6C585.2,280.2,581.5,280.2,579.3,277.6z M648.1,173.3c-4.4-1.9-8.5-5.9-6.3-11.1 c1.9-4.1,7-5.2,11.1-4.1c4.4,1.1,7.8,5.2,6.7,9.6C658.5,172.6,652.6,175.2,648.1,173.3z M186.7,112.3c-5.2-5.6-11.9-10-9.6-18.1 c1.9-6.3,9.3-8.5,15.2-6.7c5.9,1.9,10,7.8,8.9,14.1C200.4,107.8,193.4,111.9,186.7,112.3z M686.3,138.6c-3.7-4.1-8.1-7.4-5.9-13 c2.2-5.2,8.5-6.3,13.7-4.4c5.2,1.9,8.5,7.4,6.7,12.6C699.6,139.3,691.8,141.6,686.3,138.6z M337,133c-6.3-5.2-13.7-8.9-13-17.8 c0.7-7.4,7.8-12.2,14.8-11.1c7,1.1,12.6,7,12.2,14.1C350.7,125.6,344.8,131.5,337,133z M755.9,286.5c-4.1-2.6-8.5-5.9-5.9-11.1 c2.2-4.4,7.8-5.2,11.9-3.7c4.1,1.5,6.7,6.3,5.2,10.4C765.9,286.9,760.7,288.7,755.9,286.5z M453.3,101.9c-4.8-6.3-11.5-11.1-8.5-19.6 c2.6-7,10.7-8.9,17.4-6.3c6.7,2.6,10.7,10,8.5,17C468.5,100.4,460.7,105.2,453.3,101.9z M235.9,252.1c-5.9-5.9-13.3-10-10-19.3 c3-7.8,11.9-9.6,19.3-6.3c7.4,3.3,10.7,11.9,7.4,19.3C250,254,242.2,257.7,235.9,252.1z M539.3,186.2c-5.2-4.1-10.7-8.1-9.3-15.6 c1.5-6.7,8.1-10.4,14.4-8.9c6.3,1.5,10.4,7.8,9.3,14.4C552.6,182.5,546.7,187.3,539.3,186.2z M125.9,101.9c-7-3-15.2-3.7-16.7-11.9 c-1.1-7,4.8-13.3,11.9-13.7c7-0.4,13.7,4.8,15.2,11.5C137.4,94.8,133.3,100.4,125.9,101.9z M611.8,252.1c-5.9-5.2-13-8.5-11.5-17 c1.5-7.4,8.9-11.1,15.9-9.3c7,1.9,10.7,9.3,9.3,16.3C624.4,249.2,618.5,253.6,611.8,252.1z M308.1,232.5c-7.8-2.2-15.9-1.5-18.9-9.3 c-2.6-7,2.2-14.4,9.6-16.3c7.4-1.9,15.2,2.2,17.4,9.3C318.5,223.6,315.5,230.6,308.1,232.5z";

interface Dot {
  id: number;
  x: number;
  y: number;
  delay: number;
}

export const BuyerMap: React.FC<BuyerMapProps> = ({ region }) => {
  // 根据用户选择的区域，计算红点分布范围
  const dots = useMemo(() => {
    const newDots: Dot[] = [];
    // 默认全球散布，如果是特定区域则集中
    const count = 35; 

    // 画布尺寸 800x400
    let xMin = 0, xMax = 800, yMin = 0, yMax = 350;

    // 简单的区域坐标映射
    if (region.includes('North America')) { xMin = 50; xMax = 250; yMin = 50; yMax = 200; }
    else if (region.includes('Europe')) { xMin = 380; xMax = 480; yMin = 50; yMax = 150; }
    else if (region.includes('Asia') || region.includes('Global')) { xMin = 500; xMax = 750; yMin = 80; yMax = 300; } // 默认偏亚洲/全球

    for (let i = 0; i < count; i++) {
      newDots.push({
        id: i,
        // 在区域内随机分布
        x: Math.random() * (xMax - xMin) + xMin,
        y: Math.random() * (yMax - yMin) + yMin,
        // 随机动画延迟，制造“此起彼伏”的效果
        delay: Math.random() * 2,
      });
    }
    return newDots;
  }, [region]);

  return (
    <div className="relative w-full h-64 md:h-80 bg-slate-900 rounded-2xl overflow-hidden shadow-inner border border-slate-700 mb-8 group">
      {/* 顶部浮层标题 */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 bg-slate-800/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-600">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
        </span>
        <span className="text-xs font-medium text-slate-200">
          正在活跃的买手分布 · {region}
        </span>
      </div>

      {/* 地图层 */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-40 transition-opacity duration-700">
         <svg viewBox="0 0 800 400" className="w-full h-full fill-slate-500">
             <path d={WORLD_MAP_PATH} transform="scale(1.1) translate(-20,0)" />
         </svg>
      </div>
      
      {/* 活跃红点层 */}
      <div className="absolute inset-0">
        {dots.map((dot) => (
          <div
            key={dot.id}
            className="absolute rounded-full bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.6)]"
            style={{
              left: `${(dot.x / 800) * 100}%`,
              top: `${(dot.y / 400) * 100}%`,
              width: '4px',
              height: '4px',
              animation: `pulse-red 3s infinite ${dot.delay}s`,
            }}
          />
        ))}
      </div>

      {/* 科技感网格背景 */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      <style>{`
        @keyframes pulse-red {
          0% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(2); opacity: 1; box-shadow: 0 0 10px 4px rgba(239,68,68,0.5); }
          100% { transform: scale(1); opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};
