import React from 'react';
import { SlidersHorizontal, Palette, Moon, Sun, Monitor, Bell, Shield, Laptop } from 'lucide-react';

interface PreferencesViewProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const PreferencesView: React.FC<PreferencesViewProps> = ({
  darkMode,
  setDarkMode,
}) => {
  return (
    <div className="space-y-6 max-w-4xl">

      {/* Header bar */}
      <div className="glass-card p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">مطلوبات و تنظیمات کاربر</h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          شخصی‌سازی ظاهر سامانه، تنظیمات نوتیفیکیشن‌ها و رفتار پیش‌فرض پنل آموزش
        </p>
      </div>

      {/* Theme Settings Card */}
      <div className="glass-card rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">قالب و تم بصری</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          حالت نمایش رابط کاربری را متناسب با محیط نوری خود انتخاب کنید.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <button
            onClick={() => setDarkMode(false)}
            className={`p-4 rounded-2xl border text-right transition flex items-center justify-between ${
              !darkMode 
                ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sun className="w-5 h-5 text-amber-500" />
              <div>
                <div className="text-sm">حالت روشن (Light Mode)</div>
                <div className="text-[11px] text-slate-400">مناسب برای مطالعه در طول روز</div>
              </div>
            </div>
            {!darkMode && <span className="text-blue-600 font-bold">✓ فعال</span>}
          </button>

          <button
            onClick={() => setDarkMode(true)}
            className={`p-4 rounded-2xl border text-right transition flex items-center justify-between ${
              darkMode 
                ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-indigo-400" />
              <div>
                <div className="text-sm">حالت تیره (Dark Mode)</div>
                <div className="text-[11px] text-slate-400">کاهش خستگی چشم و مصرف باتری</div>
              </div>
            </div>
            {darkMode && <span className="text-blue-600 font-bold">✓ فعال</span>}
          </button>
        </div>
      </div>

      {/* Default Department Configuration */}
      <div className="glass-card rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Laptop className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">تنظیمات سیستمی سپهر</h2>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">دانشکده پیش‌فرض در گزارش‌ها</div>
              <div className="text-[11px] text-slate-400">کد ۴۰ (دانشکده مهندسی کامپیوتر)</div>
            </div>
            <span className="font-mono font-bold text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50">
              Department 40 (CE)
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">فونت پیش‌فرض فارسی</div>
              <div className="text-[11px] text-slate-400">فونت استاندارد ملی وزیرمتن (Vazirmatn)</div>
            </div>
            <span className="font-bold text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700">
              وزیرمتن
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
