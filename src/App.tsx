import React, { useState, useEffect } from 'react';
import {
  AppScreen,
  LanguageCode,
  AccessibilitySettings,
  UserProfile,
  AuthUser
} from './types';
import { LANGUAGES } from './data/firstAidData';
import { Navbar } from './components/Navbar';
import { BottomNavigation } from './components/BottomNavigation';
import { HomeDashboard } from './components/HomeDashboard';
import { AIChat } from './components/AIChat';
import { FirstAidLibrary } from './components/FirstAidLibrary';
import { SafetyScanner } from './components/SafetyScanner';
import { EmergencyContactsView } from './components/EmergencyContactsView';
import { ProfileView } from './components/ProfileView';
import { AdminPortal } from './components/AdminPortal';
import { BookingsView } from './components/BookingsView';
import { AuthModal, DEMO_USERS } from './components/AuthModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { Footer } from './components/Footer';
import { SOSModal } from './components/SOSModal';
import { AccessibilityPanel } from './components/AccessibilityPanel';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [screenParams, setScreenParams] = useState<any>({});

  // Auth State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('carepulse_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    // Default to initial student account
    return DEMO_USERS[0];
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);

  // Theme State - Default to clean light mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('safeaid_theme');
    if (saved) return saved === 'dark';
    return false;
  });

  // Accessibility Settings
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('safeaid_accessibility');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      textSize: 'normal',
      contrast: 'normal',
      voiceAssistance: true,
      selectedLanguage: 'en',
    };
  });

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('safeaid_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      name: 'Alex Rivera',
      studentId: 'UNIV-2026-8942',
      dormLocation: 'West Hall, STEM Room 304',
      bloodGroup: 'O+',
      allergies: 'Mild Penicillin sensitivity, seasonal pollen',
      medicalNotes: 'Carries mild asthma inhaler for sports.',
      primaryEmergencyContact: 'Sarah Rivera (Parent)',
      primaryEmergencyPhone: '(555) 019-2424',
    };
  });

  // Modals
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);

  // Sync theme with document class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('safeaid_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('safeaid_theme', 'light');
    }
  }, [isDarkMode]);

  // Persist user auth
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('carepulse_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('carepulse_user');
    }
  }, [currentUser]);

  // Persist accessibility
  useEffect(() => {
    localStorage.setItem('safeaid_accessibility', JSON.stringify(accessibility));
  }, [accessibility]);

  // Persist profile
  useEffect(() => {
    localStorage.setItem('safeaid_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  const handleNavigate = (screen: AppScreen, params: any = {}) => {
    setCurrentScreen(screen);
    setScreenParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    setUserProfile((prev) => ({
      ...prev,
      name: user.name,
      studentId: user.studentId || prev.studentId,
      dormLocation: user.dormLocation || prev.dormLocation,
      bloodGroup: user.bloodGroup || prev.bloodGroup,
      allergies: user.allergies || prev.allergies,
      medicalNotes: user.medicalNotes || prev.medicalNotes,
      primaryEmergencyContact: user.primaryEmergencyContact || prev.primaryEmergencyContact,
      primaryEmergencyPhone: user.primaryEmergencyPhone || prev.primaryEmergencyPhone,
    }));
  };

  const handleAdminAuthSuccess = (adminUser: AuthUser) => {
    setCurrentUser(adminUser);
    handleNavigate('admin');
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    if (currentScreen === 'admin') {
      setCurrentScreen('home');
    }
  };

  const handleUpdateAccessibility = (updates: Partial<AccessibilitySettings>) => {
    setAccessibility((prev) => ({ ...prev, ...updates }));
  };

  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
    if (currentUser) {
      setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const selectedLangObj =
    LANGUAGES.find((l) => l.code === accessibility.selectedLanguage) || LANGUAGES[0];

  // Font sizing class helper
  const getTextSizeClass = () => {
    switch (accessibility.textSize) {
      case 'large':
        return 'text-[17px]';
      case 'xlarge':
        return 'text-[19px]';
      default:
        return 'text-[15px]';
    }
  };

  // Contrast class helper
  const getContrastClass = () => {
    if (accessibility.contrast === 'high') {
      return isDarkMode ? 'contrast-125 bg-black text-white' : 'contrast-125 bg-slate-100 text-black';
    }
    return '';
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between transition-colors duration-300 ${
        isDarkMode
          ? 'bg-slate-950 text-slate-100'
          : 'bg-gradient-to-br from-slate-50 via-cyan-50/20 to-indigo-50/20 text-slate-800'
      } ${getTextSizeClass()} ${getContrastClass()}`}
    >
      <div>
        {/* Top Navbar */}
        <Navbar
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          onOpenSos={() => setIsSosOpen(true)}
          onOpenAccessibility={() => setIsAccessibilityOpen(true)}
          selectedLanguage={accessibility.selectedLanguage}
          onSelectLanguage={(lang) => handleUpdateAccessibility({ selectedLanguage: lang })}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onSignOut={handleSignOut}
        />

        {/* Main Screen Container with Accessible Landmark */}
        <main 
          id="main-content" 
          role="main" 
          tabIndex={-1} 
          aria-label="CarePulse Core Operations" 
          className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-20 lg:pb-8 focus:outline-none"
        >
          {/* Accessible Screen Reader Live Announcer */}
          <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            {`Currently viewing ${currentScreen} section in CarePulse`}
          </div>

          <ErrorBoundary>
            {currentScreen === 'home' && (
              <HomeDashboard
                onNavigate={handleNavigate}
                onOpenSos={() => setIsSosOpen(true)}
                onOpenVoice={() => handleNavigate('chat', { autoVoice: true })}
                selectedLanguageName={selectedLangObj.name}
              />
            )}

            {currentScreen === 'bookings' && (
              <BookingsView
                currentUser={currentUser}
                onNavigate={handleNavigate}
                onOpenAuth={() => setIsAuthModalOpen(true)}
              />
            )}

            {currentScreen === 'chat' && (
              <AIChat
                initialPrompt={screenParams.prompt}
                initialImage={screenParams.image}
                onOpenSos={() => setIsSosOpen(true)}
                onContactHealth={() => handleNavigate('contacts')}
                onFindNearby={() => handleNavigate('contacts')}
                selectedLanguageName={selectedLangObj.name}
              />
            )}

            {currentScreen === 'library' && (
              <FirstAidLibrary
                onOpenSos={() => setIsSosOpen(true)}
                onContactHealth={() => handleNavigate('contacts')}
                selectedLanguage={accessibility.selectedLanguage}
                onSelectLanguage={(lang) => handleUpdateAccessibility({ selectedLanguage: lang })}
                initialGuideId={screenParams.guideId}
              />
            )}

            {currentScreen === 'scanner' && (
              <SafetyScanner
                onContactSecurity={() => handleNavigate('contacts')}
                onOpenSos={() => setIsSosOpen(true)}
              />
            )}

            {currentScreen === 'contacts' && (
              <EmergencyContactsView onOpenSos={() => setIsSosOpen(true)} />
            )}

            {currentScreen === 'profile' && (
              <ProfileView
                userProfile={userProfile}
                onUpdateProfile={handleUpdateProfile}
                accessibilitySettings={accessibility}
                onOpenAccessibilityModal={() => setIsAccessibilityOpen(true)}
                currentUser={currentUser}
                onOpenAuth={() => setIsAuthModalOpen(true)}
                onSignOut={handleSignOut}
              />
            )}

            {currentScreen === 'admin' && (
              <AdminPortal
                currentUser={
                  currentUser && currentUser.role === 'admin'
                    ? currentUser
                    : {
                        id: 'master-admin-session',
                        name: 'Campus Safety Administrator',
                        email: 'admin@campus-safety.edu',
                        role: 'admin',
                        department: 'Campus Safety & Emergency Operations',
                      }
                }
                onNavigateHome={() => handleNavigate('home')}
                onSignOut={handleSignOut}
              />
            )}
          </ErrorBoundary>
        </main>
      </div>

      {/* Footer with Dedicated Admin Sign-up & Login Link */}
      <Footer
        onNavigate={handleNavigate}
        onOpenSos={() => setIsSosOpen(true)}
        onOpenAccessibility={() => setIsAccessibilityOpen(true)}
        onOpenAdminAuth={() => setIsAdminAuthOpen(true)}
        currentUser={currentUser}
      />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNavigation
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        onOpenSos={() => setIsSosOpen(true)}
      />

      {/* SOS Emergency Modal */}
      <SOSModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        userLocation={userProfile.dormLocation || 'Campus STEM Center'}
        trustedContactName={userProfile.primaryEmergencyContact}
        trustedPhone={userProfile.primaryEmergencyPhone}
      />

      {/* Accessibility Preferences Panel */}
      <AccessibilityPanel
        settings={accessibility}
        onUpdateSettings={handleUpdateAccessibility}
        isOpen={isAccessibilityOpen}
        onClose={() => setIsAccessibilityOpen(false)}
      />

      {/* Standard User / Student Sign In / Sign Up Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />

      {/* Dedicated Single-Slot Master Admin Auth Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        onAdminAuthenticated={handleAdminAuthSuccess}
      />
    </div>
  );
}
