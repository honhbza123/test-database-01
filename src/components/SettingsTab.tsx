import React, { useState } from 'react';
import { Database, Edit2, RefreshCw, Layers, Bell, Languages, Shield, History, ArrowRight, X, LogOut, Check } from 'lucide-react';
import { PlotRecord, LoginLog } from '../types';

interface SettingsTabProps {
  plots: PlotRecord[];
  loginHistory: LoginLog[];
  onLogout: () => void;
  user: any;
}

export default function SettingsTab({ plots, loginHistory, onLogout, user }: SettingsTabProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncTime, setSyncTime] = useState('2m ago');
  const [dbName, setDbName] = useState('test-database-01');
  const [isEditingDb, setIsEditingDb] = useState(false);
  
  // Modal toggle state for History Log
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncTime('just now');
      alert('ฐานข้อมูลซิงค์ข้อมูลล่าสุดกับ Firebase สำเร็จ!');
    }, 1200);
  };

  const saveDbName = () => {
    setIsEditingDb(false);
    alert('เปลี่ยนชื่อ Instance ฐานข้อมูลเรียบร้อย (ชื่อเฉพาะในระบบจำลอง)');
  };

  return (
    <div className="flex flex-col gap-5 pb-24 animate-fade-in">
      {/* Header and Subtitle */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">การตั้งค่า</h1>
        <p className="text-slate-500 text-[11px] mt-1 font-medium">
          Manage your project environment and data synchronization parameters.
        </p>
      </div>

      {/* Database Connection Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
          <div className="flex flex-col gap-0.5">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">การเชื่อมต่อฐานข้อมูล</h3>
            <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Firebase Realtime Database Configuration</p>
          </div>
          <span className="flex items-center gap-1 bg-slate-50 text-slate-700 px-2 py-0.5 rounded border border-slate-200/60 text-[9px] font-bold">
            <span className="w-1.5 h-1.5 bg-slate-700 rounded-full"></span>
            <span>Connected</span>
          </span>
        </div>

        {/* Database Instance Row */}
        <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-200/40">
          <div className="w-9 h-9 bg-white border border-slate-200 text-slate-700 rounded-lg flex items-center justify-center">
            <Database className="w-4.5 h-4.5" />
          </div>
          <div className="flex-1">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Instance Name</p>
            {isEditingDb ? (
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none"
                  value={dbName}
                  onChange={(e) => setDbName(e.target.value)}
                />
                <button onClick={saveDbName} className="p-1 bg-slate-100 text-slate-800 rounded-lg hover:bg-slate-200">
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-bold text-slate-800">{dbName}</span>
                <button onClick={() => setIsEditingDb(true)} className="text-slate-400 hover:text-slate-700">
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Synchronized status row */}
        <div className="flex items-center justify-between bg-slate-50/50 p-4 rounded-xl border border-slate-200/40">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-white border border-slate-200 text-slate-700 rounded-lg flex items-center justify-center">
              <RefreshCw className={`w-4.5 h-4.5 ${isSyncing ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Sync Status</p>
              <p className="text-xs font-bold text-slate-800 mt-0.5">Synchronized ({syncTime})</p>
            </div>
          </div>
          <button
            onClick={handleSyncNow}
            disabled={isSyncing}
            className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold px-3 py-2 rounded-xl transition-all disabled:opacity-50"
          >
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>
      </div>

      {/* Experimental grid mapping card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col gap-4">
        <div>
          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">ผังการทดลอง</h3>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold text-slate-600">
          <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-200/40">
            <span className="text-slate-400 text-[9px] block font-bold uppercase tracking-wide">Corn Varieties</span>
            <span className="text-slate-800 font-bold text-xs block mt-0.5">4 Types</span>
          </div>
          <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-200/40">
            <span className="text-slate-400 text-[9px] block font-bold uppercase tracking-wide">Irrigation Systems</span>
            <span className="text-slate-800 font-bold text-xs block mt-0.5">3 Systems</span>
          </div>
          <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-200/40">
            <span className="text-slate-400 text-[9px] block font-bold uppercase tracking-wide">Total Plots</span>
            <span className="text-slate-800 font-bold text-xs block mt-0.5">{plots.length || 36} Plots</span>
          </div>
        </div>

        {/* CSS Interactive Experimental Grid Map preview */}
        <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-200/40">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 text-center">Experimental Plot Grid Map (Real-time)</p>
          <div className="grid grid-cols-6 gap-1.5 h-28">
            {Array.from({ length: 18 }).map((_, idx) => {
              // Highlight the user's recorded plots in special color
              const isRecorded = idx < plots.length;
              return (
                <div
                  key={idx}
                  title={`Plot ${idx + 1}`}
                  className={`rounded border flex items-center justify-center text-[8px] font-bold transition-all hover:scale-105 cursor-help ${isRecorded ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200/80 text-slate-400'}`}
                >
                  P{idx + 1}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* General Settings Menus */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.01)] overflow-hidden flex flex-col divide-y divide-slate-100">
        <div className="px-5 py-3.5 bg-slate-50/80 font-bold text-slate-700 text-[10px] uppercase tracking-wider">
          General Settings
        </div>

        {/* Menu item 1: Notification */}
        <button onClick={() => alert('หน้าจอตั้งค่าการแจ้งเตือนและการเตือนภัย')} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/40 transition-colors text-left group">
          <div className="flex items-center gap-3">
            <div className="w-8.5 h-8.5 bg-slate-50 border border-slate-100 text-slate-600 rounded-lg flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">การแจ้งเตือน</p>
              <p className="text-[9px] text-slate-400 font-medium mt-0.5">Manage alerts for irrigation and yield thresholds</p>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Menu item 2: Languages */}
        <button onClick={() => alert('หน้าจอตั้งค่าภาษา (Languages)')} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/40 transition-colors text-left group">
          <div className="flex items-center gap-3">
            <div className="w-8.5 h-8.5 bg-slate-50 border border-slate-100 text-slate-600 rounded-lg flex items-center justify-center">
              <Languages className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">ภาษา / Language</p>
              <p className="text-[9px] text-slate-400 font-medium mt-0.5">Thai, English (US)</p>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Menu item 3: Security */}
        <button onClick={() => alert('หน้าจอความปลอดภัยและการเข้ารหัสความปลอดภัย API')} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/40 transition-colors text-left group">
          <div className="flex items-center gap-3">
            <div className="w-8.5 h-8.5 bg-slate-50 border border-slate-100 text-slate-600 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">ความปลอดภัย</p>
              <p className="text-[9px] text-slate-400 font-medium mt-0.5">User access levels and API security keys</p>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Menu item 4: Database logs */}
        <button onClick={() => setShowHistoryModal(true)} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/40 transition-colors text-left group">
          <div className="flex items-center gap-3">
            <div className="w-8.5 h-8.5 bg-slate-50 border border-slate-100 text-slate-600 rounded-lg flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">ประวัติการบันทึก</p>
              <p className="text-[9px] text-slate-400 font-medium mt-0.5">View log of all database changes and login events</p>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Logout button */}
      <button
        onClick={onLogout}
        className="w-full mt-2 bg-white hover:bg-rose-50 text-rose-600 font-semibold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 border border-rose-100 transition-all"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>ออกจากระบบ (Logout)</span>
      </button>

      {/* Database Activities Logs Modal Overlay */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-[2px] flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200/60 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
              <div className="flex items-center gap-2">
                <History className="text-slate-800 w-4 h-4" />
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">ประวัติระบบฐานข้อมูล Firebase (Logs)</h3>
              </div>
              <button onClick={() => setShowHistoryModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex flex-col gap-5">
              {/* Authenticated User info */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/40 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                ผู้ใช้ปัจจุบัน: <span className="text-slate-800 font-black">{user?.email}</span> (UID: {user?.uid})
              </div>

              {/* Login Logs list */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-2">ประวัติการเข้าใช้งาน (Login Sessions)</h4>
                {loginHistory.length === 0 ? (
                  <p className="text-[10px] text-slate-400 font-semibold italic">ไม่มีประวัติการเข้าใช้งานในระบบ</p>
                ) : (
                  <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto">
                    {loginHistory.map((log) => (
                      <div key={log.id} className="p-2 bg-slate-50 rounded border border-slate-200/40 text-[9px] font-medium flex justify-between items-center">
                        <div>
                          <p className="font-bold text-slate-700">ผู้ใช้: {log.username} ({log.email})</p>
                          <p className="text-slate-400 mt-0.5">{new Date(log.timestamp).toLocaleString('th-TH')}</p>
                        </div>
                        <span className={`px-1.5 py-0.5 rounded font-bold ${log.status === 'success' ? 'bg-slate-100 text-slate-700' : 'bg-rose-50 text-rose-700'}`}>
                          {log.status === 'success' ? 'สำเร็จ' : 'ล้มเหลว'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Database Plot Updates log */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-2">ประวัติการบันทึกแปลงทดลอง (Plot Logs)</h4>
                {plots.length === 0 ? (
                  <p className="text-[10px] text-slate-400 font-semibold italic">ไม่มีข้อมูลแปลงทดลองถูกบันทึกเข้ามา</p>
                ) : (
                  <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
                    {plots.map((p, index) => (
                      <div key={index} className="p-2 bg-slate-50 rounded border border-slate-200/40 text-[9px] font-medium flex justify-between items-center">
                        <div>
                          <p className="font-bold text-slate-700">แปลง {p.id} ({p.replication}) | {p.cornVarieties.join(', ')}</p>
                          <p className="text-slate-400 mt-0.5">
                            ความชื้น {p.moisture}% | อุณหภูมิ {p.temperature}°C | ปุ๋ย {p.fertilizer}
                          </p>
                          <p className="text-slate-400 mt-0.5">บันทึกโดย: {p.createdByName || 'Admin'}</p>
                        </div>
                        <span className="text-slate-400 font-bold">
                          {p.createdAt ? new Date(p.createdAt).toLocaleDateString('th-TH') : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
