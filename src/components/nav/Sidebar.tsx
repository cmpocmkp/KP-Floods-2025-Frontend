import { NavLink } from "react-router-dom";
import { Waves, Activity, Settings, LogOut, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

const NAV = [
  { to: "/floods-2025", label: "KP Floods 2025", icon: Waves },
  { to: "/earthquake",  label: "Earthquake",     icon: Activity },
  { to: "/glof",  label: "GLOF",     icon: AlertTriangle },
  { to: "/settings",    label: "Settings",       icon: Settings },
];

export default function Sidebar() {
  const [collapsed] = useState(() => localStorage.getItem("kpd3.sidebar.collapsed")==="1");
  useEffect(() => { localStorage.setItem("kpd3.sidebar.collapsed", collapsed ? "1" : "0"); }, [collapsed]);

  return (
    <aside
    className={`fixed top-0 left-0 h-screen
                bg-[#077fc9]
                text-white z-50 pointer-events-auto
                ${collapsed ? "w-20" : "w-65"} transition-[width] duration-200`}
    aria-label="Main navigation"
  >
    {/* Brand */}
    <div className="flex flex-col items-center justify-center px-10 h-24 border-b border-white/20 bg-white/5 shadow-sm">
      <div className="font-extrabold tracking-tight text-4xl text-white drop-shadow-sm">
        {collapsed ? <span>K³</span> : <span>KPD3</span>}
      </div>
      {!collapsed && (
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
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-medium transition-all duration-200
             ${isActive
               ? "bg-white/20 text-white shadow-md"
               : "text-white/90 hover:bg-white/10 hover:text-white hover:shadow-sm"}`
          }
        >
          <Icon className="h-5 w-5 shrink-0" />
          {!collapsed && <span>{label}</span>}
        </NavLink>
      ))}
    </nav>

    {/* Sign out */}
    <div className="border-t border-white/10 px-3 py-3">
      <button
        onClick={() => window.dispatchEvent(new CustomEvent("kpd3:signout"))}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-white hover:bg-[rgba(7,127,201,0.12)] focus:outline-none focus:ring-2 focus:ring-[rgba(7,127,201,0.45)]"
      >
        <LogOut className="h-5 w-5" />
        {!collapsed && <span>Sign out</span>}
      </button>
    </div>

    {/* Powered by */}
    <div className="absolute bottom-0 left-0 right-0 px-1 py-0.5 bg-[#077fc9]">
      <div className="flex items-center justify-center space-x-2">
        <div className="text-xl text-white font-bold">Powered By</div>
        <div className="flex items-center justify-center">
          <img 
            src="/crux-cmpo-logo.png" 
            alt="CRUX CMPO Logo" 
            className="h-12 w-auto"
          />
        </div>
       
      </div>
    </div>
  </aside>
  
  
  );
}

