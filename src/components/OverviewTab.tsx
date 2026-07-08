import React from 'react';
import { Sun, Cloud, CloudRain, CloudSun, Map, Droplets, BookOpen, Settings, CheckCircle2, ChevronRight, PlusCircle, Activity, Landmark } from 'lucide-react';
import { PlotRecord } from '../types';

interface OverviewTabProps {
  plots: PlotRecord[];
  onNavigateToTab: (tab: string) => void;
  user: any;
}

export default function OverviewTab({ plots, onNavigateToTab, user }: OverviewTabProps) {
  // Compute some stats dynamically
  const uniqueVarieties = new Set(plots.flatMap(p => p.cornVarieties || [])).size || 4;
  const uniqueIrrigations = new Set(plots.map(p => p.irrigationSystem)).size || 3;
  const totalPlots = plots.length || 36;

  // Static list for weather days
  const weatherDays = [
    { day: 'จ.', icon: <Sun className="w-5 h-5 text-amber-500" />, temp: '30°/22°' },
    { day: 'อ.', icon: <CloudSun className="w-5 h-5 text-amber-500" />, temp: '29°/21°' },
    { day: 'พ.', icon: <Cloud className="w-5 h-5 text-sky-400" />, temp: '27°/20°' },
    { day: 'พฤ.', icon: <CloudRain className="w-5 h-5 text-blue-400" />, temp: '26°/21°' },
    { day: 'ศ.', icon: <Sun className="w-5 h-5 text-amber-500" />, temp: '31°/23°' },
  ];

  return (
    <div className="flex flex-col gap-5 pb-24 animate-fade-in">
      {/* Header section with User Info */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">ภาพรวมโครงการ</h1>
          <p className="text-slate-500 text-[11px] mt-1 font-medium flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5 text-slate-400" />
            อำเภอภูเรือ จังหวัดเลย | พื้นที่ 2 งาน (~800 ตร.ม.)
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-100/50 text-[10px] font-semibold">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
          <span>กำลังดำเนินการ</span>
        </div>
      </div>

      {/* Grid of basic parameters */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">พันธุ์ข้าวโพด</p>
          <p className="text-xl font-bold text-slate-900 mt-0.5">{uniqueVarieties} <span className="text-[11px] font-medium text-slate-400">สายพันธุ์</span></p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">ระบบน้ำ</p>
          <p className="text-xl font-bold text-slate-900 mt-0.5">{uniqueIrrigations} <span className="text-[11px] font-medium text-slate-400">รูปแบบ</span></p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">รวมแปลง</p>
          <p className="text-xl font-bold text-slate-900 mt-0.5">{totalPlots} <span className="text-[11px] font-medium text-slate-400">แปลง</span></p>
        </div>
      </div>

      {/* Weather Widget Card - Clean Slate Minimal */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col gap-4">
        <div className="flex justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
              <Sun className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 leading-tight">28°C</p>
              <p className="text-[10px] font-medium text-slate-400">เลย • ท้องฟ้าแจ่มใส</p>
            </div>
          </div>
          <div className="bg-slate-50 p-1 rounded-lg border border-slate-200/40 flex gap-0.5">
            <button className="px-2 py-1 text-[10px] font-medium text-slate-500 rounded hover:bg-white transition-all">ย้อนหลัง</button>
            <button className="px-2 py-1 text-[10px] font-semibold text-slate-900 bg-white shadow-sm rounded">ปัจจุบัน</button>
            <button className="px-2 py-1 text-[10px] font-medium text-slate-500 rounded hover:bg-white transition-all">ล่วงหน้า</button>
          </div>
        </div>

        {/* Weekly Weather Row */}
        <div className="grid grid-cols-5 gap-1.5 pt-3 border-t border-slate-100">
          {weatherDays.map((wd, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 bg-slate-50/50 p-2 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
              <span className="text-[10px] font-medium text-slate-500">{wd.day}</span>
              <div className="w-4 h-4 flex items-center justify-center">{wd.icon}</div>
              <span className="text-[10px] font-bold text-slate-800">{wd.temp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Progress & Activities Grid */}
      <div className="grid grid-cols-1 gap-4">
        
        {/* Progress Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col gap-4">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">ความคืบหน้าโครงการ</h3>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">สรุปการดำเนินงานรายไตรมาส</p>
          </div>

          <div className="flex items-center gap-5">
            {/* Visual Circular Progress */}
            <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-600"
                  strokeWidth="3.5"
                  strokeDasharray="72, 100"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-base font-bold text-slate-800">72%</span>
                <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-wider">Phase 2</span>
              </div>
            </div>

            {/* Checklist of milestones */}
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[11px] font-medium text-slate-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>เตรียมดินและใส่ปุ๋ยรองพื้น</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-medium text-slate-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>ติดตั้งระบบน้ำ (W1, W2, W3)</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
                <div className="w-3.5 h-3.5 rounded-full border border-slate-200"></div>
                <span>เก็บเกี่ยวและวัดผลผลิต</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick navigation grid */}
        <div className="grid grid-cols-4 gap-2">
          <button onClick={() => alert('เปิดแผนผังแปลงเรียลไทม์')} className="bg-white py-3 px-1 rounded-xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:bg-slate-50 transition-colors flex flex-col items-center justify-center gap-2 group">
            <div className="w-8 h-8 bg-slate-50 text-slate-700 rounded-lg flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-transform">
              <Map className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-600">แผนผังแปลง</span>
          </button>
          
          <button onClick={() => alert('ระบบควบคุมการทำงานของเครื่องรดน้ำอัตโนมัติ')} className="bg-white py-3 px-1 rounded-xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:bg-slate-50 transition-colors flex flex-col items-center justify-center gap-2 group">
            <div className="w-8 h-8 bg-slate-50 text-slate-700 rounded-lg flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-transform">
              <Droplets className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-600">ควบคุมน้ำ</span>
          </button>
          
          <button onClick={() => onNavigateToTab('record')} className="bg-white py-3 px-1 rounded-xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:bg-slate-50 transition-colors flex flex-col items-center justify-center gap-2 group">
            <div className="w-8 h-8 bg-slate-50 text-slate-700 rounded-lg flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-600">บันทึกข้อมูล</span>
          </button>
          
          <button onClick={() => onNavigateToTab('settings')} className="bg-white py-3 px-1 rounded-xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:bg-slate-50 transition-colors flex flex-col items-center justify-center gap-2 group">
            <div className="w-8 h-8 bg-slate-50 text-slate-700 rounded-lg flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-transform">
              <Settings className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-600">ตั้งค่าเซ็นเซอร์</span>
          </button>
        </div>
      </div>

      {/* Recent Activities Section */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-slate-800" />
            <h3 className="font-bold text-slate-850 text-sm">กิจกรรมล่าสุด</h3>
          </div>
          <button onClick={() => alert('แสดงประวัติทั้งหมด')} className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-0.5">
            <span>ดูทั้งหมด</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {/* Activity item 1 */}
          <div className="flex items-center justify-between p-3 bg-slate-50/50 hover:bg-slate-50 transition-colors rounded-xl border border-slate-100">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 bg-white border border-slate-200/50 rounded-lg flex items-center justify-center text-slate-700 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">พ่นสารเคมีกำจัดหนอนกระทู้ FAW</p>
                <p className="text-[10px] text-slate-400 mt-0.5">2 ชั่วโมงที่ผ่านมา | โดย นายวิจัย การเกษตร</p>
              </div>
            </div>
            <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[9px] font-bold border border-emerald-100/30">
              เสร็จสิ้น
            </span>
          </div>

          {/* Activity item 2 */}
          <div className="flex items-center justify-between p-3 bg-slate-50/50 hover:bg-slate-50 transition-colors rounded-xl border border-slate-100">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 bg-white border border-slate-200/50 rounded-lg flex items-center justify-center text-slate-700 mt-0.5">
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">ระบบ W2 (Drip) ทำงานอัตโนมัติ</p>
                <p className="text-[10px] text-slate-400 mt-0.5">5 ชั่วโมงที่ผ่านมา | ปริมาณน้ำ 150 ลิตร</p>
              </div>
            </div>
            <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[9px] font-bold border border-emerald-100/30">
              เสร็จสิ้น
            </span>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => onNavigateToTab('record')}
        className="fixed bottom-24 right-6 bg-slate-900 hover:bg-slate-800 text-white p-3.5 rounded-full shadow-md active:scale-95 transition-all flex items-center gap-2 group z-20 font-bold text-xs"
      >
        <PlusCircle className="w-5 h-5" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap">
          บันทึกข้อมูลแปลง
        </span>
      </button>
    </div>
  );
}
