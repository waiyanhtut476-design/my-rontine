import React, { useState } from 'react';
import { TimeOfDay, RoutineItem } from '../types';
import { X, Clock, Sparkles } from 'lucide-react';

interface AddRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (routine: Omit<RoutineItem, 'id' | 'completed'>) => void;
  defaultTimeOfDay?: TimeOfDay;
}

export const AddRoutineModal: React.FC<AddRoutineModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  defaultTimeOfDay = 'morning',
}) => {
  const [title, setTitle] = useState('');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(defaultTimeOfDay);
  const [time, setTime] = useState('07:00');
  const [icon, setIcon] = useState('Sparkles');

  if (!isOpen) return null;

  const quickPresets = [
    { title: 'ดื่มน้ำเปล่า 1 แก้ว', timeOfDay: 'morning', time: '06:30', icon: 'Droplets' },
    { title: 'ทานวิตามิน / ยาประจำตัว', timeOfDay: 'morning', time: '07:30', icon: 'Sparkles' },
    { title: 'นั่งสมาธิ / ฝึกหายใจ 5 นาที', timeOfDay: 'morning', time: '08:00', icon: 'Target' },
    { title: 'พักสายตาจากการทำงาน 15 นาที', timeOfDay: 'afternoon', time: '13:00', icon: 'Eye' },
    { title: 'จิบน้ำแก้วบ่ายแก้ง่วง', timeOfDay: 'afternoon', time: '14:30', icon: 'Droplets' },
    { title: 'ยืดเหยียดร่างกายหลังเลิกงาน', timeOfDay: 'evening', time: '18:00', icon: 'Flame' },
    { title: 'วางโทรศัพท์มือถือก่อนนอน', timeOfDay: 'night', time: '21:30', icon: 'Smartphone' },
    { title: 'ทบทวนเรื่องดีๆ และขอบคุณวันนี้', timeOfDay: 'night', time: '22:00', icon: 'BookHeart' },
  ];

  const handleApplyPreset = (p: typeof quickPresets[0]) => {
    setTitle(p.title);
    setTimeOfDay(p.timeOfDay as TimeOfDay);
    setTime(p.time);
    setIcon(p.icon);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      timeOfDay,
      time,
      icon,
    });
    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">เพิ่มกิจวัตรใหม่</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Quick presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              เลือกจากตัวอย่างยอดนิยม:
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
              {quickPresets.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleApplyPreset(preset)}
                  className="px-2.5 py-1 text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 transition-colors text-left"
                >
                  {preset.title}
                </button>
              ))}
            </div>
          </div>

          {/* Routine Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ชื่อกิจวัตร <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="เช่น ดื่มน้ำเปล่า 1 แก้ว, วิ่งรอบหมู่บ้าน"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 text-slate-800"
            />
          </div>

          {/* Time of Day & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ช่วงเวลา
              </label>
              <select
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value as TimeOfDay)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-amber-500"
              >
                <option value="morning">เช้า</option>
                <option value="afternoon">กลางวัน</option>
                <option value="evening">เย็น</option>
                <option value="night">ก่อนนอน</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                เวลาโดยประมาณ
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          {/* Buttons */}
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
              บันทึกกิจวัตร
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
