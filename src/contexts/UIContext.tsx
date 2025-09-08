import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UIContextType {
  collapsed: boolean;
  mobileOpen: boolean;
  toggleCollapsed: () => void;
  openMobile: () => void;
  closeMobile: () => void;
  isMobile: boolean;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

interface UIProviderProps {
  children: ReactNode;
}

export function UIProvider({ children }: UIProviderProps) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('kpd3.sidebar.collapsed') === '1';
    }
    return false;
  });
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle mobile/desktop transitions
  useEffect(() => {
    if (isMobile) {
      // On mobile: force collapsed = true and close mobile drawer
      setCollapsed(true);
      setMobileOpen(false);
    } else {
      // On desktop: respect persisted collapsed state
      const saved = localStorage.getItem('kpd3.sidebar.collapsed') === '1';
      setCollapsed(saved);
    }
  }, [isMobile]);

  const toggleCollapsed = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    localStorage.setItem('kpd3.sidebar.collapsed', newCollapsed ? '1' : '0');
    
    // Dispatch layout change event for charts
    window.dispatchEvent(new Event('kpd3:layout:changed'));
  };

  const openMobile = () => {
    setMobileOpen(true);
    // Disable body scroll
    document.body.style.overflow = 'hidden';
  };

  const closeMobile = () => {
    setMobileOpen(false);
    // Re-enable body scroll
    document.body.style.overflow = '';
  };

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
    document.body.style.overflow = '';
  }, []);

  const value: UIContextType = {
    collapsed,
    mobileOpen,
    toggleCollapsed,
    openMobile,
    closeMobile,
    isMobile,
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}
