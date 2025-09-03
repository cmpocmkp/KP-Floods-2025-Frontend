import React from 'react';
import { Link } from 'react-router-dom';

type Size = 'sm' | 'md' | 'lg';

const sizeMap: Record<Size, string> = {
  sm: 'text-xl',
  md: 'text-3xl',
  lg: 'text-4xl md:text-5xl'
};

interface BrandLogoProps {
  size?: Size;
  className?: string;
  asLink?: boolean;
}

export default function BrandLogo({ size = 'md', className = '', asLink = false }: BrandLogoProps) {
  const Wrapper: React.ElementType = asLink ? Link : 'div';
  const wrapperProps = asLink ? { to: '/' } : {};

  return (
    <Wrapper
      aria-label="KPD3"
      className={[
        'relative inline-flex items-center font-extrabold tracking-tight select-none',
        sizeMap[size],
        className
      ].join(' ')}
      {...wrapperProps}
    >
      <span className="text-black dark:text-black">KP</span>
      <span className="relative inline-block text-blue-600 dark:text-blue-400 tracking-[-0.01em] ml-2">
        D
        <span className="text-red-600">3</span>
      </span>
    </Wrapper>
  );
} 