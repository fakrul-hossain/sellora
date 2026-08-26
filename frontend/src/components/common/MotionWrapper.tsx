'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MotionWrapperProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  variant?: 'fade' | 'scale' | 'blur';
  className?: string;
}

export const MotionWrapper: React.FC<MotionWrapperProps> = ({
  children,
  delay = 0,
  direction = 'up',
  variant = 'fade',
  className = '',
}) => {
  const getInitial = () => {
    const base = { opacity: 0 };
    if (variant === 'blur') (base as any).filter = 'blur(10px)';
    if (variant === 'scale') (base as any).scale = 0.95;

    switch (direction) {
      case 'up':
        return { ...base, y: 30 };
      case 'down':
        return { ...base, y: -30 };
      case 'left':
        return { ...base, x: 40 };
      case 'right':
        return { ...base, x: -40 };
      default:
        return base;
    }
  };

  return (
    <motion.div
      initial={getInitial()}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        filter: 'blur(0px)',
      }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
