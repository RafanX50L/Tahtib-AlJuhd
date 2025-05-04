import Sidebar from '../../components/trainer/Sidebar';
import Header from '../../components/trainer/Dashboard/Header';
import StatsGrid from '../../components/trainer/Dashboard/StatsGrid';
import PerformanceTrends from '../../components/trainer/Dashboard/PerfomanceTrends';
import PaymentHistory from '../../components/trainer/Dashboard/PaymentHistory';
import { useEffect } from 'react';

const TDashboard = () => {
  useEffect(() => {
    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('ServiceWorker registration successful');
          })
          .catch((err) => {
            console.log('ServiceWorker registration failed: ', err);
          });
      });
    }
  }, []);

  return (
    <div className="min-h-screen flex font-sans bg-[#121212] text-[#ffffff]">
      <Sidebar />
      <main className="flex-1 ml-0 lg:ml-[280px] p-4 lg:p-8">
        <Header />
        <StatsGrid />
        <PerformanceTrends />
        <PaymentHistory />
      </main>
    </div>
  );
};

export default TDashboard;