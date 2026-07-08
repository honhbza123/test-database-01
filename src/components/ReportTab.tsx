import React from 'react';
import { Download, Filter, Percent, ArrowUp, Thermometer, Droplets, CloudRain, Lightbulb, TrendingUp, Table } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { PlotRecord } from '../types';

interface ReportTabProps {
  plots: PlotRecord[];
}

export default function ReportTab({ plots }: ReportTabProps) {
  // Static mock growth data that reflects the exact chart requested
  const growthData = [
    { name: 'สัปดาห์ 1', PAC789: 30, CPS8: 25 },
    { name: 'สัปดาห์ 2', PAC789: 60, CPS8: 52 },
    { name: 'สัปดาห์ 3', PAC789: 105, CPS8: 88 },
    { name: 'สัปดาห์ 4', PAC789: 138, CPS8: 122 },
    { name: 'สัปดาห์ 5', PAC789: 164.2, CPS8: 148.5 },
  ];

  const handleExportPDF = () => {
    alert('ระบบกำลังประมวลผลและส่งออกไฟล์ PDF สรุปวิเคราะห์ผลผลิต...');
  };

  return (
    <div className="flex flex-col gap-5 pb-24 animate-fade-in">
      {/* Header and top buttons */}
      <div className="flex flex-col gap-0.5">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">การจัดการโครงการ &gt; สรุปผลวิเคราะห์</span>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">รายงานวิเคราะห์การเติบโต</h1>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleExportPDF}
          className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>ส่งออกไฟล์ PDF</span>
        </button>
        <button
          onClick={() => alert('ตัวกรองรายงานขั้นสูง')}
          className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>ตัวกรองข้อมูล</span>
        </button>
      </div>

      {/* Main Stats Block */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Total Area */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">พื้นที่ทดลองรวม</span>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">800 <span className="text-xs font-semibold text-slate-500">ตร.ม.</span></p>
            <p className="text-[9px] font-semibold text-slate-500 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
              สถานะปกติ : ตามแผนงาน
            </p>
          </div>
          <div className="w-10 h-10 bg-slate-50 border border-slate-100 text-slate-700 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Avg Height */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">ความสูงเฉลี่ย (ข้าวโพด)</span>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">164.2 <span className="text-xs font-semibold text-slate-500">ซม.</span></p>
            <p className="text-[9px] font-semibold text-slate-500 mt-1 flex items-center gap-0.5">
              <ArrowUp className="w-3 h-3 text-slate-400" />
              <span>+12.4% เมื่อเทียบกับสัปดาห์ก่อน</span>
            </p>
          </div>
          <div className="w-10 h-10 bg-slate-50 border border-slate-100 text-slate-700 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Weekly Growth Trend Line Chart */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col gap-4">
        <div>
          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">แนวโน้มความสูงต้นรายสัปดาห์</h3>
          <div className="flex gap-3 mt-1.5">
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
              <span className="w-2 h-2 bg-slate-900 rounded-full"></span> PAC789
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
              <span className="w-2 h-2 bg-slate-400 rounded-full"></span> CP S8
            </span>
          </div>
        </div>

        {/* Recharts responsive container */}
        <div className="w-full h-52 text-[10px] font-semibold">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="PAC789" stroke="#0f172a" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="CPS8" stroke="#94a3b8" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Water Efficiency Index (Progress bar metrics) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col gap-4">
        <div>
          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">ดัชนีประสิทธิภาพการใช้น้ำ (Water Efficiency Index)</h3>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">เปรียบเทียบระบบการบริหารจัดการน้ำตามแปลงทดลองควบคุม</p>
        </div>

        <div className="flex flex-col gap-3.5">
          {/* AWD */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-bold text-slate-700">ระบบ AWD (เปียกสลับแห้ง)</span>
              <span className="font-bold text-slate-900">82%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-slate-800 rounded-full" style={{ width: '82%' }}></div>
            </div>
            <p className="text-[9px] text-slate-400 font-medium">ประสิทธิภาพอยู่ในเกณฑ์ดี ลดการใช้น้ำได้ 15%</p>
          </div>

          {/* Drip */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-bold text-slate-700">ระบบ DRIP (น้ำหยด)</span>
              <span className="font-bold text-slate-900">94%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-slate-900 rounded-full" style={{ width: '94%' }}></div>
            </div>
            <p className="text-[9px] text-slate-400 font-medium">ประสิทธิภาพสูงสุด แม่นยำต่อความต้องการพืช</p>
          </div>

          {/* Sprinkler */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-bold text-slate-700">ระบบ SPRINKLER (มินิสปริงเกลอร์)</span>
              <span className="font-bold text-slate-900">76%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-slate-400 rounded-full" style={{ width: '76%' }}></div>
            </div>
            <p className="text-[9px] text-slate-400 font-medium">พบการสูญเสียน้ำจากการระเหยในช่วงแดดจัด</p>
          </div>
        </div>
      </div>

      {/* Variety Comparison List Table */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col gap-3">
        <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100">
          <Table className="w-4 h-4 text-slate-500" />
          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">รายละเอียดการเปรียบเทียบสายพันธุ์</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-2">สายพันธุ์</th>
                <th className="pb-2 text-center">อัตราการงอก</th>
                <th className="pb-2 text-right">ดัชนีความสมบูรณ์</th>
              </tr>
            </thead>
            <tbody className="text-xs font-semibold text-slate-700 divide-y divide-slate-100">
              <tr>
                <td className="py-2.5 font-bold text-slate-800">PAC789</td>
                <td className="py-2.5 text-center text-slate-600">98.5%</td>
                <td className="py-2.5 text-right">
                  <span className="bg-slate-950 text-white px-2 py-0.5 rounded text-[9px] font-bold">
                    ดีเยี่ยม (A+)
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-slate-800">สุวรรณ 5720</td>
                <td className="py-2.5 text-center text-slate-600">94.2%</td>
                <td className="py-2.5 text-right">
                  <span className="bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded text-[9px] font-bold">
                    ดี (B+)
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-slate-800">CP S8</td>
                <td className="py-2.5 text-center text-slate-600">96.8%</td>
                <td className="py-2.5 text-right">
                  <span className="bg-slate-800 text-white px-2 py-0.5 rounded text-[9px] font-bold">
                    ดีเยี่ยม (A)
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-slate-800">DEKALB 8899S</td>
                <td className="py-2.5 text-center text-slate-600">91.0%</td>
                <td className="py-2.5 text-right">
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[9px] font-bold">
                    ปานกลาง (B)
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Environmental Conditions Widgets */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col gap-4">
        <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">สถานะสภาพแวดล้อม</h3>
        
        <div className="grid grid-cols-3 gap-2.5">
          {/* Temperature widget */}
          <div className="flex flex-col items-center justify-center p-3 bg-slate-50/50 rounded-xl text-center border border-slate-200/40">
            <Thermometer className="w-4.5 h-4.5 text-slate-500 mb-1" />
            <span className="text-[9px] font-bold text-slate-400">อุณหภูมิอากาศ</span>
            <span className="text-xs font-bold text-slate-800 mt-0.5">28.5°C</span>
            <span className="text-[9px] font-bold text-slate-500 mt-0.5">-1.2°</span>
          </div>

          {/* Humidity widget */}
          <div className="flex flex-col items-center justify-center p-3 bg-slate-50/50 rounded-xl text-center border border-slate-200/40">
            <Droplets className="w-4.5 h-4.5 text-slate-500 mb-1" />
            <span className="text-[9px] font-bold text-slate-400">ความชื้นสัมพัทธ์</span>
            <span className="text-xs font-bold text-slate-800 mt-0.5">62%</span>
            <span className="text-[9px] font-bold text-slate-500 mt-0.5">เหมาะสม</span>
          </div>

          {/* Rain widget */}
          <div className="flex flex-col items-center justify-center p-3 bg-slate-50/50 rounded-xl text-center border border-slate-200/40">
            <CloudRain className="w-4.5 h-4.5 text-slate-500 mb-1" />
            <span className="text-[9px] font-bold text-slate-400">ปริมาณฝนสะสม</span>
            <span className="text-xs font-bold text-slate-800 mt-0.5">12.4 มม.</span>
            <span className="text-[9px] font-bold text-slate-400 mt-0.5">24 ชม.</span>
          </div>
        </div>

        {/* Smart recommendations block */}
        <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl flex gap-3">
          <Lightbulb className="w-5 h-5 text-slate-700 flex-shrink-0" />
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">คำแนะนำเชิงวิเคราะห์</span>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
              สภาวะอากาศเหมาะสมต่อการให้ปุ๋ยบำรุงรอบที่ 2 (ระยะ 25-30 วัน) แนะนำให้ปรับระบบ AWD เข้าสู่ช่วงสลับแห้งเพื่อกระตุ้นการกระจายตัวของรากในดินชั้นลึก
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
