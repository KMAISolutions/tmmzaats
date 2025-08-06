import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import UploadAndAnalyze from './components/UploadAndAnalyze';
import RealTimeCvBuilder from './components/RealTimeCvBuilder';
import CoverLetterGenerator from './components/CoverLetterGenerator';
import InterviewPrep from './components/InterviewPrep';
import SalaryBenchmark from './components/SalaryBenchmark';
import ApplicationTracker from './components/ApplicationTracker';
import MultilingualCv from './components/MultilingualCv';
import Networking from './components/Networking';
import Settings from './components/Settings';
import JobMatch from './components/JobMatch';
import AdminDashboard from './components/AdminDashboard';
import ComingSoon from './components/ComingSoon'; // Import the new ComingSoon component
import { MenuIcon, LogoIcon, ShieldCheckIcon, FacebookIcon, WhatsappIcon } from './components/icons';
import AdminAuthModal from './components/AdminAuthModal';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState('Dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    // Set theme on initial load
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint in tailwind
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigate = (page: string) => {
    setActivePage(page);
    if (window.innerWidth < 1024) {
        setSidebarOpen(false);
    }
  };

  const handleAdminClick = () => {
    setAuthModalOpen(true);
  };

  const handleAdminAuthSuccess = () => {
    setAuthModalOpen(false);
    handleNavigate('Admin');
  };


  const renderContent = () => {
    switch (activePage) {
      case 'Dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'Job Board':
        return <ComingSoon featureName="Job Board" />; // Render ComingSoon
      case 'Upload & Analyze CV':
        return <UploadAndAnalyze />;
      case 'Real-Time CV Builder':
        return <RealTimeCvBuilder />;
      case 'Cover Letter Generator':
        return <CoverLetterGenerator />;
      case 'Interview Prep':
        return <InterviewPrep />;
      case 'Salary Benchmark':
        return <SalaryBenchmark />;
      case 'Application Tracker':
        return <ComingSoon featureName="Application Tracker" />; // Render ComingSoon
      case 'Multilingual CV':
        return <MultilingualCv />;
      case 'Networking':
        return <Networking />;
      case 'Settings':
        return <Settings />;
      case 'Admin':
        return <AdminDashboard onNavigate={handleNavigate} />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-brand-light-gray dark:bg-black font-sans text-brand-charcoal dark:text-white">
      {isSidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          aria-hidden="true"
        ></div>
      )}

      <Sidebar activePage={activePage} onNavigate={handleNavigate} isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
      
      <main className="flex-1 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col min-w-0">
        <header className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0">
            <div className="flex items-center gap-4">
                <button onClick={() => setSidebarOpen(true)} aria-label="Open sidebar" className="lg:hidden">
                    <MenuIcon className="h-6 w-6" />
                </button>
                
                {/* Mobile Header Title */}
                <div className="flex items-center gap-2 lg:hidden">
                    <LogoIcon className="h-6 w-6 text-brand-charcoal dark:text-white" />
                    <h1 className="text-lg font-bold dark:text-white tracking-tighter">The Middle Man ZA</h1>
                </div>

                {/* Desktop Header Title */}
                <h1 className="text-xl font-bold dark:text-white tracking-tighter hidden lg:block">{activePage}</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <a href="https://www.facebook.com/groups/352254759773693/?ref=share&mibextid=NSMWBT" target="_blank" rel="noopener noreferrer" aria-label="Facebook page" className="text-zinc-500 hover:text-brand-charcoal dark:hover:text-white transition-colors">
                  <FacebookIcon className="h-5 w-5" />
              </a>
              <a href="https://chat.whatsapp.com/BtmJB7odtF1DSMAAKLnnrg" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-zinc-500 hover:text-brand-charcoal dark:hover:text-white transition-colors">
                  <WhatsappIcon className="h-5 w-5" />
              </a>
              <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700"></div>
              <button
                  onClick={handleAdminClick}
                  className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-white font-semibold py-1.5 px-3 rounded-lg inline-flex items-center gap-2 transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-sm"
                  aria-label="Admin Access"
              >
                  <ShieldCheckIcon className="h-5 w-5" />
                  <span className="hidden sm:inline">Admin</span>
              </button>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto">
            {renderContent()}
        </div>

        <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 text-xs text-zinc-500 border-t border-zinc-200 dark:border-zinc-800 flex-shrink-0">
            <span>Powered By: <a href="https://www.kwenamai.co.za" target="_blank" rel="noopener noreferrer" className="hover:text-brand-charcoal dark:hover:text-white transition-colors">Kwena Moloto A.I Solutions</a></span>
            <div className="flex items-center gap-4">
              <a href="https://www.facebook.com/groups/352254759773693/?ref=share&mibextid=NSMWBT" target="_blank" rel="noopener noreferrer" aria-label="Facebook page" className="text-zinc-500 hover:text-brand-charcoal dark:hover:text-white transition-colors">
                  <FacebookIcon className="h-5 w-5" />
              </a>
              <a href="https://chat.whatsapp.com/BtmJB7odtF1DSMAAKLnnrg" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-zinc-500 hover:text-brand-charcoal dark:hover:text-white transition-colors">
                  <WhatsappIcon className="h-5 w-5" />
              </a>
            </div>
        </footer>
      </main>

       <AdminAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAdminAuthSuccess}
      />
    </div>
  );
};

export default App;