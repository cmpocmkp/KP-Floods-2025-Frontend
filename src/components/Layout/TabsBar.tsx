import React, { useRef, useState, useLayoutEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
}

interface TabsBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function TabsBar({ tabs, activeTab, onTabChange }: TabsBarProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const [showScrollButtons, setShowScrollButtons] = useState(false);

  const updateIndicator = useCallback(() => {
    const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
    const el = tabRefs.current[activeIndex];
    if (!el || !listRef.current) return;

    const rect = el.getBoundingClientRect();
    const containerRect = listRef.current.getBoundingClientRect();
    setIndicator({
      left: rect.left - containerRect.left + listRef.current.scrollLeft,
      width: rect.width
    });
  }, [activeTab, tabs]);

  const checkScrollButtons = useCallback(() => {
    if (!listRef.current) return;
    const { scrollWidth, clientWidth } = listRef.current;
    setShowScrollButtons(scrollWidth > clientWidth);
  }, []);

  useLayoutEffect(() => {
    updateIndicator();
    checkScrollButtons();
    
    const handleResize = () => {
      updateIndicator();
      checkScrollButtons();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateIndicator, checkScrollButtons]);

  const scroll = (direction: 'left' | 'right') => {
    if (!listRef.current) return;
    const scrollAmount = direction === 'left' ? -200 : 200;
    listRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    const activeIndex = tabs.findIndex(tab => tab.id === tabId);
    const el = tabRefs.current[activeIndex];
    if (!el || !listRef.current) return;
    
    // Center the clicked tab
    el.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest'
    });
  };

  return (
    <div className="sticky top-0 z-40 w-full bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/70 shadow-[0_1px_0_theme(colors.border)] transition-shadow">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6">
        <div className="relative flex items-center">
          {showScrollButtons && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          
          <div
            ref={listRef}
            className="relative flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-2"
            style={{ scrollSnapType: 'x mandatory' }}
            onScroll={updateIndicator}
          >
            {tabs.map((tab, i) => (
              <button
                key={tab.id}
                className={cn(
                  "relative inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                  "text-muted-foreground hover:text-foreground transition-colors",
                  "scroll-snap-align-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50",
                  "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:scale-x-0 after:bg-blue-600/40 after:transition-transform hover:after:scale-x-100",
                  activeTab === tab.id && "text-foreground after:scale-x-0"
                )}
                onClick={() => handleTabClick(tab.id)}
                data-active={activeTab === tab.id}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                <span ref={el => tabRefs.current[i] = el}>{tab.label}</span>
              </button>
            ))}
            
            <span
              className="pointer-events-none absolute bottom-0 h-0.5 rounded-full bg-blue-600 transition-all duration-300"
              style={{
                left: indicator.left,
                width: indicator.width
              }}
            />
          </div>

          {showScrollButtons && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}