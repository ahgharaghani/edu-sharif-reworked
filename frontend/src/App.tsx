import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { CommandPalette } from './components/CommandPalette';
import { StudentProfileDrawer } from './components/StudentProfileDrawer';

import { DashboardView } from './components/DashboardView';
import { WeeklyScheduleView } from './components/WeeklyScheduleView';
import { CourseCardsView } from './components/CourseCardsView';
import { ExamScheduleView } from './components/ExamScheduleView';
import { RequestsCartableView } from './components/RequestsCartableView';
import { TranscriptAndGradesView } from './components/TranscriptAndGradesView';
import { DepartmentReportsView } from './components/DepartmentReportsView';
import { PreferencesView } from './components/PreferencesView';
import { LoginView } from './components/LoginView';

import { DashboardOverview, Course, ScheduleItem, ExamItem, NavigationModule } from './types';
import { Loader2, RefreshCw, ChevronLeft, Home } from 'lucide-react';

export const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeModule, setActiveModule] = useState<NavigationModule>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [studentDrawerOpen, setStudentDrawerOpen] = useState<boolean>(false);

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const checkAuthStatus = async () => {
    try {
      const res = await fetch('/api/auth/status', { credentials: 'include' });
      if (!res.ok) throw new Error('Status error');
      const data = await res.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
        loadData();
      } else {
        setIsAuthenticated(false);
        setLoading(false);
      }
    } catch (err) {
      console.error('Check auth error:', err);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsAuthenticated(false);
      setOverview(null);
      setCourses([]);
      setSchedule([]);
      setExams([]);
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, coursesRes, schedRes, examsRes] = await Promise.all([
        fetch('/api/dashboard', { credentials: 'include' }),
        fetch('/api/courses', { credentials: 'include' }),
        fetch('/api/schedule', { credentials: 'include' }),
        fetch('/api/exams', { credentials: 'include' }),
      ]);

      if (!dashRes.ok) throw new Error('خطا در دریافت اطلاعات داشبورد از سرور');

      const dashData: DashboardOverview = await dashRes.json();
      const coursesData: Course[] = await coursesRes.json();
      const schedData: ScheduleItem[] = await schedRes.json();
      const examsData: ExamItem[] = await examsRes.json();

      setOverview(dashData);
      setCourses(coursesData);
      setSchedule(schedData);
      setExams(examsData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'خطا در ارتباط با گیت‌وی آموزش');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const getBreadcrumbTitle = (module: NavigationModule): string => {
    switch (module) {
      case 'dashboard': return 'پیشخوان جامع';
      case 'schedule': return 'برنامه هفتگی کلاسی';
      case 'courses': return 'فرم ثبت‌نام و لیست دروس';
      case 'requests': return 'کارتابل و درخواست‌های آموزشی';
      case 'transcript': return 'وضعیت تحصیلی و کارنامه کلی';
      case 'exams': return 'برنامه امتحانات پایان‌ترم';
      case 'department_reports': return 'لیست‌های دانشکده';
      case 'preferences': return 'مطلوبات و تنظیمات کاربر';
      default: return '';
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
        <p className="text-xs text-slate-500 font-medium">در حال بررسی وضعیت اتصال به سامانه آموزش شریف...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginView
        onLoginSuccess={(_student) => {
          setIsAuthenticated(true);
          loadData();
        }}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectModule={(mod) => setActiveModule(mod)}
      />

      {/* Student Dossier Slide-Over Drawer */}
      <StudentProfileDrawer
        isOpen={studentDrawerOpen}
        onClose={() => setStudentDrawerOpen(false)}
        student={overview?.student ?? null}
        onLogout={handleLogout}
      />

      {/* Collapsible Institutional Sidebar */}
      <Sidebar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        unitsCount={overview?.total_units ?? 19}
        pendingRequestsCount={overview?.pending_requests ?? 1}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <TopHeader
          student={overview?.student ?? null}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onOpenStudentDrawer={() => setStudentDrawerOpen(true)}
          onLogout={handleLogout}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          activeSemester={overview?.active_semester || 'نیم‌سال اول ۱۴۰۵-۱۴۰۴'}
        />

        {/* Breadcrumb strip */}
        <div className="px-6 py-2.5 border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-100/40 dark:bg-slate-900/40 flex items-center gap-2 text-xs text-slate-500">
          <button 
            onClick={() => setActiveModule('dashboard')}
            className="flex items-center gap-1 hover:text-blue-600 transition"
          >
            <Home className="w-3.5 h-3.5" />
            <span>سامانه آموزش</span>
          </button>
          <ChevronLeft className="w-3 h-3 text-slate-400" />
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {getBreadcrumbTitle(activeModule)}
          </span>
        </div>

        {/* Content Canvas */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                در حال بارگذاری اطلاعات سامانه سپهر شریف...
              </p>
            </div>
          ) : error ? (
            <div className="glass-card max-w-md mx-auto my-12 p-6 rounded-2xl text-center space-y-4">
              <div className="text-3xl">⚠️</div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white">خطا در دریافت اطلاعات</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{error}</p>
              <button
                onClick={loadData}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>تلاش مجدد</span>
              </button>
            </div>
          ) : overview ? (
            <>
              {activeModule === 'dashboard' && (
                <DashboardView
                  overview={overview}
                  courses={courses}
                  setActiveTab={(tab: any) => setActiveModule(tab)}
                />
              )}
              {activeModule === 'schedule' && (
                <WeeklyScheduleView schedule={schedule} />
              )}
              {activeModule === 'courses' && (
                <CourseCardsView courses={courses} />
              )}
              {activeModule === 'requests' && (
                <RequestsCartableView />
              )}
              {activeModule === 'transcript' && (
                <TranscriptAndGradesView
                  student={overview.student}
                  courses={courses}
                />
              )}
              {activeModule === 'exams' && (
                <ExamScheduleView exams={exams} />
              )}
              {activeModule === 'department_reports' && (
                <DepartmentReportsView currentCourses={courses} />
              )}
              {activeModule === 'preferences' && (
                <PreferencesView darkMode={darkMode} setDarkMode={setDarkMode} />
              )}
            </>
          ) : null}
        </main>
      </div>

    </div>
  );
};

export default App;
