import React, { useState } from 'react';
import { TaskItem, TaskPriority, TaskCategory } from '../types';
import {
  ListTodo,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Briefcase,
  User,
  Heart,
  ShoppingCart,
  Home,
  Clock,
  Flame,
  Search,
  Edit3,
  FileText,
} from 'lucide-react';
import { sounds, launchCelebration } from '../utils/audio';
import { PomodoroTimer } from './PomodoroTimer';

interface TasksSectionProps {
  tasks: TaskItem[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onAddTask: (task: Omit<TaskItem, 'id' | 'completed'>) => void;
  onEditTask: (task: TaskItem) => void;
  onClearCompletedTasks: () => void;
}

export const TasksSection: React.FC<TasksSectionProps> = ({
  tasks,
  onToggleTask,
  onDeleteTask,
  onAddTask,
  onEditTask,
  onClearCompletedTasks,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickTitle, setQuickTitle] = useState('');
  const [quickPriority, setQuickPriority] = useState<TaskPriority>('normal');
  const [quickCategory, setQuickCategory] = useState<TaskCategory>('work');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const categories: Record<TaskCategory, { label: string; icon: React.ElementType }> = {
    work: { label: 'การงาน', icon: Briefcase },
    personal: { label: 'ส่วนตัว', icon: User },
    health: { label: 'สุขภาพ', icon: Heart },
    shopping: { label: 'ช้อปปิ้ง', icon: ShoppingCart },
    home: { label: 'งานบ้าน', icon: Home },
  };

  const priorityLabels: Record<TaskPriority, { label: string; color: string; border: string }> = {
    high: { label: 'สำคัญด่วน', color: 'text-rose-700 bg-rose-50', border: 'border-rose-200' },
    normal: { label: 'ปกติ', color: 'text-sky-700 bg-sky-50', border: 'border-sky-200' },
    low: { label: 'ทั่วไป', color: 'text-slate-600 bg-slate-100', border: 'border-slate-200' },
  };

  const handleToggle = (id: string) => {
    sounds.playPop();
    const task = tasks.find((t) => t.id === id);
    const willBeDone = task ? !task.completed : false;
    onToggleTask(id);

    // If completing all tasks, celebrate
    if (willBeDone) {
      const remaining = tasks.filter((t) => !t.completed && t.id !== id).length;
      if (remaining === 0) {
        launchCelebration();
      }
    }
  };

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    sounds.playPop();
    onAddTask({
      title: quickTitle.trim(),
      priority: quickPriority,
      category: quickCategory,
    });
    setQuickTitle('');
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === 'pending' && task.completed) return false;
    if (filterStatus === 'completed' && !task.completed) return false;
    if (filterCategory !== 'all' && task.category !== filterCategory) return false;
    if (searchQuery.trim() && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Pomodoro Focus Timer */}
      <PomodoroTimer
        tasks={tasks}
        selectedTaskId={selectedTaskId}
        onSelectTask={setSelectedTaskId}
        onCompleteTask={(taskId) => {
          onToggleTask(taskId);
          if (selectedTaskId === taskId) {
            setSelectedTaskId(null);
          }
        }}
      />

      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-violet-600" />
              <span>สิ่งที่ต้องทำประจำวัน (To-Do List)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              จดบันทึกและจัดการงานอย่างมีสมาธิ ไม่พลาดเรื่องสำคัญ
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-slate-500">เสร็จแล้ว</span>
            <span className="px-2 py-0.5 bg-violet-50 text-violet-700 border border-violet-200/60 rounded-lg tabular-nums">
              {completedCount} / {tasks.length}
            </span>
            {completedCount > 0 && (
              <button
                type="button"
                onClick={onClearCompletedTasks}
                className="ml-1 px-2 py-0.5 text-[11px] text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200/60 rounded-lg transition-colors font-medium flex items-center gap-1"
                title="ล้างงานที่ทำเสร็จแล้ว"
              >
                <Trash2 className="w-3 h-3" />
                <span>ล้างที่เสร็จ</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Add Form */}
        <form onSubmit={handleQuickAdd} className="pt-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              placeholder="เพิ่มสิ่งที่ต้องทำวันนี้... (เช่น ซื้อของ, โทรหาคุณแม่)"
              className="flex-1 px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-slate-800 placeholder:text-slate-400"
            />

            <div className="flex items-center gap-2">
              <select
                value={quickCategory}
                onChange={(e) => setQuickCategory(e.target.value as TaskCategory)}
                className="px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-violet-500"
              >
                {Object.entries(categories).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.label}
                  </option>
                ))}
              </select>

              <select
                value={quickPriority}
                onChange={(e) => setQuickPriority(e.target.value as TaskPriority)}
                className="px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-violet-500"
              >
                <option value="high">ด่วนสำคัญ</option>
                <option value="normal">ปกติ</option>
                <option value="low">ทั่วไป</option>
              </select>

              <button
                type="submit"
                disabled={!quickTitle.trim()}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-semibold shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>เพิ่ม</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-xs">
          {/* Status filter */}
          <div className="flex items-center gap-1 bg-white border border-slate-200/80 p-1 rounded-xl shadow-2xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filterStatus === 'all'
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ทั้งหมด ({tasks.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filterStatus === 'pending'
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ยังไม่เสร็จ ({tasks.length - completedCount})
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filterStatus === 'completed'
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              เสร็จแล้ว ({completedCount})
            </button>
          </div>

          {/* Search Box & Clear completed */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหางาน..."
                className="w-full pl-7 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500 text-slate-800"
              />
            </div>

            {completedCount > 0 && (
              <button
                onClick={onClearCompletedTasks}
                className="text-[11px] text-slate-500 hover:text-rose-600 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 transition-colors whitespace-nowrap"
                title="ล้างงานที่ทำเสร็จแล้วออกจากรายการ"
              >
                ล้างที่เสร็จ ({completedCount})
              </button>
            )}
          </div>
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-2.5 py-1 rounded-lg font-medium border text-xs transition-all ${
              filterCategory === 'all'
                ? 'bg-violet-50 text-violet-700 border-violet-200 font-semibold'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            ทุกหมวด
          </button>
          {Object.entries(categories).map(([catKey, catVal]) => (
            <button
              key={catKey}
              onClick={() => setFilterCategory(catKey)}
              className={`px-2.5 py-1 rounded-lg font-medium border text-xs transition-all whitespace-nowrap ${
                filterCategory === catKey
                  ? 'bg-violet-50 text-violet-700 border-violet-200 font-semibold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {catVal.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
        {filteredTasks.length === 0 ? (
          <div className="py-10 text-center text-slate-400 text-xs">
            <ListTodo className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p>ไม่มีรายการสิ่งที่ต้องทำในหมวดนี้</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTasks.map((task) => {
              const pri = priorityLabels[task.priority];
              const cat = categories[task.category];
              const CatIcon = cat ? cat.icon : Briefcase;
              const isDone = task.completed;

              return (
                <div
                  key={task.id}
                  className={`group flex items-center justify-between p-3 rounded-xl border transition-all ${
                    isDone
                      ? 'bg-slate-50/70 border-slate-200/50 text-slate-400'
                      : 'bg-white hover:bg-slate-50/50 border-slate-200/80 text-slate-800'
                  }`}
                >
                  <div
                    onClick={() => handleToggle(task.id)}
                    className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                  >
                    {/* Checkbox */}
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                        isDone
                          ? 'bg-violet-600 text-white shadow-xs'
                          : 'border-2 border-slate-300 hover:border-slate-400 bg-white'
                      }`}
                    >
                      {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    {/* Category Icon */}
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isDone ? 'bg-slate-100 text-slate-400' : 'bg-slate-100 text-slate-600'
                      }`}
                      title={cat?.label}
                    >
                      <CatIcon className="w-3.5 h-3.5" />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p
                          className={`text-sm font-medium truncate ${
                            isDone ? 'line-through text-slate-400' : 'text-slate-800'
                          }`}
                        >
                          {task.title}
                        </p>
                      </div>

                        {task.note && (
                          <p className="text-[11px] text-slate-500 italic mt-0.5 truncate max-w-md">
                            "{task.note}"
                          </p>
                        )}

                        {/* Metadata row */}
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span className={`px-1.5 py-0.2 rounded border text-[10px] ${pri.color} ${pri.border}`}>
                            {pri.label}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{cat?.label}</span>
                          {task.dueTime && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="flex items-center gap-0.5 font-mono">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {task.dueTime} น.
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 ml-2">
                      {!isDone && (
                        <button
                          onClick={() => setSelectedTaskId(selectedTaskId === task.id ? null : task.id)}
                          className={`p-1.5 rounded-lg transition-all text-xs flex items-center gap-1 ${
                            selectedTaskId === task.id
                              ? 'bg-rose-100 text-rose-700 font-semibold'
                              : 'opacity-70 group-hover:opacity-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                          }`}
                          title={selectedTaskId === task.id ? 'กำลังโฟกัสงานนี้' : 'โฟกัสงานนี้ด้วย Pomodoro'}
                          aria-label="โฟกัสงานนี้ด้วย Pomodoro"
                        >
                          <Flame className={`w-3.5 h-3.5 ${selectedTaskId === task.id ? 'fill-rose-500 text-rose-500' : ''}`} />
                          <span className="text-[11px] hidden sm:inline">โฟกัส</span>
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditTask(task);
                        }}
                        className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
                        title="แก้ไขงานนี้"
                        aria-label="แก้ไขงานนี้"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteTask(task.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                        title="ลบงานนี้"
                        aria-label="ลบงานนี้"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
