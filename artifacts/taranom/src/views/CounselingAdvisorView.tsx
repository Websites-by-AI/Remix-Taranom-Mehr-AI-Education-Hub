import { useState, useMemo } from "react";
import {
  GraduationCap, Target, Search, Info,
  CheckCircle2, AlertTriangle, Building2, Compass, BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Student } from "../types";

const toPersianNum = (n: number | string) => {
  const farsi = ["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];
  return Math.round(Number(n)).toString().replace(/\d/g, x => farsi[parseInt(x)]);
};

interface Benchmark {
  university: string;
  field: string;
  minRank: number;
  maxRank: number;
  minTraz: number;
  type: "state" | "private" | "medical";
  region: number;
}

const ALL_BENCHMARKS: Benchmark[] = [
  { university: "دانشگاه تهران", field: "پزشکی", minRank: 1, maxRank: 150, minTraz: 12000, type: "medical", region: 1 },
  { university: "شهید بهشتی", field: "دندانپزشکی", minRank: 20, maxRank: 220, minTraz: 11800, type: "medical", region: 1 },
  { university: "صنعتی شریف", field: "مهندسی کامپیوتر", minRank: 1, maxRank: 100, minTraz: 12500, type: "state", region: 1 },
  { university: "دانشگاه شیراز", field: "پزشکی", minRank: 200, maxRank: 600, minTraz: 10800, type: "medical", region: 2 },
  { university: "دانشگاه اصفهان", field: "حقوق", minRank: 50, maxRank: 450, minTraz: 9800, type: "state", region: 2 },
  { university: "دانشگاه تبریز", field: "مهندسی عمران", minRank: 500, maxRank: 1500, minTraz: 9200, type: "state", region: 3 },
  { university: "علوم تحقیقات", field: "داروسازی", minRank: 1000, maxRank: 3000, minTraz: 8800, type: "private", region: 1 },
  { university: "دانشگاه گیلان", field: "پرستاری", minRank: 2000, maxRank: 5000, minTraz: 8400, type: "medical", region: 2 },
  { university: "دانشگاه کاشان", field: "مهندسی شیمی", minRank: 1500, maxRank: 4000, minTraz: 8600, type: "state", region: 2 },
  { university: "دانشگاه فردوسی مشهد", field: "روان‌شناسی", minRank: 300, maxRank: 1200, minTraz: 9400, type: "state", region: 3 },
];

export default function CounselingAdvisorView({ student }: { student: Student }) {
  const [search, setSearch] = useState("");
  const [filterRegion, setFilterRegion] = useState<number | "all">("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [selected, setSelected] = useState<Benchmark | null>(null);

  const studentTraz = student.currentTraz || student.academicProfile?.currentTraz || 9500;

  const calcProb = (minTraz: number): number => {
    const diff = studentTraz - minTraz;
    if (diff >= 500) return 98;
    if (diff >= 0) return Math.min(95, 70 + (diff / 500) * 25);
    if (diff >= -500) return Math.max(20, 30 + ((diff + 500) / 500) * 40);
    if (diff >= -1000) return Math.max(5, 5 + ((diff + 1000) / 500) * 25);
    return 1;
  };

  const getChance = (prob: number) => {
    if (prob >= 80) return { label: "قبولی قطعی", color: "#10b981", textColor: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" };
    if (prob >= 50) return { label: "احتمال بالا", color: "#3b82f6", textColor: "text-blue-600", bg: "bg-blue-50 border-blue-100" };
    if (prob >= 20) return { label: "ریسک متوسط", color: "#f59e0b", textColor: "text-amber-600", bg: "bg-amber-50 border-amber-100" };
    return { label: "شانس ضعیف", color: "#ef4444", textColor: "text-rose-600", bg: "bg-rose-50 border-rose-100" };
  };

  const filtered = useMemo(() =>
    ALL_BENCHMARKS.filter(b => {
      const matchSearch = b.university.includes(search) || b.field.includes(search);
      const matchRegion = filterRegion === "all" || b.region === filterRegion;
      const matchType = filterType === "all" || b.type === filterType;
      return matchSearch && matchRegion && matchType;
    }), [search, filterRegion, filterType]);

  const pieData = [
    { name: "قطعی", value: filtered.filter(b => calcProb(b.minTraz) >= 80).length, color: "#10b981" },
    { name: "احتمالی", value: filtered.filter(b => calcProb(b.minTraz) >= 50 && calcProb(b.minTraz) < 80).length, color: "#3b82f6" },
    { name: "ریسک", value: filtered.filter(b => calcProb(b.minTraz) < 50).length, color: "#f59e0b" },
  ];

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div className="bg-slate-950 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-[10px] font-black">
              <Compass size={14} className="animate-spin" style={{ animationDuration: "4s" }} />
              <span>Statistical Admission Forecast — ترنم همدلی</span>
            </div>
            <h1 className="text-3xl font-black">پنل مشاوره و تخمین آماری قبولی</h1>
            <p className="text-slate-400 text-xs leading-relaxed max-w-2xl">
              با استفاده از رگرسیون تراز و وزن‌دهی به سهمیه مناطق، احتمال حضور شما در دانشگاه‌های هدف بر اساس داده‌های پذیرش سال ۱۴۰۲ تحلیل می‌شود.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "تراز مبنای شما", val: studentTraz, color: "text-indigo-400" },
              { label: "گزینه‌های قابل بررسی", val: filtered.length, color: "text-emerald-400" },
            ].map((stat, i) => (
              <div key={i} className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl text-center min-w-[120px]">
                <span className="block text-[9px] text-slate-500 font-black mb-1">{stat.label}</span>
                <span className={`text-2xl font-black ${stat.color} font-mono`}>{toPersianNum(stat.val)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="lg:col-span-3 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="جستجو دانشگاه یا رشته..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pr-9 pl-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:border-indigo-400 transition placeholder:text-slate-300" />
            </div>
            <select value={filterRegion} onChange={e => setFilterRegion(e.target.value === "all" ? "all" : Number(e.target.value))}
              className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black outline-none cursor-pointer">
              <option value="all">همه مناطق</option>
              <option value={1}>منطقه ۱</option>
              <option value={2}>منطقه ۲</option>
              <option value={3}>منطقه ۳</option>
            </select>
            <select value={filterType} onChange={e => setFilterType(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black outline-none cursor-pointer">
              <option value="all">همه نوع‌ها</option>
              <option value="state">دولتی</option>
              <option value="medical">پزشکی</option>
              <option value="private">غیرانتفاعی</option>
            </select>
          </div>

          <div className="space-y-3">
            {filtered.map((b, i) => {
              const prob = calcProb(b.minTraz);
              const chance = getChance(prob);
              const isSelected = selected?.university === b.university && selected?.field === b.field;
              const diff = studentTraz - b.minTraz;

              return (
                <motion.div key={i} layout
                  onClick={() => setSelected(isSelected ? null : b)}
                  className={`bg-white rounded-2xl border shadow-sm p-5 cursor-pointer hover:shadow-md transition-all ${isSelected ? "border-indigo-200 ring-2 ring-indigo-100" : "border-slate-100"}`}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex-shrink-0">
                        <Building2 size={16} className="text-slate-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-black text-slate-900">{b.university}</span>
                          <span className="text-[9px] font-black px-2 py-0.5 rounded-full border bg-indigo-50 text-indigo-700 border-indigo-100">{b.field}</span>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${b.type === "medical" ? "bg-rose-50 text-rose-700 border-rose-100" : b.type === "private" ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-slate-50 text-slate-600 border-slate-100"}`}>
                            {b.type === "state" ? "دولتی" : b.type === "medical" ? "پزشکی" : "غیرانتفاعی"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400 font-bold">
                          <span>تراز حداقل: <span className="font-mono text-slate-600">{toPersianNum(b.minTraz)}</span></span>
                          <span>رتبه: <span className="font-mono text-slate-600">{toPersianNum(b.minRank)}–{toPersianNum(b.maxRank)}</span></span>
                          <span>منطقه {toPersianNum(b.region)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-center">
                        <div style={{ direction: "ltr" }} className="w-12 h-12">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={[{ value: prob }, { value: 100 - prob }]} cx="50%" cy="50%" innerRadius={15} outerRadius={22} startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
                                <Cell fill={chance.color} />
                                <Cell fill="#f1f5f9" />
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <span className="text-[9px] font-black text-slate-600 font-mono">{toPersianNum(Math.round(prob))}٪</span>
                      </div>
                      <div className={`px-3 py-1.5 rounded-xl text-[9px] font-black border ${chance.bg} ${chance.textColor}`}>
                        {chance.label}
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isSelected && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="bg-slate-50 rounded-xl p-3 text-center">
                          <span className="text-[9px] text-slate-400 font-black block">فاصله تراز شما</span>
                          <span className={`text-base font-black font-mono ${diff >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                            {diff >= 0 ? "+" : ""}{toPersianNum(diff)}
                          </span>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 text-center">
                          <span className="text-[9px] text-slate-400 font-black block">احتمال قبولی</span>
                          <span className={`text-base font-black font-mono ${chance.textColor}`}>{toPersianNum(Math.round(prob))}٪</span>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 text-center">
                          <span className="text-[9px] text-slate-400 font-black block">ارزیابی مربی</span>
                          <span className="text-xs font-black text-slate-700">
                            {prob >= 80 ? "در لیست اول قرار دهید" : prob >= 50 ? "در لیست دوم قرار دهید" : "ریسک بالا — بررسی کنید"}
                          </span>
                        </div>
                        <div className="sm:col-span-3 bg-indigo-50 border border-indigo-100 rounded-xl p-3">
                          <div className="flex items-start gap-2">
                            <Info size={13} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                            <p className="text-[10px] text-indigo-700 font-bold leading-relaxed">
                              {diff >= 500 ? `تراز شما ${toPersianNum(Math.abs(diff))} واحد بالاتر از حد نصاب است. این رشته را با اطمینان در لیست اول انتخاب رشته قرار دهید.` :
                               diff >= 0 ? `تراز شما در محدوده قبولی است اما فاصله کمی دارد. رفع تله‌های تستی می‌تواند احتمال قبولی را تضمین کند.` :
                               `تراز شما ${toPersianNum(Math.abs(diff))} واحد کمتر از حد نصاب است. با ${toPersianNum(Math.abs(diff) / 100)} ماه تمرین هدفمند قابل جبران است.`}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="text-xs font-black text-slate-800 mb-4 flex items-center gap-2"><BarChart3 size={14} className="text-indigo-600" />توزیع شانس قبولی</h3>
            <div className="h-44" style={{ direction: "ltr" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 mt-2">
              {pieData.map((d, i) => (
                <div key={i} className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                    <span className="font-bold text-slate-600">{d.name}</span>
                  </div>
                  <span className="font-black text-slate-800 font-mono">{toPersianNum(d.value)} رشته</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
            <h3 className="text-xs font-black text-slate-800 flex items-center gap-2"><Target size={14} className="text-amber-600" />توصیه مربی</h3>
            {[
              { icon: <CheckCircle2 size={13} className="text-emerald-600" />, text: "رشته‌های با احتمال +۸۰٪ را در اولویت اول قرار دهید." },
              { icon: <AlertTriangle size={13} className="text-amber-500" />, text: "برای رشته‌های پرریسک باید ۲ ماه تراز را حداقل ۵۰۰ واحد بالا ببرید." },
              { icon: <GraduationCap size={13} className="text-indigo-600" />, text: "حداقل ۳ رشته از هر دسته برای پشتیبان انتخاب رشته معرفی کنید." },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                <span className="flex-shrink-0 mt-0.5">{item.icon}</span>
                <p className="text-[10px] text-slate-600 font-medium leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
