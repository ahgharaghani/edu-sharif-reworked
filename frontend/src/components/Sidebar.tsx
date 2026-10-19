import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  BookMarked,
  FileText,
  Clock,
  Inbox,
  Award,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Building2,
  SlidersHorizontal,
  FolderGit2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { NavigationModule } from '../types';

interface SidebarProps {
  activeModule: NavigationModule;
  setActiveModule: (m: NavigationModule) => void;
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
  unitsCount: number;
  pendingRequestsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  setActiveModule,
  collapsed,
  setCollapsed,
  unitsCount,
  pendingRequestsCount,
}) => {
  const navSections = [
    {
      title: 'پیشخوان و برنامه‌ریزی',
      items: [
        { id: 'dashboard' as NavigationModule, label: 'داشبورد جامع', icon: LayoutDashboard },
        { id: 'schedule' as NavigationModule, label: 'برنامه هفتگی کلاسی', icon: CalendarDays },
      ],
    },
    {
      title: 'خدمات آموزشی و کارتابل',
      items: [
        { 
          id: 'courses' as NavigationModule, 
          label: 'فرم ثبت‌نام و دروس', 
          icon: BookMarked,
          badge: `${unitsCount} واحد`
        },
        { 
          id: 'requests' as NavigationModule, 
          label: 'کارتابل درخواست‌ها', 
          icon: Inbox,
          badge: pendingRequestsCount > 0 ? `${pendingRequestsCount}` : undefined,
          badgeColor: 'bg-amber-500 text-white'
        },
        { id: 'department_reports' as NavigationModule, label: 'لیست‌های دانشکده', icon: Building2 },
      ],
    },
    {
      title: 'امور کارنامه و ارزیابی',
      items: [
        { id: 'transcript' as NavigationModule, label: 'وضعیت تحصیلی و کارنامه', icon: Award },
        { id: 'exams' as NavigationModule, label: 'برنامه امتحانات پایان‌ترم', icon: Clock },
      ],
    },
    {
      title: 'پیکربندی',
      items: [
        { id: 'preferences' as NavigationModule, label: 'تنظیمات و تم کاربر', icon: SlidersHorizontal },
      ],
    },
  ];

  return (
    <aside 
      className={`relative flex flex-col shrink-0 border-l border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-all duration-300 z-30 select-none ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand & Collapse Toggle */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-500 p-2 shadow-md flex items-center justify-center text-white shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          {!collapsed && (
            <div className="truncate">
              <div className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                <span>سپهر مدرن شریف</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  7.0.3
                </span>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                دانشگاه صنعتی شریف
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title={collapsed ? 'گسترش منو' : 'جمع کردن منو'}
        >
          {collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List with Scrollbar */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
        {navSections.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed && (
              <div className="px-3 pb-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {sec.title}
              </div>
            )}
            <div className="space-y-1">
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveModule(item.id)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!collapsed && item.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold shrink-0 ${
                        item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400')
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* System Status Footer */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>همگام با سرور شریف</span>
            </span>
            <span className="font-mono text-[10px]">HTTP/2 • WebLogic</span>
          </div>
        </div>
      )}
    </aside>
  );
};
