import { useListExams, getListExamsQueryKey } from "@workspace/api-client-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Props { studentId: number; targetTraz?: number | null }

export default function ProgressView({ studentId, targetTraz }: Props) {
  const { data: exams, isLoading } = useListExams(studentId, { query: { queryKey: getListExamsQueryKey(studentId) } });

  const chartData = (exams || []).slice().reverse().map((e, i) => ({
    name: `آزمون ${i + 1}`,
    title: e.title,
    traz: e.traz,
    درصد: e.overallPercentage,
    هدف: targetTraz,
  }));

  const trazValues = (exams || []).map((e) => e.traz);
  const maxTraz = trazValues.length ? Math.max(...trazValues) : 0;
  const minTraz = trazValues.length ? Math.min(...trazValues) : 0;
  const avgTraz = trazValues.length ? Math.round(trazValues.reduce((a, b) => a + b, 0) / trazValues.length) : 0;

  const trend = trazValues.length >= 2
    ? trazValues[0] - trazValues[1]
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">روند پیشرفت</h1>
        <p className="text-slate-500 mt-1 text-sm">تحلیل تغییرات تراز در آزمون‌های آزمایشی</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
      ) : (exams || []).length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-100">
          <TrendingUp className="w-12 h-12 mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">هنوز داده‌ای برای نمایش پیشرفت وجود ندارد</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "بیشترین تراز", value: maxTraz.toLocaleString("fa-IR"), icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "میانگین تراز", value: avgTraz.toLocaleString("fa-IR"), icon: Minus, color: "text-indigo-600", bg: "bg-indigo-50" },
              { label: "کمترین تراز", value: minTraz.toLocaleString("fa-IR"), icon: TrendingDown, color: "text-rose-600", bg: "bg-rose-50" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} data-testid={`stat-progress-${s.label}`} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 text-center">
                  <div className={`inline-flex p-2 rounded-lg ${s.bg} mb-2`}>
                    <Icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-slate-500 mt-1">{s.label}</div>
                </div>
              );
            })}
          </div>

          {trend !== 0 && (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${
              trend > 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
            }`}>
              {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              آخرین تغییر تراز: {trend > 0 ? "+" : ""}{trend.toLocaleString("fa-IR")} واحد نسبت به آزمون قبلی
            </div>
          )}

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-700 mb-4">نمودار تراز با هدف</h3>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="trazGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fontFamily: "Vazirmatn" }} />
                <YAxis tick={{ fontSize: 10 }} domain={["auto", "auto"]} />
                <Tooltip
                  formatter={(v: number, n: string) => [v.toLocaleString("fa-IR"), n === "traz" ? "تراز" : n]}
                  labelFormatter={(l) => l}
                />
                <Area type="monotone" dataKey="traz" stroke="#6366f1" fill="url(#trazGrad)" strokeWidth={2.5} dot={{ r: 4, fill: "#6366f1" }} />
                {targetTraz && <Line type="monotone" dataKey="هدف" stroke="#f59e0b" strokeDasharray="5 5" strokeWidth={2} dot={false} />}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-700 mb-4">روند درصد کلی</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="pctGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fontFamily: "Vazirmatn" }} />
                <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                <Tooltip formatter={(v: number) => [`${v}%`, "درصد کلی"]} />
                <Area type="monotone" dataKey="درصد" stroke="#f59e0b" fill="url(#pctGrad)" strokeWidth={2} dot={{ r: 3, fill: "#f59e0b" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
