import React from 'react';
import { 
  Search, 
  Bell, 
  Moon, 
  Sun, 
  User, 
  ChevronDown, 
  Sparkles,
  Command,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { StudentProfile } from '../types';

interface TopHeaderProps {
  student: StudentProfile | null;
  onOpenCommandPalette: () => void;
  onOpenStudentDrawer: () => void;
  onLogout?: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  activeSemester: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  student,
  onOpenCommandPalette,
  onOpenStudentDrawer,
  onLogout,
  darkMode,
  setDarkMode,
  activeSemester,
}) => {
  return (
    <header className="h-16 px-6 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md flex items-center justify-between gap-4 sticky top-0 z-20">
      
      {/* Search Bar / Ctrl+K trigger */}
      <div className="flex-1 max-w-md">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-700/70 text-slate-400 border border-slate-200 dark:border-slate-700/60 transition group text-right"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
            <span className="truncate">جستجوی خدمات، دروس، درخواست‌ها...</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </button>
      </div>

      {/* Right Tools & Profile */}
      <div className="flex items-center gap-3">

        {/* Active Semester Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-700 dark:text-blue-300 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>{activeSemester}</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title="تغییر تم"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Icon with Badge */}
        <button
          onClick={onOpenStudentDrawer}
          className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title="پیام‌ها و اعلان‌های آموزشی"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-blue-600"></span>
        </button>

        {/* Student Profile Trigger Button */}
        {student && (
          <button
            onClick={onOpenStudentDrawer}
            className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 transition"
          >
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {student.full_name}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                {student.student_id}
              </div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {student.full_name.slice(0, 1)}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        )}

        {/* Logout Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="p-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-900/60 transition"
            title="خروج از سامانه"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}

      </div>
    </header>
  );
};
