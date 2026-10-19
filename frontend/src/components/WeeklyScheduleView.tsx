import React, { useState } from 'react';
import { ScheduleItem } from '../types';
import { Calendar, MapPin, User, Clock, Printer } from 'lucide-react';

interface WeeklyScheduleViewProps {
  schedule: ScheduleItem[];
}

export const WeeklyScheduleView: React.FC<WeeklyScheduleViewProps> = ({ schedule }) => {
  const days = [
    { name: 'شنبه', index: 0 },
    { name: 'یکشنبه', index: 1 },
    { name: 'دوشنبه', index: 2 },
    { name: 'سه شنبه', index: 3 },
    { name: 'چهارشنبه', index: 4 },
  ];

  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Group items by day
  const itemsByDay = (dayName: string) => {
    return schedule.filter((item) => item.day_of_week === dayName).sort((a, b) => a.start_hour - b.start_hour);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">برنامه هفتگی کلاسی</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            نیم‌سال اول ۱۴۰۵-۱۴۰۴ • کلیه ساعات و مکان‌های تشکیل کلاس‌ها
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Day Filter Pills for Mobile */}
          <div className="flex sm:hidden overflow-x-auto gap-1">
            <button
              onClick={() => setSelectedDay(null)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                selectedDay === null ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
              }`}
            >
              همه
            </button>
            {days.map((d) => (
              <button
                key={d.index}
                onClick={() => setSelectedDay(d.index)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                  selectedDay === d.index ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>

          <button
            onClick={handlePrint}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
          >
            <Printer className="w-4 h-4" />
            <span>چاپ برنامه</span>
          </button>
        </div>
      </div>

      {/* Modern 5-Column Timetable Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {days.map((day) => {
          if (selectedDay !== null && selectedDay !== day.index) return null;
          const dayItems = itemsByDay(day.name);
          const isWeekendOrFree = dayItems.length === 0;

          return (
            <div 
              key={day.index} 
              className={`flex flex-col rounded-2xl border transition-all ${
                isWeekendOrFree 
                  ? 'border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20'
                  : 'glass-card border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              {/* Day Column Header */}
              <div className="p-3.5 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between bg-slate-100/60 dark:bg-slate-900/60 rounded-t-2xl">
                <span className="font-bold text-sm text-slate-900 dark:text-white">{day.name}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {dayItems.length} کلاس
                </span>
              </div>

              {/* Day Classes Column */}
              <div className="p-3 flex-1 flex flex-col gap-3 min-h-[360px]">
                {dayItems.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-slate-400 dark:text-slate-600 text-xs">
                    <span className="text-2xl mb-1">🎉</span>
                    <span>روز بدون کلاس</span>
                  </div>
                ) : (
                  dayItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all duration-150 flex flex-col justify-between relative overflow-hidden group"
                      style={{ borderRight: `4px solid ${item.color || '#3B82F6'}` }}
                    >
                      <div className="space-y-1.5">
                        {/* Time Badge */}
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-blue-700 dark:text-blue-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{item.start_time} - {item.end_time}</span>
                        </div>

                        {/* Course Title */}
                        <div className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                          {item.course_title}
                        </div>

                        {/* Instructor */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <User className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{item.instructor}</span>
                        </div>
                      </div>

                      {/* Location Room Badge */}
                      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300">
                        <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                        <span className="truncate">{item.room}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Campus Location Legend */}
      <div className="glass-card rounded-2xl p-4 text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-center gap-6">
        <span className="font-bold text-slate-700 dark:text-slate-300">راهنمای کلاس‌ها:</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          <span>ساختمان تالارها (تالار ۱، ۴، ۵)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>ساختمان ابن‌سینا (الف ۲، الف ۱۲)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
          <span>دانشکده مهندسی کامپیوتر (۱۰۱)</span>
        </span>
      </div>

    </div>
  );
};
