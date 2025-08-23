import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import KPFloodsLogo from "@/components/brand/KPFloodsLogo";
import { Shield, Lock } from "lucide-react";

interface LoginCardProps {
  onLoginSuccess: (userData: any) => void;
}

export default function LoginCard({ onLoginSuccess }: LoginCardProps) {
  const nav = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    
    const res = await login(username, password);
    setLoading(false);

    if (res.success) {
      console.log('Login successful, navigating...');
      onLoginSuccess(res.user);
      nav("/overview", { replace: true });
    } else {
      console.log('Login failed:', res);
      setErr(res.error || "Invalid credentials");
    }
  }

  return (
    <div className="relative z-10 w-full max-w-[480px]">
      <div className="rounded-2xl border border-slate-200/60 bg-white/85 backdrop-blur shadow-xl p-8 md:p-10">
        <div className="mb-8 flex flex-col items-center">
          <KPFloodsLogo className="h-14 w-auto" />
        </div>

        {err && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {err}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="username">Username or Email</Label>
            <Input 
              id="username" 
              value={username} 
              onChange={e=>setUsername(e.target.value)} 
              autoComplete="username" 
              className="h-11" 
              required 
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              autoComplete="current-password" 
              className="h-11" 
              required 
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Checkbox 
                id="remember" 
                checked={remember} 
                onCheckedChange={v=>setRemember(Boolean(v))} 
              />
              <Label htmlFor="remember" className="font-normal">Remember me</Label>
            </div>
          </div>
          <Button 
            type="submit" 
            disabled={loading} 
            className="h-11 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
          >
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Shield className="h-4 w-4" />
            <span>Secure</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="h-4 w-4" />
            <span>Trusted</span>
          </div>
        </div>
      </div>
    </div>
  );
}