import { Menu } from 'lucide-react';
import { useUI } from '@/contexts/UIContext';

export function Topbar() {
  const { collapsed, mobileOpen, toggleCollapsed, openMobile, closeMobile, isMobile } = useUI();

  const handleMenuClick = () => {
    if (isMobile) {
      if (mobileOpen) {
        closeMobile();
      } else {
        openMobile();
      }
    } else {
      toggleCollapsed();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Hamburger menu */}
        <button
          onClick={handleMenuClick}
          className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          aria-label={isMobile ? 'Toggle mobile menu' : 'Toggle sidebar'}
          aria-expanded={isMobile ? mobileOpen : !collapsed}
          aria-controls="sidebar"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>

        {/* Center - Title (optional, can be customized per page) */}
        <div className="flex-1 text-center">
          <h1 className="text-lg font-semibold text-gray-900 truncate">
            KPD3 Dashboard
          </h1>
        </div>

        {/* Right side - User info or other actions */}
        <div className="flex items-center space-x-2">
          {/* Add any user info or actions here */}
        </div>
      </div>
    </header>
  );
}
