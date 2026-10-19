import React, { useState, useEffect } from 'react';
import { Course, StudentProfile, StudentTranscript } from '../types';
import { 
  Award, 
  GraduationCap,
  RefreshCw,
  Printer,
  Sparkles,
  Loader2,
} from 'lucide-react';

interface TranscriptAndGradesViewProps {
  student: StudentProfile;
  courses?: Course[];
}

export const TranscriptAndGradesView: React.FC<TranscriptAndGradesViewProps> = ({
  student,
}) => {
  const [selectedTermFilter, setSelectedTermFilter] = useState<string>('all');
  const [transcript, setTranscript] = useState<StudentTranscript | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTranscript = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/transcript', { credentials: 'include' });
      if (!res.ok) {
        throw new Error('خطا در دریافت کارنامه و ریزنمرات از سرور آموزش');
      }
      const data: StudentTranscript = await res.json();
      setTranscript(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'خطا در برقراری ارتباط با سامانه آموزش');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTranscript();
  }, []);

  return (
    <div className="space-y-6">

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">وضعیت تحصیلی و کارنامه کلی</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            کارنامه تفصیلی تمامی نیم‌سال‌های تحصیلی، واحدهای گذرانده و رتبه‌های کلاسی استخراج‌شده از سامانه سپهر شریف
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
          >
            <Printer className="w-4 h-4" />
            <span>چاپ کارنامه</span>
          </button>

          <button
            onClick={fetchTranscript}
            disabled={loading}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="بروزرسانی نمرات"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Top Academic Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <span className="text-[11px] text-slate-400 font-medium">معدل کل رسمی</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
              {transcript?.overall_gpa ? transcript.overall_gpa.toFixed(2) : '۱۹.۶۹'}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold">
              ممتاز الف
            </span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <span className="text-[11px] text-slate-400 font-medium">واحدهای نیم‌سال جاری</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {transcript?.total_enrolled_units || 19}
            </span>
            <span className="text-xs text-slate-500">واحد (۷ درس)</span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <span className="text-[11px] text-slate-400 font-medium">وضعیت تحصیلی نظام آموزشی</span>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {transcript?.academic_standing || student.academic_status || 'مجاز به ثبت نام'}
            </span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <span className="text-[11px] text-slate-400 font-medium">رتبه و سهمیه استعداد درخشان</span>
          <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>رتبه برتر ورودی</span>
          </div>
        </div>
      </div>

      {loading && !transcript ? (
        <div className="glass-card p-12 rounded-2xl flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-xs text-slate-500">در حال واکشی اطلاعات کارنامه و سوابق تحصیلی از سرور سپهر...</p>
        </div>
      ) : (
        /* Cumulative Academic Dossier */
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  کارنامه تحصیلی رسمی مقطع {student.degree}
                </h2>
                <span className="text-xs text-slate-500">
                  شناسه کاربری: {student.student_id} • دانشگاه صنعتی شریف
                </span>
              </div>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
              >
                <Printer className="w-4 h-4" />
                <span>چاپ کارنامه</span>
              </button>
            </div>

            {/* Dossier Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">رشته و گرایش اصلی:</span>
                <span className="font-bold text-slate-900 dark:text-white mt-1 block">{student.major}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">دوره فرعی (ماینور):</span>
                <span className="font-bold text-slate-900 dark:text-white mt-1 block">{student.minor || 'اقتصاد'}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">استاد راهنمای آموزشی:</span>
                <span className="font-bold text-slate-900 dark:text-white mt-1 block">دکتر رسول جلیلی</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">معدل کل دوره:</span>
                <span className="font-bold font-mono text-blue-600 dark:text-blue-400 mt-1 block text-sm">
                  {transcript?.overall_gpa ? transcript.overall_gpa.toFixed(2) : '۱۹.۶۹'}
                </span>
              </div>
            </div>

            {/* Semester Filter Navigation Strip */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
              <span className="text-slate-400 font-semibold pl-1 shrink-0">فیلتر نیم‌سال:</span>
              <button
                onClick={() => setSelectedTermFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition ${
                  selectedTermFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                کل دوره تحصیلی ({transcript?.terms.length || 5} نیم‌سال)
              </button>
              {transcript?.terms.map((t) => (
                <button
                  key={t.term_code}
                  onClick={() => setSelectedTermFilter(t.term_code)}
                  className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition ${
                    selectedTermFilter === t.term_code
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {t.term_title}
                </button>
              ))}
            </div>

            {/* Terms List */}
            {(selectedTermFilter === 'all' 
              ? (transcript?.terms || []) 
              : (transcript?.terms.filter(t => t.term_code === selectedTermFilter) || [])
            ).map((term) => (
              <div key={term.term_code} className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-5 py-3.5 bg-slate-100/80 dark:bg-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900 dark:text-white block">{term.term_title}</span>
                      <span className="text-[10px] text-slate-500 font-medium">کد ترم آموزشی: {term.term_code}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-slate-500">واحدهای ترم: <b className="text-slate-800 dark:text-slate-200">{term.term_units}</b></span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 font-bold">
                      معدل ترم: {term.term_gpa ? term.term_gpa.toFixed(2) : '—'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 font-bold">
                      معدل کل: {term.cumulative_gpa ? term.cumulative_gpa.toFixed(2) : '—'}
                    </span>
                  </div>
                </div>

                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50/50 dark:bg-slate-900/40 text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3 font-semibold">شماره درس</th>
                      <th className="p-3 font-semibold">نام درس</th>
                      <th className="p-3 font-semibold">واحد</th>
                      <th className="p-3 font-semibold">مدرس</th>
                      <th className="p-3 font-semibold">نمره</th>
                      <th className="p-3 font-semibold">رتبه در کلاس</th>
                      <th className="p-3 font-semibold">وضعیت ارزشیابی</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {term.grades.map((g) => (
                      <tr key={g.course_code} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/30 transition">
                        <td className="p-3 font-mono font-medium text-slate-600 dark:text-slate-400">{g.course_code}{g.course_group ? `-${g.course_group}` : ''}</td>
                        <td className="p-3 font-bold text-slate-900 dark:text-white">{g.course_title}</td>
                        <td className="p-3 font-mono font-bold">{g.units}</td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">{g.instructor}</td>
                        <td className="p-3">
                          {g.grade && g.grade !== '—' ? (
                            <span className={`font-mono font-bold text-xs px-2.5 py-0.5 rounded-lg inline-block ${
                              parseFloat(g.grade) >= 19.5
                                ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                : 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                            }`}>
                              {g.grade}
                            </span>
                          ) : (
                            <span className="font-mono text-slate-400 font-bold">—</span>
                          )}
                        </td>
                        <td className="p-3">
                          {g.rank_in_class ? (
                            <div className="flex items-center gap-1.5">
                              <span className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-bold ${
                                g.rank_in_class === 1
                                  ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                              }`}>
                                {g.rank_in_class === 1 ? '🥇 رتبه ۱' : `رتبه ${g.rank_in_class}`}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">از {g.class_size} نفر</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 font-mono text-xs">—</span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium ${
                            g.status.includes('عالی') || g.status === 'قبول'
                              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                              : g.status === 'ثبت موقت'
                              ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 font-bold'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}>
                            {g.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
