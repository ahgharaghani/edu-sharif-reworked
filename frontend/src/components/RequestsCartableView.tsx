import React, { useState } from 'react';
import { 
  Inbox, 
  PlusCircle, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  Plane, 
  CreditCard, 
  Building2, 
  Send, 
  Filter,
  ExternalLink
} from 'lucide-react';
import { EducationalRequest } from '../types';

export const RequestsCartableView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cartable' | 'new_request'>('cartable');
  const [selectedCategory, setSelectedCategory] = useState<string>('همه');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedForm, setSelectedForm] = useState<any>(null);

  // Sample real Sharif requests based on Sepehr portal
  const [requests, setRequests] = useState<EducationalRequest[]>([
    {
      id: 'REQ-1405-101',
      title: 'درخواست گواهی اشتغال به تحصیل',
      category: 'گواهی‌ها',
      submit_date: '۱۴۰۵/۰۷/۱۵',
      status: 'تایید شده',
      status_color: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-300',
      tracking_code: 'SHR-99214',
      step: 'صدور نهایی گواهی با بارکد اصالت سنجی',
      description: 'جهت ارائه به سازمان نظام وظیفه عمومی (معافیت تحصیلی دانشجویی)',
    },
    {
      id: 'REQ-1405-102',
      title: 'درخواست ثبت شماره شبا بانکی',
      category: 'امور مالی',
      submit_date: '۱۴۰۵/۰۷/۱۰',
      status: 'تایید شده',
      status_color: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-300',
      tracking_code: 'SHR-88301',
      step: 'تایید امور مالی دانشگاه صنعتی شریف',
      description: 'ثبت شبا بانک تجارت جهت واریز کمک هزینه و استرداد وجوه',
    },
  ]);

  const availableForms = [
    {
      id: 'cert',
      title: 'درخواست گواهی اشتغال به تحصیل',
      category: 'گواهی‌ها',
      desc: 'صدور گواهی اشتغال به تحصیل با مهر دیجیتال و کد صحت جهت ارائه به ارگان‌ها، بانک‌ها و ادارات.',
      icon: FileText,
      code: 'register*savestudentregistercertificate'
    },
    {
      id: 'exit',
      title: 'درخواست مجوز خروج از کشور',
      category: 'نظام وظیفه',
      desc: 'ثبت درخواست مجوز خروج از کشور جهت سفرهای زیارتی، علمی یا تفریحی با هماهنگی نظام وظیفه.',
      icon: Plane,
      code: 'register*gradExitRequest'
    },
    {
      id: 'sheba',
      title: 'ثبت شماره شبا بانکی دانشجو',
      category: 'امور مالی',
      desc: 'ثبت یا تغییر حساب بانکی جهت دریافت تسهیلات دانشجویی و استرداد شهریه.',
      icon: CreditCard,
      code: 'register*studentSaveShebaRequest'
    },
    {
      id: 'refund',
      title: 'درخواست استرداد وجه',
      category: 'امور مالی',
      desc: 'درخواست بازگشت مبالغ اضافی پرداختی در درگاه‌های دانشگاه به حساب بانکی دانشجو.',
      icon: CreditCard,
      code: 'register*esterdadPool'
    },
    {
      id: 'medical_drop',
      title: 'درخواست حذف پزشکی',
      category: 'آموزشی',
      desc: 'درخواست حذف ترم یا درس بر اساس مستندات بیمارستانی با تایید بهداری دانشگاه شریف.',
      icon: AlertCircle,
      code: 'register*hazfPezeshki'
    },
    {
      id: 'chart_verify',
      title: 'تطبیق دروس دانشجو با چارت',
      category: 'فارغ‌التحصیلی',
      desc: 'بررسی الکترونیکی پاس شدن دروس پیش‌نیاز، تخصصی و پایه با چارت رسمی کارشناسی کامپیوتر.',
      icon: CheckCircle2,
      code: 'register*StudentLessonVerification'
    },
  ];

  const handleOpenForm = (form: any) => {
    setSelectedForm(form);
    setModalOpen(true);
  };

  const handleFakeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForm) return;

    const newReq: EducationalRequest = {
      id: `REQ-1405-${Math.floor(100 + Math.random() * 900)}`,
      title: selectedForm.title,
      category: selectedForm.category,
      submit_date: '۱۴۰۵/۰۷/۲۷',
      status: 'در جریان',
      status_color: 'bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-300',
      tracking_code: `SHR-${Math.floor(10000 + Math.random() * 90000)}`,
      step: 'در انتظار بررسی آموزش دانشکده',
      description: 'درخواست با موفقیت ثبت شد و در کارتابل آموزشی شما قرار گرفت.',
    };

    setRequests([newReq, ...requests]);
    setModalOpen(false);
    setActiveTab('cartable');
  };

  return (
    <div className="space-y-6">

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Inbox className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">کارتابل و درخواست‌های آموزشی</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            پیگیری آنلاین وضعیت درخواست‌ها، نامه‌ها، گواهی‌ها و مجوزهای دانشگاه صنعتی شریف
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
          <button
            onClick={() => setActiveTab('cartable')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'cartable'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            کارتابل درخواست‌های من ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab('new_request')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'new_request'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>ثبت درخواست جدید</span>
          </button>
        </div>
      </div>

      {/* Content depending on tab */}
      {activeTab === 'cartable' ? (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="glass-card rounded-2xl p-5 shadow-sm hover:shadow-md transition border border-slate-200/80 dark:border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${req.status_color}`}>
                    {req.status}
                  </span>
                  <span className="font-bold text-base text-slate-900 dark:text-white">
                    {req.title}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                    {req.id}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {req.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>تاریخ ثبت: <strong className="text-slate-600 dark:text-slate-300">{req.submit_date}</strong></span>
                  <span>کد رهگیری: <strong className="font-mono text-slate-700 dark:text-slate-300">{req.tracking_code}</strong></span>
                </div>
              </div>

              {/* Step info pill */}
              <div className="w-full md:w-auto text-left border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
                <div className="text-[11px] text-slate-400">مرحله جاری گردش کار:</div>
                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                  {req.step}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* New Request Catalog */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableForms.map((form) => {
            const Icon = form.icon;
            return (
              <div
                key={form.id}
                className="glass-card rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between border border-slate-200/80 dark:border-slate-800/80"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase">
                      {form.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {form.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {form.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleOpenForm(form)}
                    className="w-full py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition text-slate-800 dark:text-slate-200"
                  >
                    تکمیل و ارسال فرم
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Submission Modal */}
      {modalOpen && selectedForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              فرم آنلاین: {selectedForm.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              مشخصات دانشجو به‌صورت خودکار از پروفایل جاری در سامانه ثبت می‌شود.
            </p>

            <form onSubmit={handleFakeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  مرجع گیرنده / سازمان مقصد:
                </label>
                <input
                  required
                  type="text"
                  placeholder="مثال: سازمان وظیفه عمومی، سفارت، اداره گذرنامه..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  علت و توضیحات درخواست:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="شرح دقیق نیاز به این گواهی یا مجوز را بنویسید..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow"
                >
                  ارسال نهایی به کارتابل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
