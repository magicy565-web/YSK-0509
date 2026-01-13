import React, { useState, useEffect } from 'react';

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  label: string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ target, duration = 2000, label, className }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    const animationFrame = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const currentCount = Math.min(target, Math.floor(target * (progress / duration)));
      setCount(currentCount);

      if (progress < duration) {
        animationFrameId = requestAnimationFrame(animationFrame);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(animationFrame);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [target, duration]);

  return (
    <div className={`text-center ${className}`}>
      {/* 添加 translate="no" 防止浏览器翻译插件修改 DOM 结构导致 React 崩溃 */}
      <div className="text-4xl font-bold text-emerald-400" translate="no">
        {count.toLocaleString()}
      </div>
      <div className="text-sm text-slate-300 mt-1">{label}</div>
    </div>
  );
};