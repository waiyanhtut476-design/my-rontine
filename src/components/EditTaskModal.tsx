import React, { useState, useEffect } from 'react';
import { TaskItem, TaskPriority, TaskCategory } from '../types';
import { X, Edit3 } from 'lucide-react';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskItem | null;
  onSave: (updated: TaskItem) => void;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  isOpen,
  onClose,
  task,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('normal');
  const [category, setCategory] = useState<TaskCategory>('work');
  const [dueTime, setDueTime] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setPriority(task.priority);
      setCategory(task.category);
      setDueTime(task.dueTime || '');
      setNote(task.note || '');
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      ...task,
      title: title.trim(),
      priority,
      category,
      dueTime: dueTime.trim() || undefined,
      note: note.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-800 flex items-center justify-center">
              <Edit3 className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">แก้ไขสิ่งที่ต้องทำ</h3>
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
              ชื่องาน / สิ่งที่ต้องทำ <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500 text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                หมวดหมู่
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-violet-500"
              >
                <option value="work">การงาน (Work)</option>
                <option value="personal">ส่วนตัว (Personal)</option>
                <option value="health">สุขภาพ (Health)</option>
                <option value="shopping">ซื้อของ (Shopping)</option>
                <option value="home">งานบ้าน (Home)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ระดับความสำคัญ
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-violet-500"
              >
                <option value="high">สำคัญด่วน (High)</option>
                <option value="normal">ปกติ (Normal)</option>
                <option value="low">ทั่วไป (Low)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              เวลาส่งมอบหรือนัดหมาย
            </label>
            <input
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-violet-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              โน้ตหรือรายละเอียดเพิ่มเติม
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500 text-slate-800 resize-none"
            />
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
              className="px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-40 rounded-xl shadow-xs transition-colors"
            >
              บันทึกการแก้ไข
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
