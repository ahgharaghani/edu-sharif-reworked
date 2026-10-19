import React, { useState, useEffect } from 'react';
import { 
  Search, 
  FileText, 
  Calendar, 
  BookOpen, 
  Clock, 
  Award, 
  Plane, 
  CreditCard, 
  Layers, 
  ExternalLink,
  ChevronLeft,
  X
} from 'lucide-react';
import { NavigationModule } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule: (m: NavigationModule) => void;
  onRequestAction?: (actionId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectModule,
  onRequestAction,
}) => {
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const actions = [
    { id: 'dashboard', category: 'ناوبری سامانه', title: 'پیشخوان جامع و آمار آموزشی', icon: Layers, action: () => onSelectModule('dashboard') },
    { id: 'schedule', category: 'ناوبری سامانه', title: 'برنامه هفتگی کلاس‌ها و تقویم', icon: Calendar, action: () => onSelectModule('schedule') },
    { id: 'courses', category: 'ناوبری سامانه', title: 'فرم ثبت‌نام و لیست ۷ درس اخذ شده', icon: BookOpen, action: () => onSelectModule('courses') },
    { id: 'transcript', category: 'امور کارنامه', title: 'مشخصات تحصیلی و ریزنمرات دانشجو', icon: Award, action: () => onSelectModule('transcript') },
    { id: 'exams', category: 'امور آزمون', title: 'لیست امتحانات پایان‌ترم و تشخیص تداخل', icon: Clock, action: () => onSelectModule('exams') },
    { id: 'req_cert', category: 'درخواست‌های آموزشی', title: 'ثبت درخواست گواهی اشتغال به تحصیل', icon: FileText, action: () => { onSelectModule('requests'); onRequestAction?.('certificate'); } },
    { id: 'req_exit', category: 'درخواست‌های آموزشی', title: 'ثبت درخواست مجوز خروج از کشور', icon: Plane, action: () => { onSelectModule('requests'); onRequestAction?.('exit_permit'); } },
    { id: 'req_refund', category: 'امور مالی', title: 'درخواست استرداد وجه و گزارش پرداخت‌ها', icon: CreditCard, action: () => { onSelectModule('requests'); onRequestAction?.('refund'); } },
    { id: 'vc', category: 'پیوندهای شریف', title: 'ورود به سامانه کلاس‌های مجازی (vc.sharif.edu)', icon: ExternalLink, action: () => window.open('https://vc.sharif.edu', '_blank') },
  ];

  const filtered = actions.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="جستجوی سریع بین خدمات، دروس، درخواست‌ها یا صفحات... (مثال: گواهی، برنامه، امتحان)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-4 text-sm bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
          />
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              موردی مطابق با جستجوی شما یافت نشد.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-right group transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {item.category}
                      </div>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-transform group-hover:-translate-x-0.5" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>برای پیمایش از کیبورد استفاده کنید</span>
          <div className="flex items-center gap-1 font-mono text-[10px]">
            <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800">ESC</span>
            <span>بستن</span>
          </div>
        </div>
      </div>
    </div>
  );
};
