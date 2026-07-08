import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Home, BookOpen, BarChart3, Settings, LogOut, CheckCircle2 } from 'lucide-react';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { PlotRecord, LoginLog } from './types';

// Import components
import LoginScreen from './components/LoginScreen';
import OverviewTab from './components/OverviewTab';
import RecordTab from './components/RecordTab';
import ReportTab from './components/ReportTab';
import SettingsTab from './components/SettingsTab';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'record' | 'report' | 'settings'>('home');
  const [plots, setPlots] = useState<PlotRecord[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginLog[]>([]);
  const [showNotification, setShowNotification] = useState(false);

  // Helper to extract email prefix for avatar initials
  const getInitials = () => {
    if (!user || !user.email) return 'AD';
    const prefix = user.email.split('@')[0];
    return prefix.slice(0, 2).toUpperCase();
  };

  // Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  // Real-time Firestore Sync for Plot Records
  useEffect(() => {
    if (!user) return;

    const plotsRef = collection(db, 'plots');
    const q = query(plotsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const records: PlotRecord[] = [];
        snapshot.forEach((doc) => {
          records.push({ id: doc.id, ...doc.data() } as PlotRecord);
        });
        setPlots(records);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'plots');
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Real-time Firestore Sync for Login History
  useEffect(() => {
    if (!user) return;

    const historyRef = collection(db, 'login_history');
    const q = query(historyRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const logs: LoginLog[] = [];
        snapshot.forEach((doc) => {
          logs.push({ id: doc.id, ...doc.data() } as LoginLog);
        });
        setLoginHistory(logs);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'login_history');
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setActiveTab('home');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const triggerNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 4000);
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9ff]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-slate-500">กำลังเชื่อมต่อฐานข้อมูล Firebase...</p>
        </div>
      </div>
    );
  }

  // Not signed in
  if (!user) {
    return <LoginScreen onLoginSuccess={(u) => setUser(u)} />;
  }

  return (
    <div className="max-w-md mx-auto bg-slate-50 min-h-screen relative border-x border-slate-200/60 shadow-[0_0_50px_rgba(0,0,0,0.03)]">
      {/* Dynamic Slide-down alert */}
      {showNotification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-blue-400" />
          <span>บันทึกข้อมูลแปลงทดลองสำเร็จ!</span>
        </div>
      )}

      {/* Top Header App Bar */}
      <header className="bg-white/90 backdrop-blur-md px-6 py-4 border-b border-slate-200/60 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center text-white">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
              <path d="M19 19c0 .55-.45 1-1 1s-1-.45-1-1v-3h-2v3c0 .55-.45 1-1 1s-1-.45-1-1v-3h-2v3c0 .55-.45 1-1 1s-1-.45-1-1v-5h8v5zm-1-7h-8v-2h8v2zm-4-4c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm4-4h-8V2h8v2z"/>
            </svg>
          </div>
          <span className="font-bold text-slate-900 tracking-tight text-sm">test-database-01</span>
        </div>
        
        {/* User avatar and profile */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-[11px] text-slate-700" title={user?.email}>
            {getInitials()}
          </div>
          <button onClick={handleLogout} className="p-1.5 text-slate-400 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-100">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container Workspace for active tab */}
      <main className="p-6">
        {activeTab === 'home' && (
          <OverviewTab
            plots={plots}
            onNavigateToTab={(tab) => setActiveTab(tab as any)}
            user={user}
          />
        )}
        {activeTab === 'record' && (
          <RecordTab
            onRecordSuccess={triggerNotification}
            user={user}
          />
        )}
        {activeTab === 'report' && (
          <ReportTab
            plots={plots}
          />
        )}
        {activeTab === 'settings' && (
          <SettingsTab
            plots={plots}
            loginHistory={loginHistory}
            onLogout={handleLogout}
            user={user}
          />
        )}
      </main>

      {/* Bottom Floating Navigation Dock */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200/60 px-4 py-3 flex justify-around items-center z-30 shadow-[0_-4px_24px_rgba(0,0,0,0.02)] rounded-t-2xl">
        {/* Tab 1: Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1.5 py-1 px-3 rounded-xl transition-all ${activeTab === 'home' ? 'text-blue-600 bg-blue-50/50 font-semibold' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Home className="w-4.5 h-4.5" />
          <span className="text-[10px] font-medium">หน้าแรก</span>
        </button>

        {/* Tab 2: Record */}
        <button
          onClick={() => setActiveTab('record')}
          className={`flex flex-col items-center gap-1.5 py-1 px-3 rounded-xl transition-all ${activeTab === 'record' ? 'text-blue-600 bg-blue-50/50 font-semibold' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <BookOpen className="w-4.5 h-4.5" />
          <span className="text-[10px] font-medium">บันทึกข้อมูล</span>
        </button>

        {/* Tab 3: Report */}
        <button
          onClick={() => setActiveTab('report')}
          className={`flex flex-col items-center gap-1.5 py-1 px-3 rounded-xl transition-all ${activeTab === 'report' ? 'text-blue-600 bg-blue-50/50 font-semibold' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <BarChart3 className="w-4.5 h-4.5" />
          <span className="text-[10px] font-medium">รายงาน</span>
        </button>

        {/* Tab 4: Settings */}
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1.5 py-1 px-3 rounded-xl transition-all ${activeTab === 'settings' ? 'text-blue-600 bg-blue-50/50 font-semibold' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Settings className="w-4.5 h-4.5" />
          <span className="text-[10px] font-medium">ตั้งค่า</span>
        </button>
      </nav>
    </div>
  );
}
