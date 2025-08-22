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
      aria-label="CRUX"
      className={[
        'relative inline-flex items-center font-extrabold tracking-tight select-none',
        sizeMap[size],
        className
      ].join(' ')}
      {...wrapperProps}
    >
      {/* CRU */}
      <span className="text-black dark:text-black">CRU</span>

      {/* X with circuit flair */}
      <span className="relative inline-block text-blue-600 dark:text-blue-400 tracking-[-0.01em] scale-x-[1.12] origin-left ml-[1px]">
        X

        {/* Circuit line top-left */}
        <span className="pointer-events-none absolute -top-1 -left-2 h-px w-3 bg-blue-600/40 dark:bg-blue-400/40" />
        <span className="pointer-events-none absolute -top-1.5 -left-2.5 h-1.5 w-1.5 rounded-full bg-blue-600/60 dark:bg-blue-400/60" />

        {/* Circuit line bottom-right */}
        <span className="pointer-events-none absolute -bottom-1 -right-2 h-px w-3 bg-blue-600/40 dark:bg-blue-400/40" />
        <span className="pointer-events-none absolute -bottom-1.5 -right-2.5 h-1.5 w-1.5 rounded-full bg-blue-600/60 dark:bg-blue-400/60 animate-pulse" />
      </span>
    </Wrapper>
  );
} 