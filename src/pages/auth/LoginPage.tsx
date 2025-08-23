import { useMediaQuery } from "react-responsive";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginCard from "@/components/auth/LoginCard";
import FloodBackground from "@/components/auth/FloodBackground";

interface LoginPageProps {
  onLoginSuccess: (userData: any) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const nav = useNavigate();
  const prefersReducedMotion = useMediaQuery({ query: "(prefers-reduced-motion: reduce)" });

  useEffect(() => {
    const token = localStorage.getItem('crux_auth_token');
    const user = localStorage.getItem('crux_user');
    if (token && user) {
      nav('/overview', { replace: true });
    }
  }, [nav]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-[radial-gradient(60%_100%_at_100%_0%,#e9f0ff_0%,#edf7f5_40%,#f6f7fb_100%)]">
      {/* Centered Login Card */}
      <LoginCard onLoginSuccess={onLoginSuccess} />
      
      {/* Flood Wave Animation at Bottom */}
      <FloodBackground prefersReducedMotion={prefersReducedMotion} />
    </div>
  );
}