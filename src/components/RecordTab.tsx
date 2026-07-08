import React, { useState } from 'react';
import { Shovel, MapPin, Thermometer, Droplet, CheckCircle, ArrowRight, ArrowLeft, RefreshCw, AlertTriangle, Sparkles } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { PlotRecord } from '../types';

interface RecordTabProps {
  onRecordSuccess: () => void;
  user: any;
}

export default function RecordTab({ onRecordSuccess, user }: RecordTabProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form Fields State
  const [plotId, setPlotId] = useState('W1-P1');
  const [replication, setReplication] = useState('ซ้ำที่ 1');
  const [selectedVarieties, setSelectedVarieties] = useState<string[]>(['PAC789', 'CP S8']);
  const [irrigationSystem, setIrrigationSystem] = useState('W1 : ระบบเปียกสลับแห้ง (AWD)');
  const [moisture, setMoisture] = useState(24);
  const [temperature, setTemperature] = useState(28.5);
  const [landPrep, setLandPrep] = useState('ไถดะ 1 ครั้ง ตากดิน 7 วัน ยกร่องระบายน้ำกว้าง 1.2 เมตร');
  const [initialWater, setInitialWater] = useState(150);
  const [fertilizer, setFertilizer] = useState('15-15-15 อัตรา 50 กก./ไร่');

  // Step 2 & 3 custom details
  const [weedControl, setWeedControl] = useState('ใส่ยาคุมหญ้าหลังปลูกทันที');
  const [pestObservation, setPestObservation] = useState('พบนกเล็กน้อย เฝ้าระวังหนอนกระทู้ลายจุด');
  const [notes, setNotes] = useState('สภาวะแปลงสมบูรณ์ ดินมีความโปร่งระบายน้ำดี');

  const handleVarietyToggle = (variety: string) => {
    if (selectedVarieties.includes(variety)) {
      setSelectedVarieties(selectedVarieties.filter(v => v !== variety));
    } else {
      setSelectedVarieties([...selectedVarieties, variety]);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setPlotId('W1-P2');
    setReplication('ซ้ำที่ 1');
    setSelectedVarieties(['PAC789']);
    setMoisture(30);
    setTemperature(27.0);
    setLandPrep('');
    setInitialWater(100);
    setFertilizer('15-15-15 อัตรา 50 กก./ไร่');
    setCurrentStep(1);
    setSubmitError(null);
  };

  const handleSubmit = async () => {
    if (!plotId.trim()) {
      setSubmitError('กรุณากรอกรหัสแปลง (Plot ID)');
      setCurrentStep(1);
      return;
    }
    if (selectedVarieties.length === 0) {
      setSubmitError('กรุณาเลือกสายพันธุ์ข้าวโพดอย่างน้อย 1 สายพันธุ์');
      setCurrentStep(1);
      return;
    }

    setIsLoading(true);
    setSubmitError(null);

    const record: Partial<PlotRecord> = {
      id: plotId,
      replication,
      cornVarieties: selectedVarieties,
      irrigationSystem,
      moisture,
      temperature,
      landPrep,
      initialWater,
      fertilizer,
      createdAt: new Date().toISOString(),
      createdBy: user?.uid || 'guest-uid',
      createdByName: user?.displayName || user?.email?.split('@')[0] || 'Admin User'
    };

    try {
      await addDoc(collection(db, 'plots'), record);
      setIsLoading(false);
      onRecordSuccess(); // triggers refetch and screen alert
      alert('บันทึกข้อมูลแปลงทดลองลงฐานข้อมูล Firebase สำเร็จ!');
      handleReset();
    } catch (err: any) {
      setIsLoading(false);
      console.error(err);
      try {
        handleFirestoreError(err, OperationType.WRITE, 'plots');
      } catch (formattedErr: any) {
        setSubmitError(`Firebase Permission Error: ${formattedErr.message}`);
      }
    }
  };

  return (
    <div className="flex flex-col gap-5 pb-24 animate-fade-in">
      {/* Header and Subtitle */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">บันทึกข้อมูลการทดลอง</h1>
        <p className="text-slate-500 text-[11px] mt-1 font-medium">
          กรุณาระบุรายละเอียดตามขั้นตอนของโครงการทดลองคัดเลือกพันธุ์ข้าวโพดไร่
        </p>
      </div>

      {/* Wizard Progress Stepper */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex justify-between items-center relative gap-2">
        <div className="absolute left-1/2 top-1/2 -translate-y-5 w-[80%] h-[2px] bg-slate-100 -translate-x-1/2 z-0">
          <div 
            className="h-full bg-slate-900 transition-all duration-300"
            style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }}
          ></div>
        </div>

        {/* Step 1 */}
        <div className="flex flex-col items-center gap-1 z-10 flex-1">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${currentStep >= 1 ? 'bg-slate-900 text-white scale-105' : 'bg-slate-100 text-slate-400'}`}>
            1
          </div>
          <span className={`text-[9px] font-bold ${currentStep >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>ขั้นตอนที่ 1</span>
          <span className="text-[9px] font-medium text-slate-400">เตรียมการ</span>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center gap-1 z-10 flex-1">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${currentStep >= 2 ? 'bg-slate-900 text-white scale-105' : 'bg-slate-100 text-slate-400'}`}>
            2
          </div>
          <span className={`text-[9px] font-bold ${currentStep >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>ขั้นตอนที่ 2</span>
          <span className="text-[9px] font-medium text-slate-400">การจัดการ</span>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center gap-1 z-10 flex-1">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${currentStep >= 3 ? 'bg-slate-900 text-white scale-105' : 'bg-slate-100 text-slate-400'}`}>
            3
          </div>
          <span className={`text-[9px] font-bold ${currentStep >= 3 ? 'text-slate-900' : 'text-slate-400'}`}>ขั้นตอนที่ 3</span>
          <span className="text-[9px] font-medium text-slate-400">เก็บข้อมูล</span>
        </div>
      </div>

      {/* Form Error Alert */}
      {submitError && (
        <div className="bg-rose-50 text-rose-700 p-4 rounded-xl border border-rose-100/60 flex gap-2 text-xs font-medium">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-500" />
          <div>{submitError}</div>
        </div>
      )}

      {/* --- STEP 1 FORM PANEL --- */}
      {currentStep === 1 && (
        <div className="flex flex-col gap-5">
          {/* Card: รายละเอียดแปลงทดลอง */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <Shovel className="w-4 h-4 text-slate-700" />
              <h3 className="font-bold text-slate-800 text-sm">รายละเอียดแปลงทดลอง</h3>
            </div>

            {/* Plot ID */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">รหัสแปลง (Plot ID)</label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900/5 outline-none transition-all text-xs font-semibold text-slate-800"
                placeholder="เช่น W1-P1"
                value={plotId}
                onChange={(e) => setPlotId(e.target.value)}
              />
            </div>

            {/* Replication dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">ซ้ำที่ (Replication)</label>
              <select
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900/5 outline-none transition-all text-xs font-semibold text-slate-700"
                value={replication}
                onChange={(e) => setReplication(e.target.value)}
              >
                <option value="ซ้ำที่ 1">ซ้ำที่ 1</option>
                <option value="ซ้ำที่ 2">ซ้ำที่ 2</option>
                <option value="ซ้ำที่ 3">ซ้ำที่ 3</option>
              </select>
            </div>

            {/* Corn Varieties (Checkboxes) */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">พันธุ์ข้าวโพดไร่ (Corn Variety)</label>
              <div className="grid grid-cols-2 gap-2">
                {['PAC789', 'สุวรรณ 5720', 'CP S8', 'DEKALB 8899S'].map((variety) => {
                  const isSelected = selectedVarieties.includes(variety);
                  return (
                    <button
                      type="button"
                      key={variety}
                      onClick={() => handleVarietyToggle(variety)}
                      className={`flex items-center gap-2.5 p-3 border rounded-xl text-left transition-all ${isSelected ? 'bg-slate-900 border-slate-900 text-white font-semibold' : 'bg-white border-slate-200 text-slate-600 font-medium hover:bg-slate-50/50'}`}
                    >
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'bg-white border-white text-slate-900' : 'border-slate-300 bg-white'}`}>
                        {isSelected && <div className="w-1.5 h-1.5 bg-slate-900 rounded-full"></div>}
                      </div>
                      <span className="text-xs">{variety}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Irrigation System selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">ระบบน้ำ (Irrigation System)</label>
              <select
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900/5 outline-none transition-all text-xs font-semibold text-slate-700"
                value={irrigationSystem}
                onChange={(e) => setIrrigationSystem(e.target.value)}
              >
                <option value="W1 : ระบบเปียกสลับแห้ง (AWD)">W1 : ระบบเปียกสลับแห้ง (AWD)</option>
                <option value="W2 : ระบบน้ำหยด (Drip)">W2 : ระบบน้ำหยด (Drip)</option>
                <option value="W3 : ระบบมินิสปริงเกลอร์ (Sprinkler)">W3 : ระบบมินิสปริงเกลอร์ (Sprinkler)</option>
              </select>
            </div>
          </div>

          {/* Card: Field Conditions */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col gap-4">
            <h4 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-slate-500" />
              ข้อมูลภาคสนาม (Field Conditions)
            </h4>

            {/* Soil Moisture Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">ความชื้นดิน</span>
                <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">{moisture}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
                value={moisture}
                onChange={(e) => setMoisture(Number(e.target.value))}
              />
            </div>

            {/* Temperature Badge */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50/50 border border-slate-200/40 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <Thermometer className="w-4 h-4 text-slate-500" />
                <span>อุณหภูมิแวดล้อม</span>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  step="0.1"
                  className="w-16 px-2 py-1 text-right bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:border-slate-900 outline-none"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                />
                <span className="text-xs font-bold text-slate-500">°C</span>
              </div>
            </div>
          </div>

          {/* Card: Location Data */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-50 border border-slate-100 text-slate-700 rounded-lg flex items-center justify-center">
              <MapPin className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">อ.ภูเรือ จ.เลย</p>
              <p className="text-[10px] text-slate-400 font-semibold">พื้นที่ 2 งาน (~800 ตร.ม.)</p>
            </div>
          </div>

          {/* Card: การเตรียมดินและการจัดการเบื้องต้น */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-2.5">
              <div className="text-[9px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wider">
                Trowel
              </div>
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">การเตรียมดินและการจัดการเบื้องต้น</h3>
            </div>

            {/* Land Prep Textarea */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">การเตรียมดิน (Land Prep)</label>
              <textarea
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900/5 outline-none transition-all text-xs font-medium min-h-[70px] text-slate-700"
                placeholder="ระบุรายละเอียด เช่น ไถดะ 1 ครั้ง..."
                value={landPrep}
                onChange={(e) => setLandPrep(e.target.value)}
              />
            </div>

            {/* Initial Water */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">ปริมาณน้ำต้นทาง (Initial Water)</label>
              <div className="relative">
                <input
                  type="number"
                  className="w-full pl-3.5 pr-14 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900/5 outline-none transition-all text-xs font-semibold text-slate-800"
                  value={initialWater}
                  onChange={(e) => setInitialWater(Number(e.target.value))}
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-slate-50 text-[9px] font-bold text-slate-400 px-2 py-0.5 rounded border border-slate-200/50">
                  ลิตร
                </span>
              </div>
            </div>

            {/* Fertilizer */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">การใส่ปุ๋ยรองพื้น</label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900/5 outline-none transition-all text-xs font-semibold text-slate-800"
                value={fertilizer}
                onChange={(e) => setFertilizer(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* --- STEP 2 FORM PANEL --- */}
      {currentStep === 2 && (
        <div className="flex flex-col gap-5 animate-fade-in">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-2.5">
              <Droplet className="w-4 h-4 text-slate-700" />
              <h3 className="font-bold text-slate-800 text-sm">การจัดการและกำจัดวัชพืช</h3>
            </div>

            {/* Weed control */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">การควบคุมวัชพืช (Weed Control)</label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900/5 outline-none transition-all text-xs font-semibold text-slate-700"
                value={weedControl}
                onChange={(e) => setWeedControl(e.target.value)}
              />
            </div>

            {/* Pest observation */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">การเฝ้าระวังศัตรูพืช (Pest Observation)</label>
              <textarea
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900/5 outline-none transition-all text-xs font-medium min-h-[90px] text-slate-700"
                value={pestObservation}
                onChange={(e) => setPestObservation(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* --- STEP 3 FORM PANEL --- */}
      {currentStep === 3 && (
        <div className="flex flex-col gap-5 animate-fade-in">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-2.5">
              <CheckCircle className="w-4 h-4 text-slate-700" />
              <h3 className="font-bold text-slate-800 text-sm">ตรวจสอบข้อมูลก่อนบันทึก</h3>
            </div>

            {/* Summary List */}
            <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex flex-col gap-2.5">
              <div className="flex justify-between text-xs py-0.5 border-b border-slate-200/40">
                <span className="font-semibold text-slate-400">รหัสแปลง (Plot ID)</span>
                <span className="font-bold text-slate-800">{plotId}</span>
              </div>
              <div className="flex justify-between text-xs py-0.5 border-b border-slate-200/40">
                <span className="font-semibold text-slate-400">ซ้ำที่ (Replication)</span>
                <span className="font-bold text-slate-800">{replication}</span>
              </div>
              <div className="flex justify-between text-xs py-0.5 border-b border-slate-200/40">
                <span className="font-semibold text-slate-400">สายพันธุ์ที่ทำการทดสอบ</span>
                <span className="font-bold text-slate-900">{selectedVarieties.join(', ')}</span>
              </div>
              <div className="flex justify-between text-xs py-0.5 border-b border-slate-200/40">
                <span className="font-semibold text-slate-400">ระบบน้ำ</span>
                <span className="font-bold text-slate-800">{irrigationSystem.split(':')[0]}</span>
              </div>
              <div className="flex justify-between text-xs py-0.5 border-b border-slate-200/40">
                <span className="font-semibold text-slate-400">ดิน / อุณหภูมิ</span>
                <span className="font-bold text-slate-800">{moisture}% / {temperature}°C</span>
              </div>
              <div className="flex justify-between text-xs py-0.5">
                <span className="font-semibold text-slate-400">ใส่ปุ๋ยรองพื้น</span>
                <span className="font-bold text-slate-800">{fertilizer}</span>
              </div>
            </div>

            {/* Additional general notes */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">บันทึกเพิ่มเติม (General Notes)</label>
              <textarea
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-slate-900 focus:ring-1 focus:ring-slate-900/5 outline-none transition-all text-xs font-medium min-h-[70px] text-slate-700"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Button Row */}
      <div className="flex gap-3">
        {currentStep > 1 ? (
          <button
            onClick={handlePrevStep}
            className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 border border-slate-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ย้อนกลับ</span>
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 border border-slate-200"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>ล้างค่า</span>
          </button>
        )}

        {currentStep < 3 ? (
          <button
            onClick={handleNextStep}
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <span>ถัดไป</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <span>{isLoading ? 'กำลังบันทึก...' : 'บันทึกข้อมูลแปลง'}</span>
            <CheckCircle className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
