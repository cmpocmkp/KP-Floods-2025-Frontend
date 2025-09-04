import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

function useIsAuthed() {
  const t = localStorage.getItem("crux_auth_token");
  return Boolean(t);
}

export default function Protected({ children }: { children: ReactNode }) {
  const authed = useIsAuthed();
  const loc = useLocation();
  if (!authed) return <Navigate to="/login" replace state={{ from: loc }} />;
  return <>{children}</>;
}

