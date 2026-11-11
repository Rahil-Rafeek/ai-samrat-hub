import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { PublicLandingPage } from './pages/PublicLandingPage';
import { LoginPage } from './pages/LoginPage';
import { AccountActivationPage } from './pages/AccountActivationPage';
import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { ExamInstructionsPage } from './pages/ExamInstructionsPage';
import { EmployeeCertificatesPage } from './pages/EmployeeCertificatesPage';
import { EmployeeSkillPassport } from './components/employee/EmployeeSkillPassport';
import { AdminDashboard } from './pages/AdminDashboard';
import { ExamRoom } from './pages/ExamRoom';
import { SubmissionResultPage } from './pages/SubmissionResultPage';
import { CertificateVerificationPage } from './pages/CertificateVerificationPage';
import { CodeAssessmentView } from './components/coding/CodeAssessmentView';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Examination, ActiveExam, SubmitExamResponse } from './types';
import { proctoringMedia } from './services/proctoring';

export const App: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [loginInitialMode, setLoginInitialMode] = useState<'register' | 'login'>('login');

  // Exam flow states
  const [selectedExamForInstructions, setSelectedExamForInstructions] = useState<Examination | null>(null);
  const [activeExamData, setActiveExamData] = useState<ActiveExam | null>(null);
  const [examResult, setExamResult] = useState<SubmitExamResponse | null>(null);

  // Certificate verify code state
  const [verifyCode, setVerifyCode] = useState<string>('');

  // Activation token state
  const [activationToken, setActivationToken] = useState<string>('');

  // Check URL on load for activation or verification links
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenParam = urlParams.get('token');
      const certParam = urlParams.get('cert') || urlParams.get('code');

      if (tokenParam || window.location.pathname.includes('activate')) {
        if (tokenParam) setActivationToken(tokenParam);
        setCurrentView('activate');
      } else if (certParam) {
        setVerifyCode(certParam);
        setCurrentView('verify');
      }
    }
  }, []);

  // When user logs in, immediately redirect from login/landing/activate to dashboard (first part of main navigation)
  useEffect(() => {
    if (user && (currentView === 'login' || currentView === 'landing' || currentView === 'activate')) {
      setCurrentView('dashboard');
    }
  }, [user, currentView]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] flex items-center justify-center text-slate-500">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-600">
            Initializing AI SAMRAT Assessment Hub...
          </span>
        </div>
      </div>
    );
  }

  // ==========================================
  // UNATHENTICATED PUBLIC WORKFLOWS
  // ==========================================

  // Account Activation Page (Accessible via invitation link / public)
  if (currentView === 'activate') {
    return (
      <AccountActivationPage
        initialToken={activationToken}
        onActivated={() => setCurrentView('login')}
        onGoToLogin={() => setCurrentView('login')}
      />
    );
  }

  // Public Certificate Verification View
  if (currentView === 'verify' && !user) {
    return (
      <CertificateVerificationPage
        initialCode={verifyCode}
        onBack={() => setCurrentView('landing')}
      />
    );
  }

  // Not Logged In
  if (!user) {
    if (currentView === 'login') {
      return (
        <LoginPage
          initialMode={loginInitialMode}
          onBackToLanding={() => setCurrentView('landing')}
          onVerifyClick={() => {
            setVerifyCode('');
            setCurrentView('verify');
          }}
          onActivateClick={() => {
            setActivationToken('');
            setCurrentView('activate');
          }}
        />
      );
    }

    // Default unauthenticated view: Public Landing & Verification Interface (INTERFACE 1)
    return (
      <PublicLandingPage
        onGoToLogin={() => {
          setLoginInitialMode('login');
          setCurrentView('login');
        }}
        onGoToRegister={() => {
          setLoginInitialMode('register');
          setCurrentView('login');
        }}
        onGoToVerify={(code) => {
          if (code) setVerifyCode(code);
          setCurrentView('verify');
        }}
      />
    );
  }

  // ==========================================
  // AUTHENTICATED WORKFLOWS
  // ==========================================

  // Interface 4: Distinct Examination Instructions & Pre-Flight Diagnostic
  if (selectedExamForInstructions) {
    return (
      <ExamInstructionsPage
        examination={selectedExamForInstructions}
        onProceed={(active) => {
          setSelectedExamForInstructions(null);
          setActiveExamData(active);
        }}
        onCancel={() => setSelectedExamForInstructions(null)}
      />
    );
  }

  // Interface 5: Live Examination Room (3-Warning Policy, Real-Time Proctoring, Palette)
  if (activeExamData) {
    return (
      <ExamRoom
        initialExamData={activeExamData}
        onSubmitSuccess={(result) => {
          proctoringMedia.stopAll();
          try {
            if (typeof document !== 'undefined' && document.fullscreenElement) {
              document.exitFullscreen().catch(() => {});
            }
          } catch {}
          setActiveExamData(null);
          setExamResult(result);
          setCurrentView('result');
        }}
        onExit={() => {
          proctoringMedia.stopAll();
          try {
            if (typeof document !== 'undefined' && document.fullscreenElement) {
              document.exitFullscreen().catch(() => {});
            }
          } catch {}
          setActiveExamData(null);
          setCurrentView('dashboard');
        }}
      />
    );
  }

  // Interface 7: Post-Submission Results & Performance Scorecard
  if (currentView === 'result' && examResult) {
    return (
      <SubmissionResultPage
        result={examResult}
        onReturnDashboard={() => {
          setExamResult(null);
          setCurrentView('dashboard');
        }}
        onVerifyCertificate={(code) => {
          setVerifyCode(code);
          setCurrentView('verify');
        }}
      />
    );
  }

  // Authenticated Portal Layout (Warm-White Enterprise SaaS Design)
  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col text-slate-800 selection:bg-blue-100 selection:text-blue-900">
      <Navbar
        onNavigate={(view) => setCurrentView(view)}
        activeView={currentView}
      />

      <div className="flex-1 flex">
        <Sidebar
          currentView={currentView}
          onSelectView={(view) => setCurrentView(view)}
        />

        <main className="flex-1 overflow-y-auto">
          {currentView === 'coding' && (
            <div className="p-6">
              <CodeAssessmentView />
            </div>
          )}

          {currentView === 'verify' && (
            <CertificateVerificationPage
              initialCode={verifyCode}
              onBack={() => setCurrentView('dashboard')}
            />
          )}

          {/* Interface 3: Employee Dashboard (Default to My Assessments - first part of navigation) */}
          {user.role === 'EMPLOYEE' && (currentView === 'dashboard' || !['skillmatrix', 'coding', 'certificates', 'verify'].includes(currentView)) && (
            <EmployeeDashboard
              onStartExam={(exam) => setSelectedExamForInstructions(exam)}
              onViewCertificates={() => setCurrentView('certificates')}
              onViewSkillMatrix={() => setCurrentView('skillmatrix')}
            />
          )}

          {/* Interface 8: Employee Certificates Registry */}
          {user.role === 'EMPLOYEE' && currentView === 'certificates' && (
            <EmployeeCertificatesPage
              onGoToExams={() => setCurrentView('dashboard')}
              onVerifyCertificate={(code) => {
                setVerifyCode(code);
                setCurrentView('verify');
              }}
            />
          )}

          {/* Skill Passport & Matrix View */}
          {user.role === 'EMPLOYEE' && currentView === 'skillmatrix' && (
            <EmployeeSkillPassport />
          )}

          {/* Interfaces 9-18: Super Admin & Evaluator Command Modules */}
          {(user.role === 'SUPER_ADMIN' || user.role === 'EVALUATOR') && (
            <AdminDashboard initialTab={
              ['dashboard', 'login', 'landing'].includes(currentView)
                ? (user.role === 'EVALUATOR' ? 'submissions' : 'overview')
                : currentView
            } />
          )}
        </main>
      </div>
    </div>
  );
};
