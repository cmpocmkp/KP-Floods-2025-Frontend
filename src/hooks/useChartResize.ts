import { useEffect, useRef } from 'react';

/**
 * Hook to handle chart resizing when layout changes
 * Listens for the kpd3:layout:changed event and triggers chart resize
 */
export function useChartResize() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleLayoutChange = () => {
      // Small delay to ensure layout has settled
      setTimeout(() => {
        // Trigger window resize event which Recharts listens to
        window.dispatchEvent(new Event('resize'));
      }, 100);
    };

    // Listen for our custom layout change event
    window.addEventListener('kpd3:layout:changed', handleLayoutChange);

    // Also listen for window resize
    window.addEventListener('resize', handleLayoutChange);

    return () => {
      window.removeEventListener('kpd3:layout:changed', handleLayoutChange);
      window.removeEventListener('resize', handleLayoutChange);
    };
  }, []);

  return containerRef;
}

/**
 * Hook for components that need to resize charts when sidebar toggles
 * This is a simpler version that just triggers resize events
 */
export function useChartResizeTrigger() {
  useEffect(() => {
    const handleLayoutChange = () => {
      // Small delay to ensure layout has settled
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
    };

    window.addEventListener('kpd3:layout:changed', handleLayoutChange);
    return () => window.removeEventListener('kpd3:layout:changed', handleLayoutChange);
  }, []);
}
