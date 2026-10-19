import React, { useState } from 'react';
import { 
  GraduationCap, 
  Lock, 
  User, 
  Key, 
  ExternalLink, 
  Sparkles, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  Moon, 
  Sun,
  Eye,
  EyeOff,
  Code
} from 'lucide-react';
import { StudentProfile } from '../types';

interface LoginViewProps {
  onLoginSuccess: (student: StudentProfile) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  darkMode,
  setDarkMode,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showAdvancedCookie, setShowAdvancedCookie] = useState(false);
  const [customCookie, setCustomCookie] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          jsessionid: customCookie.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'خطا در احراز هویت');
      }

      onLoginSuccess(data.student);
    } catch (err: any) {
      setError(err.message || 'خطا در ارتباط با سرور آموزش شریف');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demo: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onLoginSuccess(data.student);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors relative overflow-hidden selection:bg-blue-500 selection:text-white">
      
      {/* Background Ambient Glows */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-600/10 dark:bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-600/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Navbar Header */}
      <header className="px-6 py-4 flex items-center justify-between z-10 max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-500 p-2 shadow-md flex items-center justify-center text-white">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-base bg-gradient-to-r from-blue-700 to-cyan-600 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent">
              سامانه آموزش دانشگاه صنعتی شریف
            </span>
            <div className="text-[11px] text-slate-400">ورود به درگاه هوشمند سپهر</div>
          </div>
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition"
          title="تغییر تم"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-md glass-card rounded-3xl p-8 shadow-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-6">
          
          {/* Card Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>نسخه مدرن و امن سپهر ۷.۰.۳</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              ورود به حساب کاربری
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              جهت دسترسی به کارنامه، برنامه کلاسی و درخواست‌های آموزشی
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username Input */}
            <div className="space-y-1.5 text-xs">
              <label className="block font-bold text-slate-700 dark:text-slate-300">
                شناسه کاربری (شماره دانشجویی):
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  type="text"
                  placeholder="شماره دانشجویی / نام کاربری"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  رمز عبور سامانه آموزش:
                </label>
                <a
                  href="https://edu.sharif.edu/forgotPass"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-[11px]"
                >
                  فراموشی رمز عبور؟
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  required={!customCookie}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10 pl-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Advanced: Direct Cookie Paste Toggle */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowAdvancedCookie(!showAdvancedCookie)}
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1 font-mono"
              >
                <Code className="w-3 h-3" />
                <span>{showAdvancedCookie ? 'مخفی‌سازی ورود با کوکی' : 'ورود مستقیم با سشن کوکی (JSESSIONID)'}</span>
              </button>

              {showAdvancedCookie && (
                <div className="mt-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                  <label className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono">
                    مقدار کوکی JSESSIONID:
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: vf9T2S_O6apEF-EhZuL3OvauKgafNWB1FYXjVlxe6WHVoNr6ICew!-38057171"
                    value={customCookie}
                    onChange={(e) => setCustomCookie(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>در حال احراز هویت در سامانه آموزش...</span>
                </>
              ) : (
                <span>ورود به سیستم آموزش</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center text-xs text-slate-400">
            <span className="w-full border-t border-slate-200 dark:border-slate-800"></span>
            <span className="px-3 bg-white dark:bg-slate-900 shrink-0">یا</span>
            <span className="w-full border-t border-slate-200 dark:border-slate-800"></span>
          </div>

          {/* Alternative Logins */}
          <div className="space-y-2.5">
            {/* Demo Mode Button */}
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-xs font-bold text-slate-700 dark:text-slate-200 transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>ورود فوری با اکانت نمایشی (دمو دانشجو)</span>
            </button>

            {/* SSO Sharif */}
            <a
              href="https://edu.sharif.edu/ssologin"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 hover:bg-amber-100 text-amber-800 dark:text-amber-300 text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>ورود یکپارچه شریف (SSO / احراز هویت مرکزی)</span>
            </a>
          </div>

          <div className="pt-2 text-center text-[11px] text-slate-400">
            کلیه ارتباطات به‌صورت رمزنگاری‌شده با سرورهای رسمی دانشگاه صنعتی شریف انجام می‌شود.
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center text-xs text-slate-400 border-t border-slate-200/60 dark:border-slate-800/60 z-10">
        سامانه مدرن آموزش دانشگاه صنعتی شریف • نسخه ۷.۰.۳
      </footer>
    </div>
  );
};
