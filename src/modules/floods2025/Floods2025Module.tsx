import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import OverviewPage from '@/pages/OverviewPage';
import IncidentsPage from '@/pages/IncidentsPage';
import InfrastructurePage from '@/pages/InfrastructurePage';
import WarehousePage from '@/pages/WarehousePage';
import CampsPage from '@/pages/CampsPage';
import CompensationPage from '@/pages/CompensationPage';
import LivestockPage from '@/pages/LivestockPage';
import AgriculturePage from '@/pages/AgriculturePage';
import AnalyzePage from '@/pages/AnalyzePage';
import VisualizePage from '@/pages/VisualizePage';
import MonetaryLossPage from '@/pages/MonetaryLossPage';
import CompensationPolicyPage from '@/pages/CompensationPolicyPage';
import BriefPage from '@/pages/BriefPage';
import TestReportPage from '@/pages/TestReportPage';
import SourcesManagement from '@/components/SourcesManagement/SourcesManagement';
import { AppHeader } from '@/components/Layout/AppHeader';
import { useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCumulativeDashboard } from '@/lib/overview';
import { 
  OverviewKpis, 
  IncidentKpis, 
  InfrastructureKpis,
  WarehouseKpis, 
  CampsKpis, 
  CompensationKpis, 
  LivestockKpis, 
  AgricultureKpis 
} from '@/features/kpis';

// This component wraps the existing app content with the new routing structure
export default function Floods2025Module() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the active tab from the current path - memoized to prevent re-renders
  const activeTab = useMemo(() => {
    return location.pathname.split('/').pop() || 'overview';
  }, [location.pathname]);
  
  // Handle sidebar collapse state for proper spacing
  const collapsed = useMemo(
    () => (typeof window !== "undefined" && localStorage.getItem("kpd3.sidebar.collapsed")==="1"),
    []
  );
  const pad = collapsed ? "md:pl-20" : "md:pl-72";

  // Fetch KPI data
  const { data: kpiData } = useQuery({
    queryKey: ['cumulative-dashboard'],
    queryFn: getCumulativeDashboard,
  });
  
  // Handle tab change - actually navigate to the route
  const handleTabChange = useCallback((tab: string) => {
    navigate(`/floods-2025/${tab}`);
  }, [navigate]);
  
  // Handle logout
  const handleLogout = useCallback(() => {
    window.dispatchEvent(new CustomEvent("kpd3:signout"));
  }, []);

  // Render KPI components based on active tab - memoized to prevent re-renders
  const renderKpis = useCallback(() => {
    switch (activeTab) {
      case 'overview':
        return <OverviewKpis data={kpiData} />;
      case 'incidents':
        return <IncidentKpis data={kpiData} />;
      case 'infrastructure':
        return <InfrastructureKpis />;
      case 'warehouse':
        return <WarehouseKpis data={kpiData} />;
      case 'camps':
        return <CampsKpis data={kpiData} />;
      case 'compensation':
        return <OverviewKpis data={kpiData} />; // Use same KPIs as overview
      case 'livestock':
        return <LivestockKpis />;
      case 'agriculture':
        return <AgricultureKpis />;
      case 'analyze':
        return <OverviewKpis data={kpiData} />; // Use overview KPIs for analyze
      case 'visualize':
        return <OverviewKpis data={kpiData} />; // Use overview KPIs for visualize
      case 'monetary-loss':
        return <OverviewKpis data={kpiData} />; // Use overview KPIs for monetary loss
      case 'compensation-policy':
        return <OverviewKpis data={kpiData} />; // Use overview KPIs for compensation policy
      case 'brief':
        return <OverviewKpis data={kpiData} />; // Use overview KPIs for flood assistant
      default:
        return <OverviewKpis data={kpiData} />;
    }
  }, [activeTab, kpiData]);
  
  return (
    <div className={`min-h-screen bg-slate-50 ${pad}`}>
      {/* Blue header above KPI cards */}
      <div className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white px-6 py-4 shadow-md">
        <h1 className="text-2xl font-bold">KP Floods 2025</h1>
      </div>
      
      {/* Render KPI cards above the tab list */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        {renderKpis()}
      </div>
      
      <AppHeader 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        onLogout={handleLogout} 
      />
      <main className="pt-4">
        <div className="px-4 pb-8">
          <Routes>
            <Route path="brief" element={<BriefPage />} />
            <Route path="incidents" element={<IncidentsPage />} />
            <Route path="infrastructure" element={<InfrastructurePage />} />
            <Route path="warehouse" element={<WarehousePage />} />
            <Route path="camps" element={<CampsPage />} />
            <Route path="compensation" element={<CompensationPage />} />
            <Route path="livestock" element={<LivestockPage />} />
            <Route path="agriculture" element={<AgriculturePage />} />
            <Route path="analyze" element={<AnalyzePage />} />
            <Route path="visualize" element={<VisualizePage />} />
            <Route path="monetary-loss" element={<MonetaryLossPage />} />
            <Route path="compensation-policy" element={<CompensationPolicyPage />} />
            <Route path="test-report" element={<TestReportPage />} />
            <Route path="sources" element={<SourcesManagement />} />
            <Route index element={<OverviewPage />} />
            <Route path="*" element={<OverviewPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
