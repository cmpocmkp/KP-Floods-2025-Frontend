import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/nav/Sidebar";
import { Menu } from "lucide-react";
import { useEffect, useMemo } from "react";

export default function AppShell() {
  const location = useLocation();
  const collapsed = useMemo(
    () => (typeof window !== "undefined" && localStorage.getItem("kpd3.sidebar.collapsed")==="1"),
    []
  );
  const pad = collapsed ? "md:pl-20" : "md:pl-72";

  // Don't render AppShell content for floods-2025 route
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

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      {!isFloodsRoute && (
        <>
         

          <main className={`relative z-0 pointer-events-auto pt-4 ${pad}`}>
            <div className="px-4 pb-8">
              <Outlet />
            </div>
          </main>
        </>
      )}
      {isFloodsRoute && <Outlet />}
    </div>
  );
}

