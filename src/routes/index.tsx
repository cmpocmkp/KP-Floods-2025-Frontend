import { createBrowserRouter, Navigate } from "react-router-dom";
import Protected from "./protected";
import AppLayout from "@/layouts/AppLayout";
import Floods2025Module from "@/modules/floods2025/Floods2025Module";
import EarthquakeModule from "@/modules/earthquake/EarthquakeModule";
import GLOFModule from "@/modules/glof/GLOFModule";
import SettingsModule from "@/modules/settings/SettingsModule";
import LoginPage from "@/pages/auth/LoginPage";
import { UIProvider } from "@/contexts/UIContext";

export const router = createBrowserRouter([
  // Public route(s)
  { path: "/login", element: <LoginPage /> },

  // Protected app shell (sidebar + header)
  {
    path: "/",
    element: (
      <Protected>
        <UIProvider>
          <AppLayout />
        </UIProvider>
      </Protected>
    ),
    children: [
      { index: true, element: <Navigate to="/floods-2025" replace /> },
      { path: "floods-2025/*", element: <Floods2025Module /> }, // Single route, no children
      { path: "earthquake", element: <EarthquakeModule /> },
      { path: "glof", element: <GLOFModule /> },
      { path: "settings", element: <SettingsModule /> },
      { path: "*", element: <Navigate to="/floods-2025" replace /> },
    ],
  },
]);

