import { useState } from "react";
import {
  Sparkles, Zap, BookOpen, Clock, Check,
  Layers, Users, RefreshCw, FileSpreadsheet, Package,
  ClipboardCheck, DollarSign, BarChart3, TrendingUp, AlertTriangle,
  Plus, Search, Trash, Download, ChevronRight,
  CheckCircle, Calendar, Brain, Send, Instagram, MessageCircle, Image, Target, Globe, Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, Cell, PieChart, Pie, Legend
} from "recharts";
import { Student } from "../types";

const toPersianNum = (n: number | string) => {
  const farsi = ["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];
  return n.toString().replace(/\d/g, x => farsi[parseInt(x)]);
};

const TABS = [
  { id: 0, label: "داشبورد فرماندهی", icon: BarChart3 },
  { id: 1, label: "مدیریت داوطلبان CRM", icon: Users },
  { id: 2, label: "خط‌های آموزشی", icon: BookOpen },
  { id: 3, label: "انبار کتب آزمایشی", icon: Package },
  { id: 4, label: "تراکنش‌ها و فروش", icon: DollarSign },
  { id: 5, label: "ممیزی محتوای AI", icon: ClipboardCheck },
  { id: 6, label: "تولید محتوای AI", icon: Sparkles },
  { id: 7, label: "حساب‌های کاربری CRM", icon: Layers },
];

const REVENUE_DATA = [
  { month: "مهر", revenue: 42, leads: 18 },
  { month: "آبان", revenue: 58, leads: 26 },
  { month: "آذر", revenue: 71, leads: 35 },
  { month: "دی", revenue: 65, leads: 30 },
  { month: "بهمن", revenue: 89, leads: 48 },
  { month: "اسفند", revenue: 112, leads: 60 },
];

const PIE_DATA = [
  { name: "تجربی", value: 55, color: "#3b82f6" },
  { name: "ریاضی", value: 28, color: "#8b5cf6" },
  { name: "انسانی", value: 17, color: "#10b981" },
];

const LEADS = [
  { id: "L001", name: "امیرعلی رضایی", field: "تجربی", score: 6820, satisfaction: 5, status: "ثبت‌نام قطعی", channel: "اینستاگرام" },
  { id: "L002", name: "فاطمه احمدی", field: "ریاضی", score: 7210, satisfaction: 4, status: "در حال پیگیری", channel: "مراجعه حضوری" },
  { id: "L003", name: "محمد کریمی", field: "تجربی", score: 5940, satisfaction: 3, status: "آماده ثبت‌نام", channel: "تلگرام" },
  { id: "L004", name: "زهرا نوری", field: "انسانی", score: 8100, satisfaction: 5, status: "ثبت‌نام قطعی", channel: "وبسایت" },
  { id: "L005", name: "علی محمدی", field: "تجربی", score: 6100, satisfaction: 2, status: "انصراف موقت", channel: "تماس تلفنی" },
];

const COURSES = [
  { id: "C001", name: "دوره کنکور تجربی جامع ۱۴۰۵", instructor: "استاد حسینی", progress: 68, status: "در حال برگزاری", attendance: 87 },
  { id: "C002", name: "دوره فشرده زیست‌شناسی مولکولی", instructor: "استاد رضایی", progress: 100, status: "تکمیل شده", attendance: 92 },
  { id: "C003", name: "شیمی آلی پیشرفته با تله‌های تستی", instructor: "استاد موسوی", progress: 42, status: "در حال برگزاری", attendance: 75 },
];

const AI_TRENDS = [
  { tag: "کنکور ۱۴۰۵", weight: "۹۸٪", trend: "up" },
  { tag: "تله‌های تستی زیست", weight: "۸۵٪", trend: "up" },
  { tag: "مشاوره کایزن", weight: "۷۲٪", trend: "stable" },
  { tag: "انتخاب رشته هوشمند", weight: "۶۸٪", trend: "up" },
  { tag: "برنامه‌ریزی شبانه‌روزی", weight: "۵۵٪", trend: "down" },
];

export default function ManovaDashboard({ student, onNavigate }: { student: Student; onNavigate?: (v: string) => void }) {
  const [activeTab, setActiveTab] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [contentType, setContentType] = useState("instagram");

  const handleGenerate = () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedContent(`✅ محتوای تولیدشده برای «${aiPrompt}»:\n\n🎯 داوطلبان کنکور ۱۴۰۵ عزیز!\nبا ترنم همدلی، رویای قبولی در رشته دلخواه‌تون رو واقعی کنید. سیستم هوشمند ما با تحلیل تله‌های تستی و برنامه‌ریزی کایزن، مسیر موفقیت رو برای شما هموار می‌کنه.\n\n📊 آمار داوطلبان موفق ترنم همدلی:\n• ۸۷٪ بهبود تراز در ۳ ماه\n• ۹۴٪ رضایت از سیستم مشاوره\n• بیش از ۲۰۰۰ داوطلب فعال\n\n🔥 همین الان ثبت‌نام کنید!\n#کنکور۱۴۰۵ #ترنم_مهر #قبولی_تضمینی`);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-black">
              <Sparkles size={12} />
              <span>MANOVA Intelligence Dashboard v2.5</span>
            </div>
            <h1 className="text-3xl font-black">داشبورد مانوا — فرماندهی آکادمی</h1>
            <p className="text-slate-400 text-xs leading-relaxed">مرکز فرماندهی یکپارچه مدیریت داوطلبان، خطوط آموزشی، انبار کتب و تولید محتوای هوشمند</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "داوطلب فعال", val: "۲,۳۴۷", color: "text-emerald-400" },
              { label: "تراز میانگین", val: "۶,۸۲۰", color: "text-indigo-300" },
              { label: "درآمد ماه", val: "۱۱۲M", color: "text-amber-400" },
              { label: "رضایت‌مندی", val: "۹۴٪", color: "text-rose-300" },
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-3 rounded-2xl text-center backdrop-blur-sm">
                <span className="block text-[9px] text-slate-500 font-black mb-1">{stat.label}</span>
                <span className={`text-lg font-black ${stat.color} font-mono`}>{toPersianNum(stat.val)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
        <div className="flex p-2 gap-1 min-w-max">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-black transition whitespace-nowrap cursor-pointer ${activeTab === tab.id ? "bg-slate-900 text-white shadow" : "text-slate-500 hover:bg-slate-50"}`}>
                <Icon size={13} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>

          {activeTab === 0 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <h3 className="text-xs font-black text-slate-800 mb-4 flex items-center gap-2"><TrendingUp size={14} className="text-indigo-600" />روند درآمد و جذب داوطلب</h3>
                  <div className="h-52" style={{ direction: "ltr" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={REVENUE_DATA}>
                        <defs>
                          <linearGradient id="rv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 11 }} />
                        <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="url(#rv)" strokeWidth={2} name="درآمد (میلیون)" />
                        <Area type="monotone" dataKey="leads" stroke="#10b981" fill="none" strokeWidth={2} strokeDasharray="4 2" name="سرنخ جذب" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <h3 className="text-xs font-black text-slate-800 mb-4 flex items-center gap-2"><Users size={14} className="text-amber-600" />توزیع رشته‌های تحصیلی</h3>
                  <div className="h-52" style={{ direction: "ltr" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                          {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip formatter={(v: number) => [`${toPersianNum(v)}٪`, ""]} />
                        <Legend formatter={(v) => v} iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "آزمون این ماه", val: "۱۴", sub: "آزمون شبیه‌ساز", icon: <ClipboardCheck size={16} />, color: "bg-blue-50 text-blue-700" },
                  { label: "تله‌های شناسایی‌شده", val: "۲۸۷", sub: "تله تستی فعال", icon: <AlertTriangle size={16} />, color: "bg-amber-50 text-amber-700" },
                  { label: "محتوای تولیدشده", val: "۱,۲۴۸", sub: "پست و محتوا", icon: <Sparkles size={16} />, color: "bg-indigo-50 text-indigo-700" },
                  { label: "سشن‌های مشاوره", val: "۴۳۶", sub: "جلسه این ماه", icon: <MessageCircle size={16} />, color: "bg-rose-50 text-rose-700" },
                ].map((card, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${card.color}`}>{card.icon}</div>
                    <div>
                      <span className="text-xl font-black text-slate-900 block font-mono">{toPersianNum(card.val)}</span>
                      <span className="text-[10px] text-slate-500 font-bold">{card.label}</span>
                      <span className="text-[9px] text-slate-400 block">{card.sub}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="text-xs font-black text-slate-800 mb-4 flex items-center gap-2"><Globe size={14} className="text-indigo-600" />ترندهای محتوایی هوشمند AI</h3>
                <div className="flex flex-wrap gap-2">
                  {AI_TRENDS.map((t, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full text-[10px] font-black">
                      <span className={`w-1.5 h-1.5 rounded-full ${t.trend === "up" ? "bg-emerald-500" : t.trend === "down" ? "bg-rose-500" : "bg-amber-500"}`} />
                      <span className="text-slate-700">{t.tag}</span>
                      <span className="text-indigo-600 font-mono">{toPersianNum(t.weight)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3">
                <button className="flex items-center gap-1.5 bg-slate-900 text-white px-4 py-2 rounded-xl text-[11px] font-black hover:bg-slate-800 transition cursor-pointer">
                  <Plus size={13} /> ثبت داوطلب جدید
                </button>
                <div className="relative">
                  <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="جستجو..." className="pr-8 pl-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none w-48" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      {["شناسه", "نام داوطلب", "رشته", "تراز", "رضایت", "وضعیت", "منبع جذب", "عملیات"].map(h => (
                        <th key={h} className="px-4 py-3 text-[10px] font-black text-slate-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {LEADS.map(lead => (
                      <tr key={lead.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-4 py-3 text-[10px] font-mono text-slate-400">{lead.id}</td>
                        <td className="px-4 py-3 text-xs font-bold text-slate-800">{lead.name}</td>
                        <td className="px-4 py-3"><span className="text-[9px] bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full font-bold">{lead.field}</span></td>
                        <td className="px-4 py-3 text-xs font-black text-indigo-900 font-mono">{toPersianNum(lead.score)}</td>
                        <td className="px-4 py-3 text-xs">{Array(lead.satisfaction).fill("⭐").join("")}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-black border ${lead.status === "ثبت‌نام قطعی" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : lead.status === "انصراف موقت" ? "bg-rose-50 text-rose-700 border-rose-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[10px] text-slate-500">{lead.channel}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button className="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded-lg transition cursor-pointer"><ChevronRight size={12} /></button>
                            <button className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition cursor-pointer"><Trash size={12} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="space-y-4">
              {COURSES.map(c => (
                <div key={c.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${c.status === "در حال برگزاری" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-50 text-slate-500 border-slate-100"}`}>{c.status}</span>
                      <span className="text-xs font-black text-slate-800">{c.name}</span>
                    </div>
                    <p className="text-[10px] text-slate-500">مدرس: {c.instructor}</p>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-[9px] font-bold text-slate-500">
                        <span>پیشرفت دوره</span><span>{toPersianNum(c.progress)}٪</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full transition-all" style={{ width: `${c.progress}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[9px] text-slate-400 block">حضور</span>
                      <span className="text-sm font-black text-emerald-700">{toPersianNum(c.attendance)}٪</span>
                    </div>
                    <button className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition cursor-pointer"><Download size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 6 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-2xl"><Sparkles size={20} /></div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">تولید محتوای هوشمند با AI ترنم همدلی</h3>
                  <p className="text-[10px] text-slate-500">تولید محتوای اینستاگرام، کانال، وبلاگ و اطلاعیه با GPT</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {[
                  { id: "instagram", label: "پست اینستاگرام", icon: <Instagram size={14} /> },
                  { id: "telegram", label: "پست تلگرام", icon: <MessageCircle size={14} /> },
                  { id: "blog", label: "مقاله وبلاگ", icon: <BookOpen size={14} /> },
                  { id: "quiz", label: "سوال تستی", icon: <Brain size={14} /> },
                  { id: "ad", label: "تبلیغ هدفمند", icon: <Target size={14} /> },
                ].map(t => (
                  <button key={t.id} onClick={() => setContentType(t.id)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-[10px] font-black transition cursor-pointer ${contentType === t.id ? "bg-indigo-50 border-indigo-200 text-indigo-900" : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100"}`}>
                    {t.icon}
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 block">موضوع و هدف محتوا:</label>
                <div className="flex gap-2">
                  <textarea
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    placeholder="مثال: ترغیب داوطلبان تجربی برای ثبت‌نام دوره زیست‌شناسی پیشرفته ترنم همدلی"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs resize-none h-24 outline-none focus:border-indigo-400 transition"
                  />
                </div>
                <button onClick={handleGenerate} disabled={isGenerating || !aiPrompt.trim()}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-indigo-950 text-white px-5 py-2.5 rounded-xl text-xs font-black transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                  {isGenerating ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} className="text-amber-400" />}
                  {isGenerating ? "در حال تولید..." : "تولید محتوا با AI"}
                </button>
              </div>

              {generatedContent && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <button onClick={() => setGeneratedContent(null)} className="text-[10px] font-black text-rose-600 hover:underline cursor-pointer">حذف</button>
                    <div className="flex items-center gap-1.5 text-emerald-600">
                      <CheckCircle size={14} />
                      <span className="text-[10px] font-black">محتوا آماده است</span>
                    </div>
                  </div>
                  <pre className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">{generatedContent}</pre>
                  <button className="flex items-center gap-1.5 text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl hover:bg-indigo-100 transition cursor-pointer">
                    <Send size={12} /> انتشار مستقیم
                  </button>
                </motion.div>
              )}
            </div>
          )}

          {(activeTab === 3 || activeTab === 4 || activeTab === 5 || activeTab === 7) && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl mx-auto flex items-center justify-center">
                <Cpu size={28} className="text-indigo-400" />
              </div>
              <h3 className="text-base font-black text-slate-800">{TABS[activeTab].label}</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                این ماژول در حال توسعه و بارگذاری داده‌های واقعی است. به‌زودی فعال خواهد شد.
              </p>
              <div className="flex justify-center gap-2">
                <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1.5 rounded-full font-black">در دست توسعه</span>
                <span className="text-[9px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1.5 rounded-full font-black">نسخه ۲.۶</span>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}

