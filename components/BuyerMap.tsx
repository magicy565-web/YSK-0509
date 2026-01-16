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
    const width = 800;
    const height = 400;
    const gap = 12;

    const continents = [
      { name: 'North America', cx: 160, cy: 110, rx: 90, ry: 60 },
      { name: 'South America', cx: 240, cy: 280, rx: 50, ry: 85 },
      { name: 'Europe', cx: 410, cy: 100, rx: 55, ry: 40 },
      { name: 'Africa', cx: 430, cy: 220, rx: 70, ry: 80 },
      { name: 'Asia', cx: 580, cy: 130, rx: 130, ry: 90 },
      { name: 'Oceania', cx: 700, cy: 300, rx: 45, ry: 45 },
    ];

    const isTargetRegion = (x: number, y: number, continentName: string) => {
      if (region === 'Global') return true;
      if (region.includes('North America') && continentName === 'North America') return true;
      if (region.includes('South America') && continentName === 'South America') return true;
      if (region.includes('Europe') && continentName === 'Europe') return true;
      if (region.includes('Africa') && continentName === 'Africa') return true;
      if ((region.includes('Asia') || region.includes('Southeast Asia')) && continentName === 'Asia') return true;
      if (region.includes('Middle East') && x > 450 && x < 550 && y > 120 && y < 180) return true;
      return false;
    };

    for (let y = gap; y < height; y += gap) {
      for (let x = gap; x < width; x += gap) {
        let belongsToContinent = null;

        for (const cont of continents) {
          const normalizedDist = Math.pow(x - cont.cx, 2) / Math.pow(cont.rx, 2) + Math.pow(y - cont.cy, 2) / Math.pow(cont.ry, 2);
          if (normalizedDist <= 1.05 - Math.random() * 0.25) {
            belongsToContinent = cont.name;
            break;
          }
        }

        if (belongsToContinent) {
          const isActive = isTargetRegion(x, y, belongsToContinent);
          const isHot = isActive ? Math.random() > 0.5 : Math.random() > 0.95;

          generatedDots.push({
            id: x * 1000 + y,
            cx: x,
            cy: y,
            r: isHot && isActive ? 2.5 : 1.5,
            opacity: isHot && isActive ? 1 : 0.25,
            color: isHot && isActive ? '#10b981' : '#475569',
            className: isHot && isActive ? 'animate-pulse' : '',
            style: {
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
      
      <div className="absolute top-4 left-4 z-20 flex items-center space-x-3 bg-slate-800/90 backdrop-blur border border-slate-600 rounded-full px-4 py-1.5 shadow-lg transition-all group-hover:border-emerald-500/50">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
        <span className="text-xs font-semibold text-slate-200 tracking-wide uppercase">
          Live Activity: <span className="text-emerald-400 font-bold ml-1">{region}</span>
        </span>
      </div>

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
      
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent pointer-events-none"></div>
    </div>
  );
};
