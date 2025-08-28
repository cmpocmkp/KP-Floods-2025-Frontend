import React, { useState, useEffect, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { getCumulativeDashboard } from '@/lib/overview';
import Login from './pages/auth/LoginPage';
import { AppHeader } from './components/Layout/AppHeader';
import { OverviewHeader } from './features/overview/OverviewHeader';
import { OverviewKpis, IncidentKpis, WarehouseKpis, CampsKpis, CompensationKpis, LivestockKpis, AgricultureKpis, GlobalSummaryCards } from '@/features/kpis';
import { ComingSoon } from './components/ComingSoon';



// Lazy load pages
const OverviewPage = React.lazy(() => import('./pages/OverviewPage'));
const IncidentsPage = React.lazy(() => import('./pages/IncidentsPage'));
const InfrastructurePage = React.lazy(() => import('./pages/InfrastructurePage'));
const WarehousePage = React.lazy(() => import('./pages/WarehousePage'));
const CampsPage = React.lazy(() => import('./pages/CampsPage'));
const CompensationPage = React.lazy(() => import('./pages/CompensationPage'));
const LivestockPage = React.lazy(() => import('./pages/LivestockPage'));
const AgriculturePage = React.lazy(() => import('./pages/AgriculturePage'));
const AnalyzePage = React.lazy(() => import('./pages/AnalyzePage'));
const VisualizePage = React.lazy(() => import('./pages/VisualizePage'));
const MonetaryLossPage = React.lazy(() => import('./pages/MonetaryLossPage'));
const CompensationPolicyPage = React.lazy(() => import('./pages/CompensationPolicyPage'));
const BriefPage = React.lazy(() => import('./pages/BriefPage'));

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

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState<User | null>(null);

  const { data: kpiData } = useQuery({
    queryKey: ['cumulative-dashboard'],
    queryFn: getCumulativeDashboard,
  });

  useEffect(() => {
    const token = localStorage.getItem('crux_auth_token');
    const savedUser = localStorage.getItem('crux_user');
    if (token && savedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setUser(null);
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={(userData) => {
      console.log('Login success, user data:', userData);
      setUser(userData);
      setIsLoggedIn(true);
    }} />;
  }

  const renderKpis = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewKpis data={kpiData} />;
      case 'incidents':
        return <IncidentKpis data={kpiData} />;
      case 'infrastructure':
        return null;
      case 'agriculture':
        return <AgricultureKpis />;
      case 'warehouse':
        return <WarehouseKpis data={kpiData} />;
      case 'camps':
        return <CampsKpis data={kpiData} />;
      case 'compensation':
        return <CompensationKpis />;
      case 'livestock':
        return <LivestockKpis />;
      case 'analyze':
      case 'visualize':
      case 'ask-ai':
        return null; // No KPIs for coming soon features
      default:
        return null;
    }
  };

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
      case 'agriculture':
        Component = AgriculturePage;
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
      case 'livestock':
        Component = LivestockPage;
        break;
      case 'analyze':
        Component = AnalyzePage;
        break;
      case 'visualize':
        Component = VisualizePage;
        break;
      case 'monetary-loss':
        Component = MonetaryLossPage;
        break;
      case 'compensation-policy':
        Component = CompensationPolicyPage;
        break;
      case 'ask-ai':
        Component = BriefPage;
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
    <div className="min-h-screen bg-gray-50">
      <OverviewHeader
        reportPeriod={kpiData ? {
          from: '2025-08-15T00:00:00.000Z',
          to: new Date().toISOString()
        } : undefined}
        lastUpdated={kpiData?.lastUpdated}
      />
      {activeTab === 'infrastructure' && (
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 pt-6">
          <GlobalSummaryCards />
        </div>
      )}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6">
        {renderKpis()}
      </div>
      <AppHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userRole={user?.role}
        userName={user?.user_name}
        onLogout={handleLogout}
      />
      <main className="max-w-[1400px] mx-auto px-4 md:px-6 pt-4">
        {renderContent()}
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppContent />} />
      <Route path="/login" element={<AppContent />} />
      <Route path="/overview" element={<AppContent />} />
      <Route path="/incidents" element={<AppContent />} />
      <Route path="/infrastructure" element={<AppContent />} />
      <Route path="/agriculture" element={<AppContent />} />
      <Route path="/warehouse" element={<AppContent />} />
      <Route path="/camps" element={<AppContent />} />
      <Route path="/compensation" element={<AppContent />} />
      <Route path="/livestock" element={<AppContent />} />
      <Route path="/analyze" element={<AppContent />} />
      <Route path="/visualize" element={<AppContent />} />
      <Route path="/monetary-loss" element={<AppContent />} />
      <Route path="/compensation-policy" element={<AppContent />} />
      <Route path="/ask-ai" element={<AppContent />} />
      <Route path="/sources-management" element={<AppContent />} />
      <Route path="/settings" element={<AppContent />} />
    </Routes>
  );
}

export default App;