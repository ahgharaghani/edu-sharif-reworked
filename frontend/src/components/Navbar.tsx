import React from 'react';
import { 
  GraduationCap, 
  Calendar, 
  BookOpen, 
  Clock, 
  Moon, 
  Sun, 
  UserCheck, 
  Activity,
  Layers
} from 'lucide-react';
import { StudentProfile } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  student: StudentProfile | null;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  serverOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  student,
  darkMode,
  setDarkMode,
  serverOnline
}) => {
  const tabs = [
    { id: 'dashboard', label: 'داشبورد', icon: Layers },
    { id: 'schedule', label: 'برنامه هفتگی', icon: Calendar },
    { id: 'courses', label: 'دروس نیم‌سال', icon: BookOpen },
    { id: 'exams', label: 'برنامه امتحانات', icon: Clock },
  ];

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-cyan-500 p-2 shadow-md flex items-center justify-center text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg bg-gradient-to-r from-blue-700 to-cyan-600 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent">
                  آموزش شریف
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  مدرن v2.0
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                دانشگاه صنعتی شریف • سامانه سپهر
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-900/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Tools (User badge, Dark toggle, Server status) */}
          <div className="flex items-center gap-3">
            {/* Live Gateway Status */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Go Gateway برخط</span>
            </div>

            {/* Student Info Pill */}
            {student && (
              <div className="flex items-center gap-2 py-1 px-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  {student.full_name.slice(0, 1)}
                </div>
                <div className="hidden lg:block text-right">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                    {student.full_name}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    {student.student_id} • {student.major}
                  </div>
                </div>
              </div>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="تغییر تم"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Submenu Navigation */}
        <div className="flex md:hidden overflow-x-auto gap-1 pb-2 pt-1 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
