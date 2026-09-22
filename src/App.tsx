import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LocationProvider } from './context/LocationContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { OTPModal } from './components/ui/OTPModal';

// Pages
import { HomePage } from './features/pages/HomePage';
import { EmergencyPage } from './features/emergency/EmergencyPage';
import { AuthPages } from './features/auth/AuthPages';
import { HospitalSearchPage } from './features/hospitals/HospitalSearchPage';
import { HospitalDetailPage } from './features/hospitals/HospitalDetailPage';
import { DoctorDetailPage } from './features/hospitals/DoctorDetailPage';
import { PatientDashboard } from './features/dashboard/PatientDashboard';
import { DoctorDashboard } from './features/dashboard/DoctorDashboard';
import { HospitalAdminDashboard } from './features/dashboard/HospitalAdminDashboard';
import { AIChatbotPage } from './features/ai-chatbot/AIChatbotPage';
import { StaticPages } from './features/pages/StaticPages';

const MainAppContent: React.FC = () => {
  const { currentRole } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);

  const handleNavigate = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectHospital = (id: string) => {
    setSelectedHospitalId(id);
    setCurrentTab('hospital-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDoctor = (id: string) => {
    setSelectedDoctorId(id);
    setCurrentTab('doctor-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      <Navbar currentTab={currentTab} onNavigate={handleNavigate} />

      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectHospital={handleSelectHospital}
            onSelectDoctor={handleSelectDoctor}
          />
        )}

        {currentTab === 'emergency' && <EmergencyPage />}

        {currentTab === 'login' && (
          <AuthPages initialMode="login" onSuccessNavigate={handleNavigate} />
        )}

        {currentTab === 'register' && (
          <AuthPages initialMode="register" onSuccessNavigate={handleNavigate} />
        )}

        {currentTab === 'hospitals' && (
          <HospitalSearchPage
            onSelectHospital={handleSelectHospital}
            onSelectDoctor={handleSelectDoctor}
          />
        )}

        {currentTab === 'doctors' && (
          <HospitalSearchPage
            onSelectHospital={handleSelectHospital}
            onSelectDoctor={handleSelectDoctor}
          />
        )}

        {currentTab === 'hospital-detail' && selectedHospitalId && (
          <HospitalDetailPage
            hospitalId={selectedHospitalId}
            onBack={() => handleNavigate('hospitals')}
            onSelectDoctor={handleSelectDoctor}
          />
        )}

        {currentTab === 'doctor-detail' && selectedDoctorId && (
          <DoctorDetailPage
            doctorId={selectedDoctorId}
            onBack={() => handleNavigate('doctors')}
          />
        )}

        {currentTab === 'patient-dashboard' && (
          <PatientDashboard
            onNavigate={handleNavigate}
            onSelectDoctor={handleSelectDoctor}
          />
        )}

        {currentTab === 'doctor-dashboard' && <DoctorDashboard />}

        {currentTab === 'admin-dashboard' && <HospitalAdminDashboard />}

        {currentTab === 'ai-chatbot' && (
          <AIChatbotPage
            onNavigate={handleNavigate}
            onSelectDoctor={handleSelectDoctor}
          />
        )}

        {(currentTab === 'about' ||
          currentTab === 'contact' ||
          currentTab === 'faq' ||
          currentTab === 'privacy' ||
          currentTab === 'terms' ||
          currentTab === 'mediclaim') && (
          <StaticPages type={currentTab === 'mediclaim' ? 'about' : (currentTab as any)} />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
      <OTPModal />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <LocationProvider>
        <AuthProvider>
          <ToastProvider>
            <MainAppContent />
          </ToastProvider>
        </AuthProvider>
      </LocationProvider>
    </ThemeProvider>
  );
}

export default App;
