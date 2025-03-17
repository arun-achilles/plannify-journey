
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedTransitionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'scale';
  duration?: number;
  delay?: number;
  triggerOnce?: boolean;
}

const AnimatedTransition: React.FC<AnimatedTransitionProps> = ({
  children,
  className,
  animation = 'fade',
  duration = 300,
  delay = 0,
  triggerOnce = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (triggerOnce && hasAnimated) return;
    
    const timer = setTimeout(() => {
      setIsVisible(true);
      setHasAnimated(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay, triggerOnce, hasAnimated]);

  // Map animation to tailwind classes
  const getAnimationClass = () => {
    switch (animation) {
      case 'fade':
        return isVisible ? 'opacity-100' : 'opacity-0';
      case 'slide-up':
        return isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8';
      case 'slide-down':
        return isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 -translate-y-8';
      case 'scale':
        return isVisible 
          ? 'opacity-100 scale-100' 
          : 'opacity-0 scale-95';
      default:
        return isVisible ? 'opacity-100' : 'opacity-0';
    }
  };

  const style = {
    transition: `all ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
  };

  return (
    <div 
      className={cn(getAnimationClass(), className)}
      style={style}
    >
      {children}
    </div>
  );
};

export default AnimatedTransition;
