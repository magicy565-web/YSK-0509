import React, { useState, useEffect, useRef } from 'react';
import { Zap } from 'lucide-react';

interface TickerItem {
  id: number;
  text: string;
}

const generateTickerData = (): TickerItem[] => {
  const data = [
    { time: '2分钟前', region: '广东中山', industry: '灯具', name: '李总', action: '成功对接', country: '德国', detail: '意向金额 $50,000' },
    { time: '5分钟前', region: '浙江宁波', industry: '汽配', name: '张经理', action: '收到', country: '美国', detail: '买家样品单' },
    { time: '8分钟前', region: '江苏苏州', industry: '医疗器械', name: '王厂长', action: '成功对接', country: '巴西', detail: '意向金额 $120,000' },
    { time: '12分钟前', region: '福建厦门', industry: '电子消费品', name: '陈总', action: '收到', country: '日本', detail: '买家样品单' },
    { time: '15分钟前', region: '山东青岛', industry: '橡胶制品', name: '刘经理', action: '成功对接', country: '韩国', detail: '意向金额 $35,000' },
    { time: '20分钟前', region: '河北沧州', industry: '管道配件', name: '孙总', action: '成功对接', country: '俄罗斯', detail: '意向金额 $80,000' },
  ];

  return data.map((item, index) => ({
    id: index,
    text: `${item.time} | ${item.region} | ${item.industry} | ${item.name} ${item.action} ${item.country} 采购商，${item.detail}`
  }));
};

export const LiveTicker = () => {
  const [items, setItems] = useState<TickerItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMounted = useRef(true);

  useEffect(() => {
    setItems(generateTickerData());
    // Set isMounted to false when the component unmounts
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (items.length === 0) return;

    const interval = setInterval(() => {
      // Only update state if the component is still mounted
      if (isMounted.current) {
        setCurrentIndex(prevIndex => (prevIndex + 1) % items.length);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm p-3 rounded-lg border border-slate-700 w-full overflow-hidden">
        <div className="flex items-center text-emerald-400 text-sm font-semibold mb-2">
            <Zap className="w-4 h-4 mr-2 animate-pulse" />
            实时撮合动态
        </div>
        <div className="h-6 overflow-hidden relative">
             {items.map((item, index) => (
                <div
                    key={item.id}
                    className="absolute w-full transition-transform duration-500 ease-in-out text-slate-300 text-sm"
                    style={{ 
                        transform: `translateY(${(index - currentIndex) * 100}%)`,
                        opacity: index === currentIndex ? 1 : 0
                    }}
                    translate="no"
                >
                    {item.text}
                </div>
            ))}
        </div>
    </div>
  );
};