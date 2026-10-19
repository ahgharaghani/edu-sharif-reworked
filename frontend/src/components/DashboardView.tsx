import React from 'react';
import { 
  DashboardOverview, 
  Course 
} from '../types';
import { 
  CheckCircle2, 
  ShieldCheck, 
  BookOpen, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  ExternalLink, 
  MapPin, 
  User, 
  ChevronLeft,
  CalendarCheck
} from 'lucide-react';

interface DashboardViewProps {
  overview: DashboardOverview;
  courses: Course[];
  setActiveTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  overview,
  courses,
  setActiveTab,
}) => {
  const { student } = overview;

  return (
    <div className="space-y-6">

      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-blue-800/40">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>نیم‌سال تحصیلی جاری: {overview.active_semester}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              سلام، {student.full_name} عزیز 👋
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              به سامانه هوشمند و مدرن آموزش شریف خوش آمدید. تمامی اطلاعات تحصیلی، برنامه‌های کلاسی و امتحانات شما به‌صورت لحظه‌ای همگام شده است.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur">
                <User className="w-3.5 h-3.5 text-blue-300" />
                <span>شماره دانشجویی: <strong className="text-white">{student.student_id}</strong></span>
              </span>
              <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg backdrop-blur">
                <span>رشته اصلی: <strong className="text-white">{student.major}</strong></span>
              </span>
              {student.minor && (
                <span className="flex items-center gap-1 bg-amber-500/20 text-amber-200 border border-amber-400/30 px-2.5 py-1 rounded-lg">
                  <span>دوره فرعی (ماینور): <strong>{student.minor}</strong></span>
                </span>
              )}
            </div>
          </div>

          {/* Quick Academic Status Box */}
          <div className="w-full md:w-auto bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 flex flex-col gap-2 min-w-[240px]">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>وضعیت آموزش:</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {student.academic_status}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>مجوز استاد راهنما:</span>
              <span className="font-bold text-emerald-400">تایید و صادر شده</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300 pt-1 border-t border-white/10">
              <span>اتمام معافیت تحصیلی:</span>
              <span className="font-mono text-cyan-300 font-semibold">{student.exemption_expiry}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Units */}
        <div className="glass-card rounded-2xl p-5 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">واحدهای اخذ شده</span>
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{overview.total_units}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">واحد در ۷ درس</span>
          </div>
          <div className="mt-3 flex items-center text-xs text-emerald-600 dark:text-emerald-400 gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>مجاز و نهایی شده در سامانه</span>
          </div>
        </div>

        {/* Academic Degree & Status */}
        <div className="glass-card rounded-2xl p-5 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">مقطع و سال ورود</span>
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900 dark:text-white">{student.degree}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">ورودی ۱۴۰۴</span>
          </div>
          <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            دانشکده مهندسی کامپیوتر
          </div>
        </div>

        {/* Today Classes Count */}
        <div className="glass-card rounded-2xl p-5 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">کلاس‌های امروز</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {overview.today_classes.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">جلسه کلاسی</span>
          </div>
          <button 
            onClick={() => setActiveTab('schedule')}
            className="mt-3 flex items-center text-xs text-blue-600 dark:text-blue-400 hover:underline gap-1"
          >
            <span>مشاهده تقویم هفتگی</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Next Exam */}
        <div className="glass-card rounded-2xl p-5 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">نزدیک‌ترین امتحان</span>
            <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {overview.next_exam ? overview.next_exam.course_title : 'امتحانی ثبت نشده'}
            </div>
            <div className="text-xs font-mono text-rose-600 dark:text-rose-400 font-semibold mt-1">
              {overview.next_exam ? `${overview.next_exam.exam_date} ساعت ${overview.next_exam.exam_time}` : ''}
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('exams')}
            className="mt-2.5 flex items-center text-xs text-blue-600 dark:text-blue-400 hover:underline gap-1"
          >
            <span>برنامه کامل امتحانات</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Main Content Grid: Today's Schedule & Enrolled Courses Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left 2 Cols: Today's Class Timeline & Active Courses */}
        <div className="lg:col-span-2 space-y-6">

          {/* Today's Classes List */}
          <div className="glass-card rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">برنامه کلاسی امروز شما</h2>
              </div>
              <button 
                onClick={() => setActiveTab('schedule')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                مشاهده کل هفته
              </button>
            </div>

            {overview.today_classes.length === 0 ? (
              <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
                امروز کلاسی برای شما تعریف نشده است. از وقت آزاد خود لذت ببرید! ☕
              </div>
            ) : (
              <div className="space-y-3">
                {overview.today_classes.map((cls, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-2.5 h-10 rounded-full"
                        style={{ backgroundColor: cls.color || '#3B82F6' }}
                      ></div>
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white">
                          {cls.course_title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>استاد: {cls.instructor}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                            <MapPin className="w-3 h-3 text-red-500" />
                            {cls.room}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-left font-mono text-sm font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg">
                      {cls.start_time} - {cls.end_time}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Enrolled Courses Quick Summary Table */}
          <div className="glass-card rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">دروس ثبت‌نامی نیم‌سال اول</h2>
              </div>
              <button 
                onClick={() => setActiveTab('courses')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                جزئیات کامل دروس
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500">
                    <th className="pb-3 font-semibold">کد و عنوان درس</th>
                    <th className="pb-3 font-semibold">استاد</th>
                    <th className="pb-3 font-semibold">واحد</th>
                    <th className="pb-3 font-semibold">زمان کلاس</th>
                    <th className="pb-3 font-semibold">امتحان</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {courses.map((course) => (
                    <tr key={course.code} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition">
                      <td className="py-3 font-medium text-slate-800 dark:text-slate-200">
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: course.color || '#3B82F6' }}
                          ></span>
                          <span>{course.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({course.code})</span>
                        </div>
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-400">{course.instructor}</td>
                      <td className="py-3 font-bold text-slate-900 dark:text-white">{course.units}</td>
                      <td className="py-3 text-slate-500 dark:text-slate-400 font-sans">{course.class_times}</td>
                      <td className="py-3 text-slate-600 dark:text-slate-300 font-mono text-[11px]">{course.exam_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right 1 Col: Quick Links, Important Notices & Exemption Box */}
        <div className="space-y-6">

          {/* Military Exemption Alert */}
          <div className="rounded-2xl p-5 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800/40">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">وضعیت نظام وظیفه</h3>
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  تاریخ اتمام معافیت تحصیلی شما در سامانه <strong>{student.exemption_expiry}</strong> ثبت شده است.
                </p>
              </div>
            </div>
          </div>

          {/* Official Sharif Quick Links */}
          <div className="glass-card rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">پیوندها و سامانه‌های شریف</h3>
            <div className="space-y-2">
              <a 
                href="https://vc.sharif.edu" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition group text-xs text-slate-700 dark:text-slate-300"
              >
                <span>کلاس‌های مجازی شریف (CW / VC)</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500" />
              </a>
              <a 
                href="https://ac.sharif.edu/calendar/" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition group text-xs text-slate-700 dark:text-slate-300"
              >
                <span>تقویم رسمی آموزشی دانشگاه</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500" />
              </a>
              <a 
                href="https://ac.sharif.ir/guide/" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition group text-xs text-slate-700 dark:text-slate-300"
              >
                <span>راهنمای فرایندها و قوانین آموزشی</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500" />
              </a>
              <a 
                href="https://my.edu.sharif.edu" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition group text-xs text-slate-700 dark:text-slate-300"
              >
                <span>سامانه ثبت‌نام مقدماتی (MyEdu)</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500" />
              </a>
            </div>
          </div>

          {/* System Info Banner */}
          <div className="glass-card rounded-2xl p-4 text-center text-xs text-slate-400 dark:text-slate-500">
            <div>متصل به سرور سپهر ۷.۰.۳ شریف</div>
            <div className="text-[10px] mt-1 font-mono text-slate-400">آخرین همگام‌سازی: {overview.server_system_time}</div>
          </div>

        </div>

      </div>

    </div>
  );
};
