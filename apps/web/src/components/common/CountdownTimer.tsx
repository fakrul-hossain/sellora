'use client';

import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetHours?: number;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetHours = 24 }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: targetHours,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="flex items-center space-x-1.5 font-mono text-xs">
      <div className="bg-brand-primary text-white px-2.5 py-1.5 rounded-lg font-bold shadow-sm min-w-[32px] text-center">
        {formatNumber(timeLeft.hours)}
      </div>
      <span className="text-brand-primary font-bold">:</span>
      <div className="bg-brand-primary text-white px-2.5 py-1.5 rounded-lg font-bold shadow-sm min-w-[32px] text-center">
        {formatNumber(timeLeft.minutes)}
      </div>
      <span className="text-brand-primary font-bold">:</span>
      <div className="bg-brand-accent text-white px-2.5 py-1.5 rounded-lg font-bold shadow-sm min-w-[32px] text-center animate-pulse">
        {formatNumber(timeLeft.seconds)}
      </div>
    </div>
  );
};
