import React, { useState } from 'react';
import { Course } from '../types';
import { 
  BookOpen, 
  User, 
  Clock, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  Search, 
  Users, 
  AlertCircle 
} from 'lucide-react';

interface CourseCardsViewProps {
  courses: Course[];
}

export const CourseCardsView: React.FC<CourseCardsViewProps> = ({ courses }) => {
  const [search, setSearch] = useState('');

  const filteredCourses = courses.filter((c) => 
    c.title.includes(search) || 
    c.code.includes(search) || 
    c.instructor.includes(search)
  );

  const totalUnits = courses.reduce((acc, c) => acc + c.units, 0);

  return (
    <div className="space-y-6">

      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">دروس اخذ شده نیم‌سال</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            مجموع ۷ درس ({totalUnits} واحد) • نیم‌سال اول ۱۴۰۵-۱۴۰۴
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="جستجو بر اساس نام درس، استاد یا کد..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCourses.map((c) => (
          <div
            key={c.code}
            className="glass-card rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between border border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden group"
          >
            {/* Top Color Accent Line */}
            <div 
              className="absolute top-0 right-0 left-0 h-1.5"
              style={{ backgroundColor: c.color || '#3B82F6' }}
            ></div>

            <div className="space-y-3 pt-1">
              {/* Header Badges */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-lg font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {c.code}-{c.group}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {c.units} واحد
                </span>
              </div>

              {/* Title */}
              <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {c.title}
              </h3>

              {/* Instructor & Enrolled */}
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 pt-1">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium">{c.instructor}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                  <Users className="w-3 h-3" />
                  <span>{c.enrolled_num} دانشجو</span>
                </div>
              </div>

              {/* Schedule Info Box */}
              <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-3 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                {/* Class times */}
                <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 text-[11px]">زمان کلاس: </span>
                    <span className="font-medium font-sans">{c.class_times}</span>
                  </div>
                </div>

                {/* Exam Date */}
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Calendar className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <div>
                    <span className="text-slate-400 text-[11px]">امتحان: </span>
                    <span className="font-mono font-medium text-rose-600 dark:text-rose-400">
                      {c.exam_date} ساعت {c.exam_time}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes or Limitations */}
              {c.notes && (
                <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-amber-50/50 dark:bg-amber-950/20 p-2 rounded-lg border border-amber-200/40 dark:border-amber-900/30 line-clamp-2">
                  {c.notes}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                ✓ وضعیت: {c.status}
              </span>

              {c.virtual_url && (
                <a
                  href={c.virtual_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  <span>کلاس مجازی</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
