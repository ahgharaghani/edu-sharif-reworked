import React, { useState } from 'react';
import { Building2, Search, BookOpen, User, MapPin, Users, Filter } from 'lucide-react';
import { Course } from '../types';

interface DepartmentReportsViewProps {
  currentCourses: Course[];
}

export const DepartmentReportsView: React.FC<DepartmentReportsViewProps> = ({ currentCourses }) => {
  const [selectedDept, setSelectedDept] = useState('40');
  const [search, setSearch] = useState('');

  const departments = [
    { code: '40', name: 'دانشکده مهندسی کامپیوتر' },
    { code: '22', name: 'دانشکده علوم ریاضی' },
    { code: '44', name: 'دانشکده مدیریت و اقتصاد' },
    { code: '20', name: 'دانشکده فیزیک' },
    { code: '37', name: 'گروه معارف و علوم انسانی' },
    { code: '25', name: 'دانشکده مهندسی برق' },
    { code: '28', name: 'دانشکده مهندسی مکانیک' },
    { code: '18', name: 'دانشکده مهندسی صنایع' },
  ];

  return (
    <div className="space-y-6">

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">لیست‌های دانشکده و دروس ارائه‌شده</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            مشاهده ظرفیت، اساتید، زمان‌بندی و محل کلاس‌های ارائه‌شده در سطح دانشگاه صنعتی شریف
          </p>
        </div>

        {/* Department Selector */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {departments.map((d) => (
              <option key={d.code} value={d.code}>
                {d.name} ({d.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Department Course Catalog Table */}
      <div className="glass-card rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            دروس ارائه‌شده در نیم‌سال جاری (نیم‌سال اول ۱۴۰۵-۱۴۰۴)
          </h2>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="جستجو در دروس..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-9 pl-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">شماره و گروه</th>
                <th className="pb-3 font-semibold">نام درس</th>
                <th className="pb-3 font-semibold">واحد</th>
                <th className="pb-3 font-semibold">استاد درس</th>
                <th className="pb-3 font-semibold">تعداد ثبت‌نامی</th>
                <th className="pb-3 font-semibold">زمان کلاس</th>
                <th className="pb-3 font-semibold">امتحان پایان‌ترم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {currentCourses.map((c) => (
                <tr key={c.code} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition">
                  <td className="py-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                    {c.code}-{c.group}
                  </td>
                  <td className="py-3 font-bold text-slate-900 dark:text-white">
                    {c.title}
                  </td>
                  <td className="py-3 font-bold text-slate-700 dark:text-slate-300 font-mono">
                    {c.units}
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-400">
                    {c.instructor}
                  </td>
                  <td className="py-3 font-mono text-slate-500">
                    {c.enrolled_num} نفر
                  </td>
                  <td className="py-3 text-slate-500 dark:text-slate-400">
                    {c.class_times}
                  </td>
                  <td className="py-3 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                    {c.exam_date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
