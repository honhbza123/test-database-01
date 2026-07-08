import React, { useState } from 'react';
import { Tractor, User, Lock, Eye, EyeOff, Key, Database, ArrowRight, ScanLine } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface LoginScreenProps {
  onLoginSuccess: (user: any) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('กรุณากรอกชื่อผู้ใช้งานและรหัสผ่าน');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Map username to standard Firebase Auth credentials
    let email = `${username.trim()}@agridata.com`;
    let firebasePassword = password;

    if (username === 'admin') {
      email = 'admin@agridata.com';
      if (password === 'admin') {
        firebasePassword = 'adminadmin';
      }
    } else if (username === 'demo') {
      email = 'demo@agridata.com';
      if (password === 'demo') {
        firebasePassword = 'demodemo';
      }
    }

    try {
      let userCredential;
      try {
        // Attempt standard login
        userCredential = await signInWithEmailAndPassword(auth, email, firebasePassword);
      } catch (signInErr: any) {
        // Auto-create standard accounts if they don't exist yet
        if (signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/invalid-credential') {
          const isAdmin = username === 'admin' && password === 'admin';
          const isDemo = username === 'demo' && password === 'demo';
          if (isAdmin || isDemo) {
            userCredential = await createUserWithEmailAndPassword(auth, email, firebasePassword);
          } else {
            throw signInErr;
          }
        } else {
          throw signInErr;
        }
      }

      // Save login history to Firestore
      try {
        await addDoc(collection(db, 'login_history'), {
          username: username,
          email: email,
          status: 'success',
          timestamp: new Date().toISOString()
        });
      } catch (historyErr) {
        console.error('Error logging history to Firestore:', historyErr);
      }

      onLoginSuccess(userCredential.user);
    } catch (err: any) {
      console.error('Firebase Auth Error details:', err);
      
      let friendlyError = 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง';
      if (err.code === 'auth/operation-not-allowed') {
        friendlyError = 'เข้าสู่ระบบไม่ได้: โปรดเปิดใช้งาน Sign-in method แบบ "Email/Password" ใน Firebase Console (Authentication) ก่อนใช้งาน';
      } else if (err.code === 'auth/network-request-failed') {
        friendlyError = 'ไม่สามารถเชื่อมต่ออินเทอร์เน็ตหรือบริการ Firebase ได้ โปรดตรวจสอบการเชื่อมต่ออินเทอร์เน็ต';
      } else if (err.code === 'auth/configuration-not-found' || err.code === 'auth/invalid-api-key') {
        friendlyError = `ตั้งค่าระบบไม่ถูกต้อง (${err.code}): โปรดตรวจสอบความถูกต้องของไฟล์ firebase-applet-config.json`;
      } else if (err.code) {
        friendlyError = `เข้าสู่ระบบไม่สำเร็จ (${err.code}): ${err.message || 'โปรดตรวจสอบชื่อผู้ใช้และรหัสผ่าน'}`;
      }
      
      setError(friendlyError);
      
      // Save failed attempt to Firestore
      try {
        await addDoc(collection(db, 'login_history'), {
          username: username,
          email: email,
          status: 'failed',
          timestamp: new Date().toISOString()
        });
      } catch (logErr) {
        // Silent catch
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <main className="w-full max-w-sm mx-auto" id="login-panel">
        <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col gap-6">
          
          {/* Branding Header */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
              <Tractor className="text-white w-6 h-6" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AgriData</h1>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">Management System</p>
            </div>
          </div>

          {/* Title */}
          <div className="border-b border-slate-100 pb-2.5">
            <h2 className="text-base font-bold text-slate-800">เข้าสู่ระบบ (Login)</h2>
          </div>

          {/* Alert Error */}
          {error && (
            <div className="bg-rose-50 text-rose-600 text-xs px-4 py-3 rounded-xl border border-rose-100 font-medium animate-pulse" id="login-error-msg">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            
            {/* Username Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide" htmlFor="username">
                ชื่อผู้ใช้งาน (Username)
              </label>
              <div className="relative group">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors">
                  <User className="w-4 h-4" />
                </span>
                <input
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900/5 outline-none transition-all text-xs font-semibold text-slate-800 placeholder:text-slate-400"
                  id="username"
                  placeholder="กรอกชื่อผู้ใช้งาน"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide" htmlFor="password">
                  รหัสผ่าน (Password)
                </label>
                <a className="text-[10px] font-semibold text-slate-500 hover:text-slate-900 transition-colors" href="#forgot" onClick={(e) => { e.preventDefault(); alert('ระบบทดสอบ: คุณสามารถใช้บัญชีทดสอบ admin / admin หรือ demo / demo ในการเข้าระบบได้'); }}>
                  ลืมรหัสผ่าน?
                </a>
              </div>
              <div className="relative group">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900/5 outline-none transition-all text-xs font-semibold text-slate-800 placeholder:text-slate-400"
                  id="password"
                  placeholder="กรอกรหัสผ่าน"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors focus:outline-none"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Action Button */}
            <button
              className="group relative w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-3 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              type="submit"
              disabled={isLoading}
              id="login-btn"
            >
              <span>{isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>

          {/* Secondary Actions */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="h-px bg-slate-100 flex-1"></div>
              <span className="text-[10px] text-slate-400 font-bold tracking-widest">OR</span>
              <div className="h-px bg-slate-100 flex-1"></div>
            </div>
            <button
              onClick={() => alert('ฟังก์ชัน Scan to Login จะเปิดใช้งานในการอัปเดตถัดไป')}
              className="w-full flex items-center justify-center gap-1.5 border border-slate-200 text-slate-600 font-medium py-2.5 rounded-xl hover:bg-slate-50 transition-colors active:scale-[0.98] text-xs"
              id="scan-login-btn"
            >
              <ScanLine className="w-4 h-4 text-slate-500" />
              <span>Scan to Login</span>
            </button>
          </div>
        </div>

        {/* Footer Branding */}
        <footer className="mt-8 flex flex-col items-center gap-3">
          <p className="text-[10px] font-semibold text-slate-400 flex items-center gap-1.5" id="footer-branding">
            <Database className="w-3.5 h-3.5 text-slate-400" />
            Powered by Firebase: <span className="text-slate-600 font-bold">test-database-01</span>
          </p>
          <div className="flex gap-4">
            <div 
              className="w-20 h-7 bg-contain bg-center bg-no-repeat opacity-40 grayscale hover:grayscale-0 hover:opacity-80 transition-all cursor-pointer" 
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAay_IG-F5q4n2HwOIJw__TmTbVaVLOVrCxnBeGl6ed5fyONO683RqPOIkTvbu55GfZJxKjOyvgGRJMddpy127Pg3UgeXA10DqVCKGkcqcT2x2FbuzSuNdg__Pgvnum_yzvPZD8eMIkjs0VTGe34T5tzlX1ZEN3HD_jhTU7laHUbpbctIVpSBSzo6wU6bp3mXzTV-DkmvoGF0IaLkRdb7W7uQ73eijHI4lSFDColCad1KLMwihEPKZUmQ')" }}
              title="AgriTech Logo"
            ></div>
          </div>
        </footer>
      </main>
    </div>
  );
}
