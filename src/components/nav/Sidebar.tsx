import { NavLink, useLocation } from "react-router-dom";
import { Waves, Activity, Settings, LogOut, AlertTriangle, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useUI } from "@/contexts/UIContext";

const NAV = [
  { to: "/floods-2025", label: "KP Floods 2025", icon: Waves },
  { to: "/earthquake",  label: "Earthquake",     icon: Activity },
  { to: "/glof",  label: "GLOF",     icon: AlertTriangle },
  { to: "/settings",    label: "Settings",       icon: Settings },
];

export default function Sidebar() {
  const { collapsed, mobileOpen, closeMobile, isMobile } = useUI();
  const location = useLocation();
  const sidebarRef = useRef<HTMLElement>(null);

  // Close mobile drawer on route change
  useEffect(() => {
    if (isMobile) {
      closeMobile();
    }
  }, [location.pathname, isMobile, closeMobile]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        closeMobile();
      }
    };

    if (mobileOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [mobileOpen, closeMobile]);

  // Focus trap for mobile drawer
  useEffect(() => {
    if (mobileOpen && sidebarRef.current) {
      const focusableElements = sidebarRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement?.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement?.focus();
              e.preventDefault();
            }
          }
        }
      };

      document.addEventListener('keydown', handleTabKey);
      firstElement?.focus();

      return () => document.removeEventListener('keydown', handleTabKey);
    }
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        id="sidebar"
        className={`
          fixed top-0 left-0 h-screen bg-[#2b547d] text-white z-50 pointer-events-auto
          transition-all duration-200 ease-in-out
          ${isMobile 
            ? `w-[260px] transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`
            : `${collapsed ? 'w-[80px]' : 'w-[260px]'}`
          }
        `}
        aria-label="Main navigation"
        aria-expanded={isMobile ? mobileOpen : !collapsed}
      >
        {/* Mobile close button */}
        {isMobile && (
          <div className="flex justify-end p-4 border-b border-white/20">
            <button
              onClick={closeMobile}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Brand */}
        <div className={`flex flex-col items-center justify-center border-b border-white/20 bg-white/5 shadow-sm ${
          isMobile ? 'px-6 h-20' : 'px-10 h-24'
        }`}>
          <div className="font-extrabold tracking-tight text-4xl text-white drop-shadow-sm">
            {collapsed && !isMobile ? <span>K³</span> : <span>KPD3</span>}
          </div>
          {(!collapsed || isMobile) && (
            <div className="text-sm text-white/95 mt-1 font-medium tracking-wide">
              Disaster Damages Directory
            </div>
          )}
        </div>
      
        {/* Nav */}
        <nav className="px-3 py-4 space-y-2 mt-2">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              title={collapsed && !isMobile ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-medium transition-all duration-200
                 ${isActive
                   ? "bg-white/20 text-white shadow-md"
                   : "text-white/90 hover:bg-white/10 hover:text-white hover:shadow-sm"}`
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {(!collapsed || isMobile) && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Sign out */}
        <div className="border-t border-white/10 px-3 py-3">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("kpd3:signout"))}
            title={collapsed && !isMobile ? "Sign out" : undefined}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-white hover:bg-[rgba(7,127,201,0.12)] focus:outline-none focus:ring-2 focus:ring-[rgba(7,127,201,0.45)]"
          >
            <LogOut className="h-5 w-5" />
            {(!collapsed || isMobile) && <span>Sign out</span>}
          </button>
        </div>

        {/* Powered by */}
        <div className="absolute bottom-0 left-0 right-0 px-1 py-0.5 bg-[#2b547d]">
          <div className="flex items-center justify-center space-x-2">
            {(!collapsed || isMobile) && (
              <div className="text-xl text-white font-bold">Powered By</div>
            )}
            <div className="flex items-center justify-center">
              <img 
                src="/cmpo-logo.jpg" 
                alt="CRUX CMPO Logo" 
                className="h-12 w-auto"
              />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

