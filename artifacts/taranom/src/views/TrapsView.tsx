import { useState } from "react";
import { useListTraps, getListTrapsQueryKey, useCreateTrap, useDeleteTrap } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Loader2, ShieldAlert, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props { studentId: number }

const IMPORTANCE_MAP: Record<string, { label: string; color: string }> = {
  high: { label: "مهم", color: "bg-rose-100 text-rose-700" },
  medium: { label: "متوسط", color: "bg-amber-100 text-amber-700" },
  low: { label: "کم", color: "bg-slate-100 text-slate-600" },
};

export default function TrapsView({ studentId }: Props) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: traps, isLoading } = useListTraps(studentId, { query: { queryKey: getListTrapsQueryKey(studentId) } });
  const createTrap = useCreateTrap();
  const deleteTrap = useDeleteTrap();
  const [showForm, setShowForm] = useState(false);
  const [filterSubject, setFilterSubject] = useState("همه");
  const [form, setForm] = useState({
    questionTitle: "", subject: "", category: "", trapType: "", correctAnswer: "", userMistake: "", importance: "medium",
  });

  const subjects = ["همه", ...Array.from(new Set((traps || []).map((t) => t.subject)))];
  const filtered = filterSubject === "همه" ? (traps || []) : (traps || []).filter((t) => t.subject === filterSubject);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTrap.mutate(
      { id: studentId, data: form },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getListTrapsQueryKey(studentId) });
          setShowForm(false);
          setForm({ questionTitle: "", subject: "", category: "", trapType: "", correctAnswer: "", userMistake: "", importance: "medium" });
          toast({ title: "تله ثبت شد" });
        },
      }
    );
  };

  const handleDelete = (trapId: number) => {
    deleteTrap.mutate({ id: studentId, trapId }, {
      onSuccess: () => { qc.invalidateQueries({ queryKey: getListTrapsQueryKey(studentId) }); toast({ title: "تله حذف شد" }); },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">بانک تله‌های تستی</h1>
          <p className="text-slate-500 mt-1 text-sm">سوالاتی که اشتباه پاسخ داده‌اید را ثبت کنید</p>
        </div>
        <button
          data-testid="button-add-trap"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          ثبت تله جدید
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg text-slate-900">ثبت تله تستی جدید</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: "عنوان سوال", key: "questionTitle", placeholder: "شرح مختصر سوال یا تله" },
                { label: "درس", key: "subject", placeholder: "مثال: زیست‌شناسی" },
                { label: "مبحث", key: "category", placeholder: "مثال: گوارش" },
                { label: "نوع تله", key: "trapType", placeholder: "مثال: مفهومی / محاسباتی" },
                { label: "پاسخ صحیح", key: "correctAnswer", placeholder: "گزینه یا توضیح صحیح" },
                { label: "اشتباه من", key: "userMistake", placeholder: "چه اشتباهی کردم؟" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-sm font-medium text-slate-700 block mb-1">{field.label}</label>
                  <input
                    data-testid={`input-trap-${field.key}`}
                    placeholder={field.placeholder}
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                  />
                </div>
              ))}
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">اهمیت</label>
                <select
                  data-testid="select-trap-importance"
                  value={form.importance}
                  onChange={(e) => setForm({ ...form, importance: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                >
                  <option value="high">مهم</option>
                  <option value="medium">متوسط</option>
                  <option value="low">کم</option>
                </select>
              </div>
              <button
                data-testid="button-submit-trap"
                type="submit"
                disabled={createTrap.isPending}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 flex items-center justify-center gap-2"
              >
                {createTrap.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "ذخیره تله"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {subjects.map((s) => (
          <button
            key={s}
            data-testid={`button-filter-${s}`}
            onClick={() => setFilterSubject(s)}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
              filterSubject === s ? "bg-indigo-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-slate-100">
          <ShieldAlert className="w-12 h-12 mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">هنوز تله‌ای ثبت نشده</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((trap) => (
            <div key={trap.id} data-testid={`card-trap-${trap.id}`} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-slate-800 text-sm">{trap.questionTitle}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${IMPORTANCE_MAP[trap.importance]?.color || "bg-slate-100 text-slate-600"}`}>
                      {IMPORTANCE_MAP[trap.importance]?.label || trap.importance}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span>درس: <strong className="text-slate-700">{trap.subject}</strong></span>
                    {trap.category && <span>مبحث: <strong className="text-slate-700">{trap.category}</strong></span>}
                    {trap.trapType && <span>نوع: <strong className="text-slate-700">{trap.trapType}</strong></span>}
                  </div>
                  {trap.correctAnswer && (
                    <p className="text-xs text-emerald-700 bg-emerald-50 rounded px-2 py-1 mt-2">پاسخ صحیح: {trap.correctAnswer}</p>
                  )}
                  {trap.userMistake && (
                    <p className="text-xs text-rose-600 bg-rose-50 rounded px-2 py-1 mt-1">اشتباه من: {trap.userMistake}</p>
                  )}
                </div>
                <button
                  data-testid={`button-delete-trap-${trap.id}`}
                  onClick={() => handleDelete(trap.id)}
                  disabled={deleteTrap.isPending}
                  className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
