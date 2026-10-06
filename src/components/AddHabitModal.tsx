import React, { useState } from 'react';
import { HabitItem } from '../types';
import { X, Activity, Dumbbell, BookOpen, Heart, Sparkles, Coffee, Smile } from 'lucide-react';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (habit: Omit<HabitItem, 'id' | 'current'>) => void;
}

export const AddHabitModal: React.FC<AddHabitModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState(20);
  const [unit, setUnit] = useState('นาที');
  const [icon, setIcon] = useState('Activity');
  const [color, setColor] = useState('emerald');

  if (!isOpen) return null;

  const presets = [
    { title: 'นั่งสมาธิ / หายใจลึกๆ', target: 10, unit: 'นาที', icon: 'Smile', color: 'indigo' },
    { title: 'ฝึกภาษาอังกฤษ', target: 20, unit: 'นาที', icon: 'BookOpen', color: 'blue' },
    { title: 'เดินยืดเส้นระหว่างวัน', target: 15, unit: 'นาที', icon: 'Activity', color: 'emerald' },
    { title: 'งดทานของหวาน / น้ำตาล', target: 1, unit: 'วัน', icon: 'Heart', color: 'rose' },
    { title: 'อ่านบทความพัฒนาตนเอง', target: 15, unit: 'นาที', icon: 'BookOpen', color: 'amber' },
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setTitle(p.title);
    setTarget(p.target);
    setUnit(p.unit);
    setIcon(p.icon);
    setColor(p.color);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      target: Number(target) || 1,
      unit: unit.trim() || 'ครั้ง',
      icon,
      color,
    });
    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">เพิ่มเป้าหมายนิสัยใหม่</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              เลือกจากตัวอย่างยอดนิยม:
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {presets.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleApplyPreset(p)}
                  className="px-2.5 py-1 text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 transition-colors text-left"
                >
                  {p.title} ({p.target} {p.unit})
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ชื่อนิสัยที่ต้องการสร้าง <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น นั่งสมาธิ, เล่นโยคะ, อ่านหนังสือ"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                เป้าหมายต่อวัน
              </label>
              <input
                type="number"
                min="1"
                required
                value={target}
                onChange={(e) => setTarget(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                หน่วย
              </label>
              <input
                type="text"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="เช่น นาที, หน้า, ครั้ง, แก้ว"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 rounded-xl shadow-xs transition-colors"
            >
              บันทึกนิสัย
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
