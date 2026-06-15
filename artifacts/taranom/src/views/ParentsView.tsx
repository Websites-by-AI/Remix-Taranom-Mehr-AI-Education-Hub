import { useState } from "react";
import {
  Users, TrendingUp, BookOpen, Bell, CheckCircle,
  AlertTriangle, BarChart3, Clock, Target, Brain, ShieldCheck
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";
import { Student } from "../types";

const toPersianNum = (n: number | string) => {
  const farsi = ["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];
  return n.toString().replace(/\d/g, x => farsi[parseInt(x)]);
};

const TRAZ_HISTORY = [
  { name: "آبان", traz: 5120, target: 7000 },
  { name: "آذر", traz: 5380, target: 7000 },
  { name: "دی", traz: 5690, target: 7000 },
  { name: "بهمن", traz: 5940, target: 7000 },
  { name: "اسفند", traz: 6200, target: 7000 },
];

const ALERTS = [
  { type: "warning", text: "در آزمون اخیر، نمرات فیزیک ۱۵٪ کاهش یافته است.", time: "دیروز" },
  { type: "success", text: "داوطلب تمام برنامه هفته گذشته را تکمیل کرده است.", time: "۲ روز پیش" },
  { type: "info", text: "جلسه مشاوره کایزن هفته آینده برنامه‌ریزی شده است.", time: "۳ روز پیش" },
];

export default function ParentsView({ student }: { student: Student }) {
  const [activeTab, setActiveTab] = useState<"overview" | "progress" | "alerts">("overview");

  const currentTraz = student.currentTraz || student.academicProfile?.currentTraz || 6200;
  const targetTraz = student.targetTraz || student.academicProfile?.targetTraz || 7000;
  const trazProgress = Math.min(100, Math.round((currentTraz / targetTraz) * 100));

  const tabs = [
    { id: "overview", label: "نمای کلی", icon: <BarChart3 size={14} /> },
    { id: "progress", label: "روند پیشرفت", icon: <TrendingUp size={14} /> },
    { id: "alerts", label: "اعلان‌ها", icon: <Bell size={14} /> },
  ] as const;

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-indigo-200 text-[10px] font-black">
              <Users size={14} />
              <span>پنل نظارت آنلاین والدین — ترنم همدلی</span>
            </div>
            <h1 className="text-3xl font-black">خوش آمدید</h1>
            <p className="text-slate-400 text-sm">وضعیت تحصیلی <span className="text-white font-black">{student.name}</span> را در این پنل دنبال کنید.</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-5 py-4">
            <ShieldCheck size={24} className="text-emerald-400" />
            <div>
              <span className="block text-[10px] text-slate-400 font-black">وضعیت کلی</span>
              <span className="text-lg font-black text-emerald-400">در مسیر صحیح</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 bg-white border border-slate-100 shadow-sm rounded-2xl p-2">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${activeTab === tab.id ? "bg-slate-900 text-white shadow" : "text-slate-500 hover:bg-slate-50"}`}>
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "تراز فعلی", val: toPersianNum(currentTraz), sub: `هدف: ${toPersianNum(targetTraz)}`, icon: <Target size={16} />, color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
              { label: "پیشرفت کلی", val: `${toPersianNum(trazProgress)}٪`, sub: "نسبت به هدف", icon: <TrendingUp size={16} />, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
              { label: "روزهای مطالعه", val: toPersianNum(24), sub: "از ۳۰ روز گذشته", icon: <BookOpen size={16} />, color: "text-amber-600 bg-amber-50 border-amber-100" },
              { label: "رتبه تخمینی", val: toPersianNum(1850), sub: "سراسری تجربی", icon: <BarChart3 size={16} />, color: "text-rose-600 bg-rose-50 border-rose-100" },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-3 ${card.color}`}>{card.icon}</div>
                <span className="text-xl font-black text-slate-900 block font-mono">{card.val}</span>
                <span className="text-[10px] font-black text-slate-600 block mt-0.5">{card.label}</span>
                <span className="text-[9px] text-slate-400">{card.sub}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="text-xs font-black text-slate-900 mb-3 flex items-center gap-2"><Brain size={14} className="text-indigo-600" />وضعیت درسی</h3>
              <div className="space-y-3">
                {[
                  { sub: "زیست‌شناسی", pct: 82, color: "bg-emerald-500" },
                  { sub: "شیمی", pct: 65, color: "bg-blue-500" },
                  { sub: "فیزیک", pct: 48, color: "bg-amber-500" },
                  { sub: "ریاضی", pct: 71, color: "bg-indigo-500" },
                ].map((s, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-black text-slate-600">
                      <span>{s.sub}</span><span>{toPersianNum(s.pct)}٪</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className={`${s.color} h-full rounded-full`} style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="text-xs font-black text-slate-900 mb-3 flex items-center gap-2"><Clock size={14} className="text-amber-600" />فعالیت هفته جاری</h3>
              <div className="space-y-2">
                {[
                  { label: "ساعت مطالعه", val: "۳۸ ساعت", ok: true },
                  { label: "تعداد تست حل‌شده", val: "۲۴۰ تست", ok: true },
                  { label: "جلسه مشاوره", val: "۱ جلسه", ok: true },
                  { label: "برنامه هفتگی", val: "۸۵٪ تکمیل", ok: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-600">{item.label}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black text-slate-800">{item.val}</span>
                      {item.ok ? <CheckCircle size={12} className="text-emerald-500" /> : <AlertTriangle size={12} className="text-amber-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "progress" && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2"><TrendingUp size={16} className="text-indigo-600" />منحنی پیشرفت تراز در ۵ ماه اخیر</h3>
          <div className="h-64" style={{ direction: "ltr" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TRAZ_HISTORY}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[4500, 8000]} tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="traz" stroke="#4f46e5" strokeWidth={3} dot={{ r: 5, fill: "#4f46e5" }} name="تراز واقعی" />
                <Line type="monotone" dataKey="target" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={false} name="تراز هدف" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
              <span className="text-[9px] text-slate-400 font-black block">رشد ۵ ماهه</span>
              <span className="text-lg font-black text-emerald-600 font-mono">+{toPersianNum(1080)}</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
              <span className="text-[9px] text-slate-400 font-black block">میانگین رشد ماهانه</span>
              <span className="text-lg font-black text-indigo-600 font-mono">+{toPersianNum(216)}</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
              <span className="text-[9px] text-slate-400 font-black block">فاصله تا هدف</span>
              <span className="text-lg font-black text-amber-600 font-mono">{toPersianNum(Math.max(0, (targetTraz || 7000) - currentTraz))}</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === "alerts" && (
        <div className="space-y-3">
          {ALERTS.map((alert, i) => (
            <div key={i} className={`bg-white rounded-2xl border shadow-sm p-4 flex items-start gap-3 ${alert.type === "warning" ? "border-amber-100" : alert.type === "success" ? "border-emerald-100" : "border-slate-100"}`}>
              <div className={`p-2 rounded-xl flex-shrink-0 ${alert.type === "warning" ? "bg-amber-50 text-amber-600" : alert.type === "success" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}>
                {alert.type === "warning" ? <AlertTriangle size={16} /> : alert.type === "success" ? <CheckCircle size={16} /> : <Bell size={16} />}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-700">{alert.text}</p>
                <span className="text-[10px] text-slate-400 font-bold mt-1 block">{alert.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
