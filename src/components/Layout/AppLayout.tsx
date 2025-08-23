import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { useAuth } from '@/contexts/AuthContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Get active tab from current path
  const activeTab = location.pathname.split('/')[1] || 'overview';

  const handleTabChange = (tab: string) => {
    navigate(`/${tab}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
        userRole={user?.role}
        onLogout={logout}
        userName={user?.user_name}
      />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}