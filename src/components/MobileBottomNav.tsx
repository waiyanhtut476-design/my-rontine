import React from 'react';
import { Clock, Droplet, ListTodo, Heart, BarChart3 } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'routines', label: 'กิจวัตร', icon: Clock },
    { id: 'habits', label: 'นิสัย & น้ำ', icon: Droplet },
    { id: 'tasks', label: 'สิ่งที่ทำ', icon: ListTodo },
    { id: 'mood', label: 'อารมณ์', icon: Heart },
    { id: 'insights', label: 'สถิติ', icon: BarChart3 },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1 shadow-lg">
      <div className="grid grid-cols-5 items-center h-14">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors relative ${
                isActive ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-amber-100/70 text-amber-700' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
              </div>
              <span className="text-[10px] leading-none mt-0.5 tracking-tight truncate max-w-[56px]">
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-amber-600 absolute bottom-1" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
