import { NavLink } from "react-router-dom";
import { Waves, Activity, Settings, LogOut, Menu } from "lucide-react";
import { useEffect, useState } from "react";

const NAV = [
  { to: "/floods-2025", label: "KP Floods 2025", icon: Waves },
  { to: "/earthquake",  label: "Earthquake",     icon: Activity },
  { to: "/settings",    label: "Settings",       icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("kpd3.sidebar.collapsed")==="1");
  useEffect(() => { localStorage.setItem("kpd3.sidebar.collapsed", collapsed ? "1" : "0"); }, [collapsed]);

  return (
    <aside
      className={`fixed top-0 left-0 h-screen
                  bg-gradient-to-b from-sky-700 via-indigo-700 to-indigo-800
                  text-white z-50 pointer-events-auto
                  ${collapsed ? "w-20" : "w-72"} transition-[width] duration-200`}
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-between px-4 h-16 border-b border-white/10">
        <div className="font-bold tracking-wide">{collapsed ? <span className="text-xl">K³</span> : <span className="text-xl">KPD3</span>}</div>
        <button className="text-white/80 hover:text-white hidden md:inline-flex" onClick={()=>setCollapsed(!collapsed)} aria-label="Collapse">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <nav className="px-3 py-3 space-y-2">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium
               ${isActive ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10"}`
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-white/10 px-3 py-3">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("kpd3:signout"))}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-white/90 hover:bg-white/10"
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
}

