import { useGetDashboardSummary, getGetDashboardSummaryQueryKey, useGetMotivational, getGetMotivationalQueryKey, useListExams, getListExamsQueryKey } from "@workspace/api-client-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, BookOpen, Target, Flame, Trophy, Loader2 } from "lucide-react";

interface Props {
  studentId: number;
  studentName: string;
}

export default function DashboardView({ studentId, studentName }: Props) {
  const { data: summary, isLoading: summaryLoading } = useGetDashboardSummary(
    { studentId },
    { query: { queryKey: getGetDashboardSummaryQueryKey({ studentId }) } }
  );
  const { data: motivational } = useGetMotivational({ query: { queryKey: getGetMotivationalQueryKey() } });
  const { data: exams } = useListExams(studentId, { query: { queryKey: getListExamsQueryKey(studentId) } });

  const chartData = (exams || []).slice().reverse().map((e, i) => ({
    name: `آزمون ${i + 1}`,
    traz: e.traz,
  }));

  if (summaryLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const stats = [
    {
      label: "تراز آخرین آزمون",
      value: summary?.latestTraz?.toLocaleString("fa-IR") || "—",
      sub: summary?.trazGrowth != null
        ? `${summary.trazGrowth > 0 ? "+" : ""}${summary.trazGrowth.toLocaleString("fa-IR")} نسبت به قبل`
        : "اولین آزمون",
      icon: Trophy,
      color: "from-indigo-500 to-indigo-700",
      trend: (summary?.trazGrowth ?? 0) >= 0 ? "up" : "down",
    },
    {
      label: "تعداد آزمون‌ها",
      value: (summary?.totalExams ?? 0).toLocaleString("fa-IR"),
      sub: "آزمون ثبت شده",
      icon: BookOpen,
      color: "from-emerald-500 to-emerald-700",
      trend: "up",
    },
    {
      label: "تله‌های تستی",
      value: (summary?.totalTraps ?? 0).toLocaleString("fa-IR"),
      sub: "سوال بانک",
      icon: Target,
      color: "from-amber-500 to-amber-700",
      trend: "up",
    },
    {
      label: "استریک مطالعه",
      value: (summary?.studyStreak ?? 0).toLocaleString("fa-IR"),
      sub: "روز متوالی",
      icon: Flame,
      color: "from-rose-500 to-rose-700",
      trend: "up",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          خوش آمدی، {studentName}
        </h1>
        <p className="text-slate-500 mt-1 text-sm">داشبورد پیشرفت کنکور شما</p>
      </div>

      {motivational?.quote && (
        <div data-testid="quote-motivational" className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-xl p-5 flex items-center gap-4 shadow-lg">
          <div className="text-3xl">✨</div>
          <p className="text-sm leading-7 italic opacity-90">{motivational.quote}</p>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              data-testid={`card-stat-${stat.label}`}
              className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${stat.color} mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                {stat.trend === "up"
                  ? <TrendingUp className="w-3 h-3 text-emerald-500" />
                  : <TrendingDown className="w-3 h-3 text-rose-500" />}
                {stat.sub}
              </div>
            </div>
          );
        })}
      </div>

      {chartData.length > 1 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h2 className="font-semibold text-slate-800 mb-4">روند تراز آزمون‌ها</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: "Vazirmatn" }} />
              <YAxis tick={{ fontSize: 11, fontFamily: "Vazirmatn" }} domain={["auto", "auto"]} />
              <Tooltip formatter={(v: number) => [v.toLocaleString("fa-IR"), "تراز"]} />
              <Line type="monotone" dataKey="traz" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, fill: "#6366f1" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {chartData.length === 0 && (
        <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-slate-100">
          <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-3" />
          <p className="text-slate-500">هنوز آزمونی ثبت نشده است</p>
          <p className="text-xs text-slate-400 mt-1">اولین نتیجه آزمون خود را از بخش کارنامه اضافه کنید</p>
        </div>
      )}
    </div>
  );
}
