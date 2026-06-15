import { useState } from "react";
import { useListExams, getListExamsQueryKey, useCreateExam, getGetDashboardSummaryQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Plus, Loader2, Trophy, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props { studentId: number }

export default function ReportView({ studentId }: Props) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: exams, isLoading } = useListExams(studentId, { query: { queryKey: getListExamsQueryKey(studentId) } });
  const createExam = useCreateExam();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", traz: "", rank: "", overallPercentage: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createExam.mutate(
      { id: studentId, data: { title: form.title, date: form.date, traz: Number(form.traz), rank: Number(form.rank), overallPercentage: Number(form.overallPercentage) } },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getListExamsQueryKey(studentId) });
          qc.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey({ studentId }) });
          setShowForm(false);
          setForm({ title: "", date: "", traz: "", rank: "", overallPercentage: "" });
          toast({ title: "آزمون ثبت شد", description: "نتیجه آزمون با موفقیت ذخیره شد" });
        },
        onError: () => toast({ title: "خطا", description: "مشکلی در ذخیره‌سازی پیش آمد", variant: "destructive" }),
      }
    );
  };

  const chartData = (exams || []).slice().reverse().map((e, i) => ({ name: `آزمون ${i + 1}`, traz: e.traz, درصد: e.overallPercentage }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">کارنامه آزمون‌ها</h1>
          <p className="text-slate-500 mt-1 text-sm">نتایج آزمون‌های آزمایشی شما</p>
        </div>
        <button
          data-testid="button-add-exam"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          ثبت آزمون جدید
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg text-slate-900">ثبت نتیجه آزمون</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: "عنوان آزمون", key: "title", placeholder: "مثال: آزمون گاج ۱۴۰۳", type: "text" },
                { label: "تاریخ", key: "date", placeholder: "مثال: ۱۴۰۳/۰۸/۲۰", type: "text" },
                { label: "تراز", key: "traz", placeholder: "مثال: ۷۵۰۰", type: "number" },
                { label: "رتبه", key: "rank", placeholder: "مثال: ۱۲۰۰", type: "number" },
                { label: "درصد کلی", key: "overallPercentage", placeholder: "مثال: ۶۵", type: "number" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-sm font-medium text-slate-700 block mb-1">{field.label}</label>
                  <input
                    data-testid={`input-${field.key}`}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    required
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                  />
                </div>
              ))}
              <button
                data-testid="button-submit-exam"
                type="submit"
                disabled={createExam.isPending}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                {createExam.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "ذخیره آزمون"}
              </button>
            </form>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
      ) : (exams || []).length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-100">
          <Trophy className="w-12 h-12 mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">هنوز آزمونی ثبت نشده</p>
          <p className="text-xs text-slate-400 mt-1">دکمه ثبت آزمون جدید را بزنید</p>
        </div>
      ) : (
        <>
          {chartData.length > 1 && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <h3 className="font-semibold text-slate-700 mb-3 text-sm">روند تراز</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fontFamily: "Vazirmatn" }} />
                    <YAxis tick={{ fontSize: 10 }} domain={["auto", "auto"]} />
                    <Tooltip formatter={(v: number) => [v.toLocaleString("fa-IR"), "تراز"]} />
                    <Line type="monotone" dataKey="traz" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <h3 className="font-semibold text-slate-700 mb-3 text-sm">درصد کلی</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fontFamily: "Vazirmatn" }} />
                    <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                    <Tooltip formatter={(v: number) => [`${v}%`, "درصد"]} />
                    <Bar dataKey="درصد" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          <div className="space-y-3">
            {(exams || []).map((exam) => (
              <div
                key={exam.id}
                data-testid={`card-exam-${exam.id}`}
                className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex items-center gap-4"
              >
                <div className="text-center bg-indigo-50 rounded-xl px-4 py-3 min-w-[90px]">
                  <div className="text-2xl font-bold text-indigo-700">{exam.traz.toLocaleString("fa-IR")}</div>
                  <div className="text-xs text-indigo-500">تراز</div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800">{exam.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{exam.date} — رتبه: {exam.rank.toLocaleString("fa-IR")}</p>
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold text-amber-600">{exam.overallPercentage}٪</div>
                  <div className="text-xs text-slate-400">درصد کلی</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
