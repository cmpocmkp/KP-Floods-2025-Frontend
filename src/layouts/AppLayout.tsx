import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "@/components/nav/Sidebar";
import { Topbar } from "@/components/Layout/Topbar";
import { useUI } from "@/contexts/UIContext";

export default function AppLayout() {
  const location = useLocation();
  const { collapsed, isMobile } = useUI();

  // Don't render AppLayout content for floods-2025 route
  const isFloodsRoute = location.pathname.startsWith('/floods-2025');

  useEffect(() => {
    const onSignOut = () => {
      const btn = document.querySelector<HTMLButtonElement>('[data-kpd3-signout]');
      if (btn) {
        btn.click();
        return;
      }
      try {
        localStorage.removeItem("crux_auth_token");
        localStorage.removeItem("crux_user");
      } catch {}
      window.location.href = "/login";
    };
    window.addEventListener("kpd3:signout", onSignOut as EventListener);
    return () => window.removeEventListener("kpd3:signout", onSignOut as EventListener);
  }, []);

  // Set CSS variables for sidebar width
  useEffect(() => {
    const root = document.documentElement;
    if (isMobile) {
      root.style.setProperty('--sidebar-w', '0px');
    } else {
      root.style.setProperty('--sidebar-w', collapsed ? '80px' : '260px');
    }
  }, [collapsed, isMobile]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      {!isFloodsRoute && (
        <>
          <Topbar />
          <main 
            className="relative z-0 pointer-events-auto transition-[padding-left] duration-200"
            style={{
              paddingLeft: isMobile ? '0px' : `var(--sidebar-w)`
            }}
          >
            <div className="px-4 pb-8 pt-4">
              <Outlet />
            </div>
          </main>
        </>
      )}
      {isFloodsRoute && <Outlet />}
    </div>
  );
}
