import React, { useState, useEffect } from 'react';
import { RoutineItem, TimeOfDay } from '../types';
import { X, Clock, Edit3 } from 'lucide-react';

interface EditRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  routine: RoutineItem | null;
  onSave: (updated: RoutineItem) => void;
}

export const EditRoutineModal: React.FC<EditRoutineModalProps> = ({
  isOpen,
  onClose,
  routine,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
  const [time, setTime] = useState('07:00');

  useEffect(() => {
    if (routine) {
      setTitle(routine.title);
      setTimeOfDay(routine.timeOfDay);
      setTime(routine.time || '07:00');
    }
  }, [routine]);

  if (!isOpen || !routine) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      ...routine,
      title: title.trim(),
      timeOfDay,
      time,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Edit3 className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">แก้ไขกิจวัตร</h3>
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
              ชื่อกิจวัตร <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 text-slate-800"
            />
          </div>

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
              บันทึกการแก้ไข
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
