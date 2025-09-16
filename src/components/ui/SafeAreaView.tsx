import type { ReactNode } from 'react';

interface SafeAreaViewProps {
  children: ReactNode;
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
  className?: string;
}

export const SafeAreaView = ({ 
  children, 
  top = true, 
  bottom = true, 
  left = true, 
  right = true,
  className = '' 
}: SafeAreaViewProps) => {
  const safeAreaClasses = [
    top && 'safe-area-inset-top',
    bottom && 'safe-area-inset-bottom',
    left && 'safe-area-inset-left',
    right && 'safe-area-inset-right'
  ].filter(Boolean).join(' ');

  return (
    <div className={`${safeAreaClasses} ${className}`}>
      {children}
    </div>
  );
};