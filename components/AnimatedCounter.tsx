
import React, { useState, useEffect } from 'react';

interface AnimatedCounterProps {
  target: number;
  duration?: number; // duration in milliseconds
  label: string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ target, duration = 2000, label, className }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const animationFrame = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const currentCount = Math.min(target, Math.floor(target * (progress / duration)));
      setCount(currentCount);

      if (progress < duration) {
        requestAnimationFrame(animationFrame);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(animationFrame);

    return () => {
      // Cleanup if needed, though requestAnimationFrame stops itself.
    };
  }, [target, duration]);

  return (
    <div className={`text-center ${className}`}>
      <div className="text-4xl font-bold text-emerald-400">
        {count.toLocaleString()}
      </div>
      <div className="text-sm text-slate-300 mt-1">{label}</div>
    </div>
  );
};
