import Sidebar from '../../components/client/Sidebar';
import Header from '../../components/client/Dashboard/Header';
import StatsGrid from '../../components/client/Dashboard/StatsGrid';
import WeeklyChallenge from '../../components/client/Dashboard/WeeklyCahllenge';
import WorkoutLevels from '../../components/client/Dashboard/WorkoutLevels';
import Leaderboard from '../../components/client/Dashboard/LeaderBoard';
import ChatbotButton from '../../components/client/Dashboard/ChatbotButton';
import { useEffect } from 'react';

const CDashboard = () => {
  useEffect(() => {
    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('ServiceWorker registration successful',registration);
          })
          .catch((err) => {
            console.log('ServiceWorker registration failed: ', err);
          });
      });
    }

    // Handle install prompt
    let deferredPrompt:any;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      setTimeout(() => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then((choiceResult:any) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('User accepted install');
            } else {
              console.log('User dismissed install');
            }
            deferredPrompt = null;
          });
        }
      }, 3000);
    });
  }, []);

  return (
    <div className="bg-[#12151E] text-white min-h-screen font-sans">
      <Sidebar />
      <main className="lg:ml-[280px] pt-[70px] lg:pt-0 p-4 lg:p-8 transition-all">
        <Header />
        <StatsGrid />
        <WeeklyChallenge />
        <WorkoutLevels />
        <Leaderboard />
        <ChatbotButton />
      </main>
    </div>
  );
};

export default CDashboard;