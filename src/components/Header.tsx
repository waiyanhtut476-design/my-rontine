import React from 'react';
import {
  Sun,
  Flame,
  Settings,
  CheckCircle2,
  Droplet,
  ListTodo,
  Heart,
  BarChart3,
  Clock,
  Cloud,
  CloudCheck,
  LogIn,
  LogOut,
  Smartphone,
} from 'lucide-react';
import { User } from 'firebase/auth';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  streakCount: number;
  overallPercent: number;
  onOpenSettings: () => void;
  onOpenInstallModal?: () => void;
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  isSyncing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  streakCount,
  overallPercent,
  onOpenSettings,
  onOpenInstallModal,
  user,
  onSignIn,
  onSignOut,
  isSyncing,
}) => {
  const tabs = [
    { id: 'routines', label: 'กิจวัตร', icon: Clock },
    { id: 'habits', label: 'นิสัย & ดื่มน้ำ', icon: Droplet },
    { id: 'tasks', label: 'สิ่งที่ต้องทำ', icon: ListTodo },
    { id: 'mood', label: 'บันทึกอารมณ์', icon: Heart },
    { id: 'insights', label: 'สถิติสัปดาห์', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-sm shadow-amber-500/20">
            <Sun className="w-5 h-5 text-white stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
                วันสุข
              </span>
              {user && (
                <span
                  className="flex items-center gap-0.5 text-[10px] text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded-full font-medium"
                  title="เชื่อมต่อ Firebase Cloud แล้ว"
                >
                  <Cloud className="w-3 h-3 text-sky-500" />
                  <span className="hidden sm:inline">{isSyncing ? 'กำลังซิงค์...' : 'คลาวด์'}</span>
                </span>
              )}
            </div>
            <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
              บันทึกชีวิตประจำวัน
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap min-h-[36px] ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions & Quick Stats */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Streak indicator */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200/70 rounded-lg text-amber-700 text-xs font-semibold"
            title={`ต่อเนื่อง ${streakCount} วัน`}
          >
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span className="tabular-nums font-bold">{streakCount}</span>
            <span className="hidden sm:inline font-normal text-amber-600">วันติด</span>
          </div>

          {/* Daily completion percent ring */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200/70 rounded-lg text-emerald-700 text-xs font-semibold"
            title={`ความสำเร็จวันนี้ ${overallPercent}%`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="tabular-nums font-bold">{overallPercent}%</span>
          </div>

          {/* Firebase User Auth Button */}
          {user ? (
            <div className="flex items-center gap-1.5 pl-1 border-l border-slate-200">
              <div
                className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center shrink-0"
                title={`เข้าสู่ระบบในชื่อ ${user.displayName || user.email}`}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-xs font-bold text-slate-600">
                    {user.displayName?.[0] || 'U'}
                  </span>
                )}
              </div>
              <button
                onClick={onSignOut}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="ออกจากระบบ"
                aria-label="ออกจากระบบ"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 rounded-lg text-xs font-semibold transition-colors shrink-0"
              title="ซิงค์ข้อมูลลง Firebase Firestore"
            >
              <LogIn className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden sm:inline">เชื่อมต่อ Cloud</span>
            </button>
          )}

          {/* Add to Home Screen (PWA) button */}
          {onOpenInstallModal && (
            <button
              onClick={onOpenInstallModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0"
              title="เพิ่มไอคอนลงหน้าจอโฮม iOS / Android"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">เพิ่มลงหน้าจอ</span>
            </button>
          )}

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            className="w-9 h-9 rounded-lg border border-slate-200 hover:bg-slate-100 active:scale-95 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
            title="ตั้งค่า"
            aria-label="ตั้งค่าระบบ"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
