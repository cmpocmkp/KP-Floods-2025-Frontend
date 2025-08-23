import React, { useState, useEffect, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Login from './pages/auth/LoginPage';
import { AppHeader } from './components/Layout/AppHeader';
import { OverviewHeader } from './features/overview/OverviewHeader';
import { OverviewKpis, IncidentKpis, InfrastructureKpis, WarehouseKpis, CampsKpis, CompensationKpis } from '@/features/kpis';



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

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState<User | null>(null);

  const { data: kpiData } = useQuery({
    queryKey: ['kpi-data', activeTab],
    queryFn: () => Promise.resolve({
      // Overview KPIs
      deaths: 156,
      injured: 342,
      housesDamaged: 1245,
      livestockLost: 789,
      // Incidents KPIs
      totalIncidents: 248,
      criticalIncidents: 42,
      floodIncidents: 156,
      recentIncidents: 18,
      // Infrastructure KPIs
      roadsDamaged: 342,
      bridgesDamaged: 28,
      culvertsDamaged: 156,
      avgRestorationDays: 45,
      // Warehouse KPIs
      totalItems: 12450,
      itemsIssued: 8234,
      itemsRequested: 2156,
      lowStockItems: 18,
      // Camps KPIs
      totalCamps: 86,
      districtsWithCamps: 12,
      totalOccupants: 12450,
      capacityUtilization: 78,
      // Compensation KPIs
      totalBeneficiaries: 2160,
      beneficiariesPaid: 840,
      amountDisbursed: 420000000,
      pendingCases: 1320,
    })
  });

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
        return <InfrastructureKpis data={kpiData} />;
      case 'warehouse':
        return <WarehouseKpis data={kpiData} />;
      case 'camps':
        return <CampsKpis data={kpiData} />;
      case 'compensation':
        return <CompensationKpis data={kpiData} />;
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
    <div className="min-h-screen bg-gray-50">
      <OverviewHeader 
        reportPeriod={{
          start: '2025-08-14',
          end: '2025-08-20'
        }}
        lastUpdated="2025-08-20T10:52:00Z"
      />
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
      <Route path="/warehouse" element={<AppContent />} />
      <Route path="/camps" element={<AppContent />} />
      <Route path="/compensation" element={<AppContent />} />
      <Route path="/sources-management" element={<AppContent />} />
      <Route path="/settings" element={<AppContent />} />
    </Routes>
  );
}

export default App;