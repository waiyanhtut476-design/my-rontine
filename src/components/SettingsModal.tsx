import React, { useState } from 'react';
import { AppSettings } from '../types';
import { X, Settings, RotateCcw, Volume2, Sparkles, Droplet, User, Check, Download, Upload, Smartphone } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  onResetAllData: () => void;
  onOpenInstallModal?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onResetAllData,
  onOpenInstallModal,
}) => {
  const [userName, setUserName] = useState(settings.userName || '');
  const [dailyWaterTarget, setDailyWaterTarget] = useState(settings.dailyWaterTarget || 8);
  const [enableSounds, setEnableSounds] = useState(settings.enableSounds ?? true);
  const [enableConfetti, setEnableConfetti] = useState(settings.enableConfetti ?? true);
  const [showDailyQuote, setShowDailyQuote] = useState(settings.showDailyQuote ?? true);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      userName: userName.trim() || 'คุณ',
      dailyWaterTarget,
      enableSounds,
      enableConfetti,
      showDailyQuote,
    });
    onClose();
  };

  const handleConfirmReset = () => {
    onResetAllData();
    setShowConfirmReset(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">ตั้งค่าระบบ</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-4 space-y-4">
          {/* User Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>ชื่อเรียกของคุณ</span>
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="เช่น คุณกานต์, แพรว"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 text-slate-800"
            />
          </div>

          {/* Daily Water Target */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-sky-500" />
              <span>เป้าหมายดื่มน้ำต่อวัน</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[6, 8, 10, 12].map((cups) => (
                <button
                  type="button"
                  key={cups}
                  onClick={() => setDailyWaterTarget(cups)}
                  className={`py-2 px-1 rounded-xl border text-xs font-bold transition-all ${
                    dailyWaterTarget === cups
                      ? 'bg-sky-500 border-sky-500 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {cups} แก้ว
                  <span className="block text-[10px] font-normal opacity-80">
                    ({cups * 250} มล.)
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Sound & Confetti Toggles */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-semibold text-slate-700">เสียงเอฟเฟกต์ในการกด</span>
              </div>
              <input
                type="checkbox"
                checked={enableSounds}
                onChange={(e) => setEnableSounds(e.target.checked)}
                className="w-4 h-4 rounded text-slate-900 accent-slate-900 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold text-slate-700">เอฟเฟกต์เฉลิมฉลองความสำเร็จ (Confetti)</span>
              </div>
              <input
                type="checkbox"
                checked={enableConfetti}
                onChange={(e) => setEnableConfetti(e.target.checked)}
                className="w-4 h-4 rounded text-slate-900 accent-slate-900 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <span className="text-amber-600 font-serif font-bold text-sm">“</span>
                <span className="text-xs font-semibold text-slate-700">แสดงข้อคิดพลังบวกประจำวัน</span>
              </div>
              <input
                type="checkbox"
                checked={showDailyQuote}
                onChange={(e) => setShowDailyQuote(e.target.checked)}
                className="w-4 h-4 rounded text-slate-900 accent-slate-900 cursor-pointer"
              />
            </div>
          </div>

          {/* Add to Home Screen / PWA Icon Section */}
          {onOpenInstallModal && (
            <div className="pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  onOpenInstallModal();
                }}
                className="w-full py-2.5 px-3.5 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-200 rounded-xl transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg overflow-hidden border border-amber-300 shadow-xs shrink-0">
                    <img src="/apple-touch-icon.png" alt="Logo" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800">เพิ่มลงหน้าจอโฮม (iOS & Android)</p>
                    <p className="text-[10px] text-slate-500">ดูวิธีติดตั้งและดาวน์โหลดโลโก้แอป</p>
                  </div>
                </div>
                <Smartphone className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          )}

          {/* Backup & Data Portability Section */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              สำรองและกู้คืนข้อมูล (Backup & Restore)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  try {
                    const backup: Record<string, any> = {};
                    for (let i = 0; i < localStorage.length; i++) {
                      const key = localStorage.key(i);
                      if (key && key.startsWith('wansook_')) {
                        backup[key] = JSON.parse(localStorage.getItem(key) || '{}');
                      }
                    }
                    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `wansook-backup-${new Date().toISOString().slice(0, 10)}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  } catch (e) {
                    console.error('Export failed:', e);
                  }
                }}
                className="py-2 px-3 text-xs text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                title="ดาวน์โหลดไฟล์สำรองข้อมูล JSON"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>ส่งออกไฟล์สำรอง</span>
              </button>

              <label className="py-2 px-3 text-xs text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>นำเข้าไฟล์สำรอง</span>
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      try {
                        const parsed = JSON.parse(event.target?.result as string);
                        Object.entries(parsed).forEach(([key, val]) => {
                          if (key.startsWith('wansook_')) {
                            localStorage.setItem(key, JSON.stringify(val));
                          }
                        });
                        window.location.reload();
                      } catch {
                        // ignore invalid json
                      }
                    };
                    reader.readAsText(file);
                  }}
                />
              </label>
            </div>
          </div>

          {/* Reset Data Section */}
          <div className="pt-2 border-t border-slate-100">
            {!showConfirmReset ? (
              <button
                type="button"
                onClick={() => setShowConfirmReset(true)}
                className="w-full py-2 px-3 text-xs text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>รีเซ็ตข้อมูลและคืนค่าตัวอย่างเริ่มต้น</span>
              </button>
            ) : (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-center space-y-2">
                <p className="text-xs text-rose-800 font-semibold">
                  ยืนยันการล้างข้อมูลทั้งหมดหรือไม่? (ข้อมูลจะกลับเป็นค่าเริ่มต้น)
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowConfirmReset(false)}
                    className="px-3 py-1 bg-white border border-slate-200 text-xs font-medium text-slate-700 rounded-lg"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmReset}
                    className="px-3 py-1 bg-rose-600 text-white text-xs font-semibold rounded-lg shadow-xs"
                  >
                    ยืนยันล้างข้อมูล
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              ปิด
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>บันทึกการตั้งค่า</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
