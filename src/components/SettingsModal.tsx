import React, { useState } from 'react';
import { AppSettings } from '../types';
import { X, Settings, RotateCcw, Volume2, Sparkles, Droplet, User as UserIcon, Check, Download, Upload, LogIn, LogOut, Cloud, ShieldCheck } from 'lucide-react';
import { User } from 'firebase/auth';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  onResetAllData: () => void;
  user?: User | null;
  onSignIn?: () => void;
  onSignOut?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onResetAllData,
  user,
  onSignIn,
  onSignOut,
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
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">ตั้งค่าระบบ & บัญชี</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Gmail / Google Account Card */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>บัญชี Google / Gmail</span>
              </span>
              {user ? (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  ซิงค์คลาวด์แล้ว
                </span>
              ) : (
                <span className="text-[10px] font-medium text-slate-500">
                  ออฟไลน์ (บันทึกในเครื่อง)
                </span>
              )}
            </div>

            {user ? (
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-300 bg-white shrink-0">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="w-full h-full flex items-center justify-center font-bold text-slate-700 text-xs">
                        {user.displayName?.[0] || 'U'}
                      </span>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900 leading-tight">
                      {user.displayName || 'ผู้ใช้งาน'}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate max-w-[170px] sm:max-w-[200px]">
                      {user.email}
                    </p>
                  </div>
                </div>
                {onSignOut && (
                  <button
                    type="button"
                    onClick={onSignOut}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 rounded-xl transition-all shadow-2xs"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>ออกจากระบบ</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                <p className="text-xs text-slate-600">
                  เข้าสู่ระบบด้วย Gmail เพื่อซิงค์ข้อมูลกิจวัตร สิ่งที่ต้องทำ และสถิติข้ามอุปกรณ์อัตโนมัติ
                </p>
                {onSignIn && (
                  <button
                    type="button"
                    onClick={onSignIn}
                    className="w-full py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 hover:border-slate-400 text-slate-800 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 active:scale-98"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Login with Gmail / Google Account</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* User Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5 text-slate-500" />
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
