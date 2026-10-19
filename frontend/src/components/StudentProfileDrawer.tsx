import React from 'react';
import { 
  X, 
  User, 
  GraduationCap, 
  Calendar, 
  ShieldCheck, 
  Mail, 
  BookOpen, 
  Award, 
  LogOut, 
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { StudentProfile } from '../types';

interface StudentProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile | null;
  onLogout?: () => void;
}

export const StudentProfileDrawer: React.FC<StudentProfileDrawerProps> = ({
  isOpen,
  onClose,
  student,
  onLogout,
}) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl h-full flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">پرونده تحصیلی دانشجو</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Identity Card Header */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-100 dark:border-blue-900/50">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 to-cyan-500 text-white flex items-center justify-center font-extrabold text-2xl shadow-md shrink-0">
              {student.full_name.slice(0, 1)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                {student.full_name}
              </h3>
              <div className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 mt-1">
                شماره دانشجویی: {student.student_id}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {student.major} {student.minor ? `• ماینور: ${student.minor}` : ''}
              </div>
            </div>
          </div>

          {/* Academic Details List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">اطلاعات شناسنامه‌ای و ثبت‌نام</h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">مقطع تحصیلی</span>
                <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{student.degree}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">نیم‌سال ورود</span>
                <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{student.entry_semester}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">جنسیت</span>
                <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{student.gender}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">دانشکده</span>
                <span className="font-bold text-slate-900 dark:text-white mt-0.5 block truncate">{student.department}</span>
              </div>
            </div>
          </div>

          {/* Exemption & Advisor Permissions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">مجوزها و نظام وظیفه</h4>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-medium">مجوز ثبت‌نام استاد راهنما:</span>
                </div>
                <span className="font-bold">صادر شده (نیم‌سال اول)</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="font-medium">معافیت تحصیلی نظام وظیفه:</span>
                </div>
                <span className="font-mono font-bold">{student.exemption_expiry}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-500">
                  <Mail className="w-4 h-4" />
                  <span>پست الکترونیکی شریف:</span>
                </div>
                <div className="font-mono text-slate-800 dark:text-slate-200 font-semibold mt-1">
                  {student.email}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
            >
              بستن پنجره
            </button>
            {onLogout && (
              <button
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>خروج از حساب</span>
              </button>
            )}
          </div>
          <div className="text-[11px] text-slate-400">
            سامانه سپهر نسخه ۷.۰.۳
          </div>
        </div>
      </div>
    </div>
  );
};
