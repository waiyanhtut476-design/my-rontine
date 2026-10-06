import React from 'react';
import { Droplet, Plus, Minus, Sparkles, Check } from 'lucide-react';
import { sounds, launchCelebration } from '../utils/audio';

interface WaterTrackerProps {
  waterIntake: number; // in glasses
  waterTarget: number; // in glasses (default 8)
  onUpdateWater: (glasses: number) => void;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({
  waterIntake,
  waterTarget,
  onUpdateWater,
}) => {
  const percent = Math.min(Math.round((waterIntake / waterTarget) * 100), 100);
  const mlCurrent = waterIntake * 250;
  const mlTarget = waterTarget * 250;

  const handleAddOne = () => {
    sounds.playWaterDrop();
    const next = waterIntake + 1;
    onUpdateWater(next);
    if (next === waterTarget) {
      launchCelebration();
    }
  };

  const handleAddTwo = () => {
    sounds.playWaterDrop();
    const next = waterIntake + 2;
    onUpdateWater(next);
    if (next >= waterTarget && waterIntake < waterTarget) {
      launchCelebration();
    }
  };

  const handleMinusOne = () => {
    if (waterIntake > 0) {
      sounds.playPop();
      onUpdateWater(waterIntake - 1);
    }
  };

  const handleGlassClick = (index: number) => {
    sounds.playWaterDrop();
    // If clicking the current level, toggle back one; else set to index + 1
    const targetVal = index + 1;
    onUpdateWater(targetVal);
    if (targetVal === waterTarget) {
      launchCelebration();
    }
  };

  // Hydration tip
  let tip = 'ดื่มน้ำแก้วแรกยามเช้าเพื่อปลุกร่างกายให้สดชื่น';
  if (waterIntake >= waterTarget) {
    tip = 'ยอดเยี่ยมมาก! คุณดื่มน้ำครบตามเป้าหมายของวันนี้แล้ว ร่างกายสดชื่นเต็มที่ ✨';
  } else if (waterIntake >= 5) {
    tip = 'เก่งมาก ดื่มไปเกินครึ่งแล้ว รักษาระดับน้ำในร่างกายไว้อย่างสม่ำเสมอนะ';
  } else if (waterIntake >= 2) {
    tip = 'จิบน้ำทีละนิดระหว่างวัน ช่วยให้สมองปลอดโปร่งและลดความเหนื่อยล้า';
  }

  return (
    <div className="bg-gradient-to-br from-sky-50 via-white to-sky-50/30 rounded-2xl border border-sky-100 p-5 shadow-xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-sky-100/80">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center shadow-xs">
              <Droplet className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">บันทึกการดื่มน้ำ</h3>
              <p className="text-xs text-sky-700">
                เป้าหมายวันละ {waterTarget} แก้ว ({mlTarget} มล.)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-2xl font-extrabold text-sky-900 tabular-nums">
              {waterIntake}
            </span>
            <span className="text-xs text-slate-500 font-medium"> / {waterTarget} แก้ว</span>
            <div className="text-[11px] text-sky-600 font-semibold tabular-nums">
              {mlCurrent} มล. ({percent}%)
            </div>
          </div>

          {percent >= 100 && (
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs shrink-0">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
          )}
        </div>
      </div>

      {/* Visual Cup Array (8 or target glasses) */}
      <div className="py-4">
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {Array.from({ length: waterTarget }).map((_, idx) => {
            const isFilled = idx < waterIntake;
            return (
              <button
                key={idx}
                onClick={() => handleGlassClick(idx)}
                className={`group flex flex-col items-center justify-center py-3 px-1 rounded-xl border transition-all cursor-pointer ${
                  isFilled
                    ? 'bg-sky-500 border-sky-500 text-white shadow-xs shadow-sky-500/20 active:scale-95'
                    : 'bg-white hover:bg-sky-50 border-sky-200 text-sky-400 active:scale-95'
                }`}
                title={`แก้วที่ ${idx + 1} (250 มล.)`}
              >
                <Droplet
                  className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                    isFilled ? 'fill-white' : 'stroke-[1.8]'
                  }`}
                />
                <span
                  className={`text-[10px] font-semibold mt-1 tabular-nums ${
                    isFilled ? 'text-sky-100' : 'text-slate-400'
                  }`}
                >
                  {idx + 1}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress Bar & Quick Action Buttons */}
      <div className="space-y-3 pt-1">
        <div className="w-full bg-sky-100/70 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-sky-500 transition-all duration-300 rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate">{tip}</span>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0 flex-wrap">
            <button
              onClick={handleMinusOne}
              disabled={waterIntake <= 0}
              className="px-2 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1"
              title="ลด 1 แก้ว"
            >
              <Minus className="w-3.5 h-3.5" />
              <span>1</span>
            </button>
            <button
              onClick={handleAddOne}
              className="px-2.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs active:scale-95 transition-all flex items-center gap-1"
              title="เติม 1 แก้ว (250 มล.)"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>แก้ว 250ml</span>
            </button>
            <button
              onClick={handleAddTwo}
              className="px-2.5 py-1.5 rounded-lg bg-sky-100 hover:bg-sky-200 border border-sky-300 text-sky-800 text-xs font-semibold active:scale-95 transition-all flex items-center gap-1"
              title="เติมขวดพกพา (500 มล. = 2 แก้ว)"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ขวด 500ml</span>
            </button>
            <button
              onClick={() => {
                sounds.playWaterDrop();
                const next = waterIntake + 4;
                onUpdateWater(next);
                if (next >= waterTarget && waterIntake < waterTarget) {
                  launchCelebration();
                }
              }}
              className="px-2.5 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 text-xs font-semibold active:scale-95 transition-all flex items-center gap-1 hidden sm:flex"
              title="เติมกระบอกใหญ่ (1,000 มล. = 4 แก้ว)"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>กระบอก 1L</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
