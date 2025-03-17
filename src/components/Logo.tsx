
import React from 'react';
import { AlignVerticalSpaceAround } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  className, 
  iconClassName,
  textClassName,
  showText = true
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center justify-center rounded-md bg-primary p-1.5 text-primary-foreground">
        <AlignVerticalSpaceAround className={cn("h-5 w-5", iconClassName)} />
      </div>
      {showText && (
        <span className={cn("font-semibold text-xl tracking-tight", textClassName)}>
          Aligner
        </span>
      )}
    </div>
  );
};

export default Logo;
