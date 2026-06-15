import { useState } from "react";
import {
  Brain, Target, Activity, Zap, ShieldAlert, Eye,
  BookMarked, TrendingUp, BarChart3, Info, Check,
  AlertCircle, RefreshCw, Layers
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";
import { Student } from "../types";

const toPersianNum = (n: number | string) => {
  const farsi = ["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];
  return n.toString().replace(/\d/g, x => farsi[parseInt(x)]);
};

const RADAR_DATA = [
  { metric: "برنامه‌ریزی", value: 78 },
  { metric: "خودنظارتی", value: 65 },
  { metric: "ارزیابی خود", value: 82 },
  { metric: "استراتژی", value: 58 },
  { metric: "انگیزه", value: 88 },
  { metric: "تمرکز", value: 71 },
];

const LINE_DATA = [
  { name: "آزمون ۱", precision: 85, focus: 70, strategy: 60 },
  { name: "آزمون ۲", precision: 78, focus: 85, strategy: 65 },
  { name: "آزمون ۳", precision: 92, focus: 80, strategy: 75 },
  { name: "آزمون ۴", precision: 88, focus: 90, strategy: 82 },
];

type CycleType = "forethought" | "performance" | "reflection";

const CYCLES: { id: CycleType; label: string; icon: React.ReactNode; color: string }[] = [
  { id: "forethought", label: "برنامه‌ریزی و باورها", icon: <Target size={14} />, color: "bg-indigo-50 text-indigo-700 border-indigo-100" },
  { id: "performance", label: "کنترل حین اجرا", icon: <Activity size={14} />, color: "bg-amber-50 text-amber-700 border-amber-100" },
  { id: "reflection", label: "تأمل و عارضه‌یابی", icon: <RefreshCw size={14} />, color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
];

export default function MetacognitionLabView({ student }: { student: Student }) {
  const [activeCycle, setActiveCycle] = useState<CycleType>("reflection");

  const forethoughtItems = [
    { label: "تعیین هدف مطالعه", score: 82, icon: <Target size={14} />, tip: "اهداف مطالعاتی روزانه را قبل از شروع مشخص کنید." },
    { label: "خودکارآمدی ادراک‌شده", score: 71, icon: <Zap size={14} />, tip: "اعتماد به توانایی خود را در مباحث دشوار تقویت کنید." },
    { label: "برنامه‌ریزی استراتژیک", score: 65, icon: <Layers size={14} />, tip: "از تکنیک‌های تکرار فاصله‌دار و قانون ۸۰/۲۰ بهره بگیرید." },
    { label: "انگیزه درونی", score: 88, icon: <Brain size={14} />, tip: "ارتباط مستقیم میان اهداف شغلی و مباحث درسی را روشن کنید." },
  ];

  const performanceItems = [
    { label: "پایش توجه در حین مطالعه", score: 74, status: "warning" },
    { label: "مدیریت زمان تست‌زنی", score: 61, status: "critical" },
    { label: "استفاده از استراتژی‌های شناختی", score: 83, status: "ok" },
    { label: "خودتنظیمی انگیزشی", score: 79, status: "ok" },
  ];

  const reflectionItems = [
    { label: "کمبود دانش عمیق", val: 45, color: "bg-rose-500" },
    { label: "بی‌دقتی و نارسایی توجه", val: 30, color: "bg-amber-500" },
    { label: "مدیریت زمان و استرس", val: 15, color: "bg-indigo-500" },
    { label: "تله‌های تستی طراح", val: 10, color: "bg-slate-500" },
  ];

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-black">
              <Brain size={14} />
              <span>Metacognitive Performance Lab — Zimmerman SRL Model</span>
            </div>
            <h1 className="text-3xl font-black">آزمایشگاه فراشناخت و خودتنظیمی</h1>
            <p className="text-slate-400 text-xs leading-relaxed max-w-2xl">
              این واحد بر اساس استانداردهای APA و مدل‌های یادگیری خودتنظیمی (SRL)، به تحلیل عمیق چرخه یادگیری شما می‌پردازد.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center min-w-[110px]">
              <span className="block text-[10px] text-slate-500 font-black mb-1">شاخص خودتنظیمی</span>
              <span className="text-2xl font-black text-emerald-400">{toPersianNum(78)}٪</span>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center min-w-[110px]">
              <span className="block text-[10px] text-slate-500 font-black mb-1">اتکای استراتژیک</span>
              <span className="text-2xl font-black text-indigo-400">{toPersianNum(62)}٪</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <RefreshCw size={16} className="text-indigo-600" />
              چرخه یادگیری خودتنظیمی (Zimmerman Cycle)
            </h2>
            <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
              {CYCLES.map(c => (
                <button key={c.id} onClick={() => setActiveCycle(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-1.5 cursor-pointer ${activeCycle === c.id ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>
                  {c.icon}{c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeCycle === "forethought" && (
                <motion.div key="f" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                  <p className="text-xs text-slate-500 font-bold leading-relaxed border-r-4 border-indigo-400 pr-3 bg-indigo-50 py-2 rounded-l-xl">
                    مرحله پیش‌اندیشی: داوطلب پیش از مطالعه، هدف‌گذاری می‌کند، انگیزه خود را می‌سنجد و استراتژی انتخاب می‌نماید.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {forethoughtItems.map((item, i) => (
                      <div key={i} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-indigo-700">{item.icon}<span className="text-xs font-black">{item.label}</span></div>
                          <span className="text-xs font-black text-slate-700 font-mono">{toPersianNum(item.score)}٪</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${item.score}%` }} />
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed">{item.tip}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeCycle === "performance" && (
                <motion.div key="p" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                  <p className="text-xs text-slate-500 font-bold leading-relaxed border-r-4 border-amber-400 pr-3 bg-amber-50 py-2 rounded-l-xl">
                    مرحله اجرا: داوطلب در حین مطالعه، توجه، انگیزه و استراتژی‌های شناختی خود را پایش می‌کند.
                  </p>
                  <div className="space-y-3">
                    {performanceItems.map((item, i) => (
                      <div key={i} className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-3 rounded-xl">
                        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${item.status === "ok" ? "bg-emerald-500" : item.status === "warning" ? "bg-amber-500" : "bg-rose-500 animate-pulse"}`} />
                        <span className="text-xs font-bold text-slate-700 flex-1">{item.label}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${item.status === "ok" ? "bg-emerald-500" : item.status === "warning" ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${item.score}%` }} />
                          </div>
                          <span className="text-[10px] font-black text-slate-600 font-mono w-8">{toPersianNum(item.score)}٪</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="h-48" style={{ direction: "ltr" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={LINE_DATA}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis domain={[50, 100]} tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: 12, fontSize: 11 }} />
                        <Line type="monotone" dataKey="precision" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="دقت" />
                        <Line type="monotone" dataKey="focus" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="تمرکز" />
                        <Line type="monotone" dataKey="strategy" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="استراتژی" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}

              {activeCycle === "reflection" && (
                <motion.div key="r" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                  <p className="text-xs text-slate-500 font-bold leading-relaxed border-r-4 border-emerald-400 pr-3 bg-emerald-50 py-2 rounded-l-xl">
                    مرحله بازتاب: ارزیابی عملکرد گذشته، تحلیل علل خطا و اصلاح استراتژی‌های آینده.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100">
                      <h3 className="text-xs font-black text-indigo-900 mb-4 flex items-center gap-2"><BarChart3 size={14} />تحلیل علنی خطاها</h3>
                      <div className="space-y-3">
                        {reflectionItems.map((item, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between text-[10px] font-black text-slate-600">
                              <span>{item.label}</span><span>{toPersianNum(item.val)}٪</span>
                            </div>
                            <div className="w-full bg-white/70 h-1.5 rounded-full overflow-hidden">
                              <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.val}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { title: "بازخورد اتریبیوشنال (Attribution)", body: "۴۵٪ از خطاهای شما ناشی از کمبود دانش مفهومی است. این قابل‌اصلاح‌ترین نوع خطاست.", type: "info", icon: <Info size={14} /> },
                        { title: "سیگنال هشدار مهارتی", body: "مدیریت زمان در تست‌زنی نیاز فوری به تمرین دارد. پیشنهاد: ۳۰ دقیقه تایمر روزانه.", type: "warning", icon: <AlertCircle size={14} /> },
                        { title: "نقطه قوت ممتاز", body: "انگیزه درونی شما در سطح رتبه برتر است. از این مزیت برای تعمیق مطالعه استفاده کنید.", type: "success", icon: <Check size={14} /> },
                      ].map((item, i) => (
                        <div key={i} className={`p-3 rounded-xl border flex items-start gap-2 ${item.type === "info" ? "bg-blue-50 border-blue-100 text-blue-800" : item.type === "warning" ? "bg-amber-50 border-amber-100 text-amber-800" : "bg-emerald-50 border-emerald-100 text-emerald-800"}`}>
                          {item.icon}
                          <div>
                            <p className="text-[10px] font-black">{item.title}</p>
                            <p className="text-[9px] mt-0.5 leading-relaxed opacity-80">{item.body}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="text-xs font-black text-slate-800 mb-4 flex items-center gap-2"><Eye size={14} className="text-indigo-600" />نمودار رادار فراشناخت</h3>
            <div className="h-52" style={{ direction: "ltr" }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={RADAR_DATA}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9, fill: "#475569" }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
                  <Radar dataKey="value" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
            <h3 className="text-xs font-black text-slate-800 flex items-center gap-2"><BookMarked size={14} className="text-amber-600" />توصیه‌های کایزن</h3>
            {[
              "هر روز ۱۵ دقیقه قبل از مطالعه هدف روزانه بنویسید.",
              "پس از هر آزمون، ۳ دلیل اصلی اشتباهاتتان را یادداشت کنید.",
              "از تکنیک Pomodoro برای بهبود تمرکز استفاده کنید.",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100">
                <span className="w-5 h-5 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center text-[9px] font-black flex-shrink-0 mt-0.5">{toPersianNum(i + 1)}</span>
                <p className="text-[10px] text-slate-600 leading-relaxed font-medium">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
