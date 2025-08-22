import React from 'react';
import { RefreshCw } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function LoadingSpinner({ size = 'md', text = 'Loading...' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="relative">
        <RefreshCw className={`${sizeClasses[size]} text-blue-500 animate-spin`} />
      </div>
      {text && (
        <p className="mt-4 text-sm text-gray-600 font-medium">{text}</p>
      )}
    </div>
  );
} 