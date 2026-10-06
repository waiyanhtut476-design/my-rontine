import React, { useState, useEffect } from 'react';
import { HabitItem } from '../types';
import { X, Activity, Dumbbell, BookOpen, Heart, Sparkles, Coffee, Smile, Edit3 } from 'lucide-react';

interface EditHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  habit: HabitItem | null;
  onSave: (updated: HabitItem) => void;
}

export const EditHabitModal: React.FC<EditHabitModalProps> = ({
  isOpen,
  onClose,
  habit,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState(20);
  const [unit, setUnit] = useState('นาที');
  const [icon, setIcon] = useState('Activity');
  const [color, setColor] = useState('emerald');

  useEffect(() => {
    if (habit) {
      setTitle(habit.title);
      setTarget(habit.target);
      setUnit(habit.unit);
      setIcon(habit.icon || 'Activity');
      setColor(habit.color || 'emerald');
    }
  }, [habit]);

  if (!isOpen || !habit) return null;

  const icons = [
    { name: 'Activity', icon: Activity, label: 'กิจกรรม' },
    { name: 'Dumbbell', icon: Dumbbell, label: 'ออกกำลัง' },
    { name: 'BookOpen', icon: BookOpen, label: 'อ่านหนังสือ' },
    { name: 'Heart', icon: Heart, label: 'สุขภาพใจ' },
    { name: 'Smile', icon: Smile, label: 'ความสุข' },
    { name: 'Coffee', icon: Coffee, label: 'พักผ่อน' },
    { name: 'Sparkles', icon: Sparkles, label: 'พัฒนาตนเอง' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      ...habit,
      title: title.trim(),
      target: Number(target) || 1,
      unit: unit.trim() || 'ครั้ง',
      icon,
      color,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Edit3 className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">แก้ไขเป้าหมายนิสัย</h3>
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ชื่อนิสัย <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น อ่านหนังสือ, ออกกำลังกาย"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                เป้าหมายตัวเลข <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="100000"
                required
                value={target}
                onChange={(e) => setTarget(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                หน่วยนับ <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="นาที, หน้า, กิโลเมตร, ครั้ง"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              เลือกไอคอน:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {icons.map((item) => {
                const Icon = item.icon;
                const isSelected = icon === item.name;
                return (
                  <button
                    type="button"
                    key={item.name}
                    onClick={() => setIcon(item.name)}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 ring-2 ring-emerald-400/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px] truncate max-w-full">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
            >
              บันทึกการแก้ไข
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
