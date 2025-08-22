import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import { AppHeader } from './components/Layout/AppHeader';
import { OverviewHeader } from './features/overview/OverviewHeader';

// Lazy load pages
const OverviewPage = React.lazy(() => import('./pages/OverviewPage'));
const IncidentsPage = React.lazy(() => import('./pages/IncidentsPage'));
const InfrastructurePage = React.lazy(() => import('./pages/InfrastructurePage'));
const WarehousePage = React.lazy(() => import('./pages/WarehousePage'));
const CampsPage = React.lazy(() => import('./pages/CampsPage'));
const CompensationPage = React.lazy(() => import('./pages/CompensationPage'));

// Placeholder components for Settings and Sources Management
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
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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
    switch (activeTab) {
      case 'overview':
        return <React.Suspense fallback={<LoadingSpinner />}><OverviewPage /></React.Suspense>;
      case 'incidents':
        return <React.Suspense fallback={<LoadingSpinner />}><IncidentsPage /></React.Suspense>;
      case 'infrastructure':
        return <React.Suspense fallback={<LoadingSpinner />}><InfrastructurePage /></React.Suspense>;
      case 'warehouse':
        return <React.Suspense fallback={<LoadingSpinner />}><WarehousePage /></React.Suspense>;
      case 'camps':
        return <React.Suspense fallback={<LoadingSpinner />}><CampsPage /></React.Suspense>;
      case 'compensation':
        return <React.Suspense fallback={<LoadingSpinner />}><CompensationPage /></React.Suspense>;
      case 'sources-management':
        return <SourcesManagement />;
      case 'settings':
        return <Settings />;
      default:
        return <React.Suspense fallback={<LoadingSpinner />}><OverviewPage /></React.Suspense>;
    }
  };

  return (
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
      {renderContent()}
    </div>
  );
}

export default App;