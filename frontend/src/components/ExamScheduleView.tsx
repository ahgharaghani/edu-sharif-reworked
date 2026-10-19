import React from 'react';
import { ExamItem } from '../types';
import { Clock, CheckCircle2, AlertTriangle, Calendar, Download, User } from 'lucide-react';

interface ExamScheduleViewProps {
  exams: ExamItem[];
}

export const ExamScheduleView: React.FC<ExamScheduleViewProps> = ({ exams }) => {
  const hasAnyClash = exams.some((e) => e.has_clash);

  // Generate an .ics iCalendar file for all exams
  const handleExportICS = () => {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Sharif Edu Wrapper//FA\n";
    exams.forEach((e) => {
      icsContent += "BEGIN:VEVENT\n";
      icsContent += `SUMMARY:امتحان ${e.course_title}\n`;
      icsContent += `DESCRIPTION:استاد: ${e.instructor} | کد: ${e.course_code}\n`;
      icsContent += `LOCATION:دانشگاه صنعتی شریف\n`;
      icsContent += "END:VEVENT\n";
    });
    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sharif_exams.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">برنامه امتحانات پایان‌ترم</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            نیم‌سال اول ۱۴۰۵-۱۴۰۴ • مرتب‌شده به ترتیب تاریخ برگزاری
          </p>
        </div>

        <button
          onClick={handleExportICS}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow transition"
        >
          <Download className="w-4 h-4" />
          <span>خروجی به تقویم گوگل (iCal)</span>
        </button>
      </div>

      {/* Conflict Detector Alert */}
      <div className={`p-4 rounded-2xl border flex items-center gap-3 ${
        hasAnyClash
          ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200'
          : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300'
      }`}>
        {hasAnyClash ? (
          <>
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            <div className="text-xs">
              <strong className="font-bold">هشدار تداخل امتحانی:</strong> دو یا چند امتحان در تاریخ و ساعت یکسان برگزار می‌شوند. لطفاً با آموزش دانشکده هماهنگ کنید.
            </div>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="text-xs">
              <strong className="font-bold">برنامه منظم و بدون تداخل:</strong> تبریک! هیچ تداخلی در تاریخ و ساعات امتحانات شما وجود ندارد.
            </div>
          </>
        )}
      </div>

      {/* Chronological Exam Timeline Cards */}
      <div className="space-y-3">
        {exams.map((exam, index) => (
          <div
            key={exam.course_code}
            className="glass-card rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-200 dark:border-slate-800"
          >
            {/* Left: Step number and title */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-extrabold text-sm text-slate-700 dark:text-slate-300 shrink-0">
                {index + 1}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {exam.course_title}
                  </h3>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {exam.course_code}
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
                  <User className="w-3.5 h-3.5" />
                  <span>استاد: {exam.instructor}</span>
                </div>
              </div>
            </div>

            {/* Right: Date & Time pill */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
              <div className="text-right">
                <div className="text-sm font-bold font-mono text-slate-900 dark:text-white flex items-center gap-1.5 justify-end">
                  <Calendar className="w-4 h-4 text-rose-500" />
                  <span>{exam.exam_date}</span>
                </div>
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                  ساعت {exam.exam_time}
                </div>
              </div>

              <div className="text-xs px-3 py-1.5 rounded-xl font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
                امتحان نهایی
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
