import { useState } from "react";
import { Sparkles, CheckCircle2, RefreshCw, Calendar, Clock, BookOpen, ArrowUp, ArrowDown, Brain } from "lucide-react";
import { motion } from "framer-motion";
import PomodoroTimer from "../components/PomodoroTimer";

const toPersianNum = (n: number | string) => {
  const farsi = ["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];
  return n.toString().replace(/\d/g, x => farsi[parseInt(x)]);
};

interface DayPlan {
  day: string;
  morningPlan: string;
  afternoonPlan: string;
  totalQuestions: number;
  completed: boolean;
}

const DEFAULT_PLANS: DayPlan[] = [
  { day: "شنبه", morningPlan: "فلسفه و منطق - مرور مباحث وجود و ماهیت و علیت در فلسفه اسلامی", afternoonPlan: "حل و تحلیل ۴۵ تست شبیه‌ساز منطق از آزمون‌های گذشته ترنم همدلی", totalQuestions: 45, completed: true },
  { day: "یکشنبه", morningPlan: "روان‌شناسی - بررسی نظریه‌های رشد و یادگیری (پیاژه و ویگوتسکی)", afternoonPlan: "تحلیل تله‌های شناختی در تست‌های روان‌شناسی (۴۰ تست)", totalQuestions: 40, completed: false },
  { day: "دوشنبه", morningPlan: "جامعه‌شناسی - مطالعه ساختارهای اجتماعی و کنش‌های نمادین", afternoonPlan: "تست‌زنی موضوعی جامعه‌شناسی و تحلیل مفاهیم ترکیبی (۲۵ تست)", totalQuestions: 25, completed: false },
  { day: "سه‌شنبه", morningPlan: "ادبیات تخصصی - مرور آرایه‌های ادبی، عروض و قافیه در اشعار سبک خراسانی", afternoonPlan: "انجام ۳۰ تست قرابت معنایی با پاسخ تشریحی جامع ترنم همدلی", totalQuestions: 30, completed: false },
  { day: "چهارشنبه", morningPlan: "عربی تخصصی - مطالعه قواعد جامد و مشتق، اعراب فعل مضارع و نواسخ", afternoonPlan: "تست‌زنی ترجمه و تعریب و تحلیل ساختارهای نحوی پیچیده (۱۵ تست)", totalQuestions: 15, completed: true },
  { day: "پنجشنبه", morningPlan: "اقتصاد - مرور بخش‌های عرضه و تقاضا، بازار و محاسبه سود و زیان سالانه", afternoonPlan: "شبیه‌ساز آزمون جامع تخصصی و ثبت نتایج در کارتابل داوطلب (۴۰ تست)", totalQuestions: 40, completed: false },
  { day: "جمعه", morningPlan: "جلسه مشاوره کایزن و عارضه‌یابی هفتگی با متخصصین آموزشی ترنم همدلی", afternoonPlan: "کارنامه خوانی آزمون‌های آزمایشی و برنامه‌ریزی اصلاحی برای کاهش نمرات منفی", totalQuestions: 10, completed: false }
];

export default function StudyPlanView() {
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<DayPlan[]>(DEFAULT_PLANS);

  const handleToggleTask = (index: number) => {
    const updated = [...plans];
    updated[index].completed = !updated[index].completed;
    setPlans(updated);
  };

  const handleRegeneratePlan = () => {
    setLoading(true);
    setTimeout(() => {
      const aiUpdates: DayPlan[] = [
        { day: "شنبه", morningPlan: "فلسفه و منطق - مطالعه مبحث حرکت و زمان و براهین اثبات وجود", afternoonPlan: "انجام ۴۵ نمونه تست مفهومی و تله تستی فلسفه", totalQuestions: 45, completed: false },
        { day: "یکشنبه", morningPlan: "جامعه‌شناسی - مبحث جهانی‌شدن و تضادهای فرهنگی در عصر مدرن", afternoonPlan: "پایش تله‌های ۳۵ سوال از آخرین وبینارهای تخصصی ترنم همدلی", totalQuestions: 35, completed: false },
        { day: "دوشنبه", morningPlan: "روان‌شناسی - مرور شخصیت و سلامت روان به همراه نابهنجاری‌ها", afternoonPlan: "حل ۴۰ تست روان‌شناسی تحلیلی", totalQuestions: 40, completed: false },
        { day: "سه‌شنبه", morningPlan: "ادبیات تخصصی - سبک‌شناسی و تحلیل متون نظم و نثر دوره عراقی", afternoonPlan: "اجرای ۳۰ نمونه تستی آرایه‌های ترکیبی", totalQuestions: 30, completed: false },
        { day: "چهارشنبه", morningPlan: "اقتصاد - مبحث شاخص‌های کلان اقتصادی و تورم و بیکاری", afternoonPlan: "تست‌زنی اقتصاد با تاکید بر مسائل محاسباتی و تحلیل نمودارها", totalQuestions: 15, completed: false },
        { day: "پنجشنبه", morningPlan: "عربی تخصصی - مبحث منصوبات (مفعول مطلق، فیه، له) و حال", afternoonPlan: "پایش آزمون شبیه‌ساز پیشرفته و خلاصه نویسی نکات در دفترچه طلایی", totalQuestions: 30, completed: false },
        { day: "جمعه", morningPlan: "تحویل مکتوب آمار پایش کیفی به پنل مشاور ارشد ترنم همدلی جهت عارضه‌یابی", afternoonPlan: "بررسی تراز مانیتورینگ کارایی و تدوین توصیه‌های کایزن مطالعاتی", totalQuestions: 10, completed: false }
      ];
      setPlans(aiUpdates);
      setLoading(false);
    }, 1500);
  };

  const handleMoveUp = (idx: number) => {
    if (idx === 0) return;
    const updated = [...plans];
    const prev = updated[idx - 1];
    updated[idx - 1] = { ...updated[idx], day: prev.day };
    updated[idx] = { ...prev, day: updated[idx].day };
    setPlans(updated);
  };

  const handleMoveDown = (idx: number) => {
    if (idx === plans.length - 1) return;
    const updated = [...plans];
    const next = updated[idx + 1];
    updated[idx + 1] = { ...updated[idx], day: next.day };
    updated[idx] = { ...next, day: updated[idx].day };
    setPlans(updated);
  };

  const completedCount = plans.filter(p => p.completed).length;
  const progressRatio = Math.round((completedCount / plans.length) * 100);

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900">برنامه‌ریزی هوشمند کایزن درسی (AI)</h2>
          <p className="text-slate-500 text-xs mt-1 leading-relaxed">
            برنامه درسی هفتگی برای تخصیص بهینه زمان یادگیری مباحث تخصصی در شیفت صبح و تست‌زنی در شیفت عصر منطبق بر عملکرد آزمون‌های آزمایشی.
          </p>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 max-w-48 bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full transition-all" style={{ width: `${progressRatio}%` }} />
            </div>
            <span className="text-xs font-black text-slate-700">{toPersianNum(completedCount)} از {toPersianNum(plans.length)} روز تکمیل ({toPersianNum(progressRatio)}٪)</span>
          </div>
        </div>
        <button onClick={handleRegeneratePlan} disabled={loading}
          className="bg-blue-950 hover:bg-slate-900 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition inline-flex items-center gap-2 cursor-pointer shadow-md w-full md:w-auto justify-center">
          {loading ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} className="text-amber-400" />}
          <span>بهینه‌سازی برنامه با AI</span>
        </button>
      </div>

      <PomodoroTimer />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-5 rounded-3xl text-white shadow-lg flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-amber-300" />
              <h4 className="text-xs font-black">تحلیل تله‌های تستی</h4>
            </div>
            <p className="text-[10px] text-indigo-100 leading-relaxed font-medium">
              بر اساس اشتباهات آزمون‌های اخیر، ۱۲ تله متداول برای شما شناسایی شده است.
            </p>
          </div>
          <div className="mt-4 bg-white/10 border border-white/10 rounded-xl p-2 text-center text-[10px] font-black">ورود به بانک تله‌ها</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-rose-600">
              <Brain size={18} />
              <h4 className="text-xs font-black">آزمون سفارشی کایزن</h4>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
              یک آزمون ۱۰ دقیقه‌ای از مباحث ضعیف هفته گذشته توسط AI آماده شده است.
            </p>
          </div>
          <div className="mt-4 bg-rose-50 border border-rose-100 rounded-xl p-2 text-center text-[10px] font-black text-rose-700">شروع آزمون آنی</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-600">
              <Calendar size={18} />
              <h4 className="text-xs font-black">پیشرفت کایزن هفتگی</h4>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
              {toPersianNum(completedCount)} روز از {toPersianNum(plans.length)} روز برنامه امروز تکمیل شده است.
            </p>
          </div>
          <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-2 text-center text-[10px] font-black text-amber-700">{toPersianNum(progressRatio)}٪ پیشرفت هفتگی</div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
          <Clock size={16} className="text-indigo-600" />
          جدول برنامه‌ریزی هفتگی
        </h3>

        {plans.map((plan, idx) => (
          <motion.div key={plan.day} layout
            className={`bg-white rounded-2xl border shadow-sm p-5 flex flex-col md:flex-row md:items-center gap-4 transition-all ${plan.completed ? "border-emerald-100 bg-emerald-50/30" : "border-slate-100"}`}>
            <div className="flex items-center gap-3 md:w-24 flex-shrink-0">
              <div className="flex flex-col gap-0.5">
                <button onClick={() => handleMoveUp(idx)} disabled={idx === 0} className="p-0.5 text-slate-300 hover:text-slate-600 disabled:opacity-20 transition cursor-pointer"><ArrowUp size={12} /></button>
                <button onClick={() => handleMoveDown(idx)} disabled={idx === plans.length - 1} className="p-0.5 text-slate-300 hover:text-slate-600 disabled:opacity-20 transition cursor-pointer"><ArrowDown size={12} /></button>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs ${plan.completed ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                {plan.day.slice(0, 2)}
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[9px] font-black text-slate-400">
                  <BookOpen size={10} /><span>شیفت صبح — مطالعه درس</span>
                </div>
                <p className="text-xs text-slate-700 font-bold leading-relaxed">{plan.morningPlan}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[9px] font-black text-slate-400">
                  <Brain size={10} /><span>شیفت عصر — تست‌زنی ({toPersianNum(plan.totalQuestions)} سوال)</span>
                </div>
                <p className="text-xs text-slate-700 font-bold leading-relaxed">{plan.afternoonPlan}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-[9px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg font-mono">{toPersianNum(plan.totalQuestions)} تست</span>
              <button onClick={() => handleToggleTask(idx)}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition cursor-pointer border ${plan.completed ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-slate-200 text-slate-300 hover:border-emerald-400 hover:text-emerald-500"}`}>
                <CheckCircle2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
