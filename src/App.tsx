import React, { useState, useEffect, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './pages/Login';
import { AppHeader } from './components/Layout/AppHeader';
import { OverviewHeader } from './features/overview/OverviewHeader';

// Create a client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Lazy load pages
const OverviewPage = React.lazy(() => import('./pages/OverviewPage'));
const IncidentsPage = React.lazy(() => import('./pages/IncidentsPage'));
const InfrastructurePage = React.lazy(() => import('./pages/InfrastructurePage'));
const WarehousePage = React.lazy(() => import('./pages/WarehousePage'));
const CampsPage = React.lazy(() => import('./pages/CampsPage'));
const CompensationPage = React.lazy(() => import('./pages/CompensationPage'));

// Placeholder components
const SourcesManagement = () => (
  <div className="p-6 bg-white rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-4">Data Sources Management</h2>
    <p className="text-gray-600">Configure and manage data sources for the KP Floods 2025 dashboard.</p>
  </div>
);

const Settings = () => (
  <div className="p-6 bg-white rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-4">Settings</h2>
    <p className="text-gray-600">System settings and configuration options.</p>
  </div>
);

// Loading spinner
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <p className="text-sm text-gray-600">Loading...</p>
    </div>
  </div>
);

interface User {
  user_name: string;
  role: string;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={(userData) => {
      setUser(userData);
      setIsLoggedIn(true);
    }} />;
  }

  const renderContent = () => {
    let Component;
    switch (activeTab) {
      case 'overview':
        Component = OverviewPage;
        break;
      case 'incidents':
        Component = IncidentsPage;
        break;
      case 'infrastructure':
        Component = InfrastructurePage;
        break;
      case 'warehouse':
        Component = WarehousePage;
        break;
      case 'camps':
        Component = CampsPage;
        break;
      case 'compensation':
        Component = CompensationPage;
        break;
      case 'sources-management':
        return <SourcesManagement />;
      case 'settings':
        return <Settings />;
      default:
        Component = OverviewPage;
    }

    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Component />
      </Suspense>
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <OverviewHeader 
          reportPeriod={{
            start: '2025-08-14',
            end: '2025-08-20'
          }}
          lastUpdated="2025-08-20T10:52:00Z"
        />
        <AppHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          userRole={user?.role}
          userName={user?.user_name}
          onLogout={handleLogout}
        />
        <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-6">
          {renderContent()}
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;