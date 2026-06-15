import { useState } from "react";
import { useUpdateStudent, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { User, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StudentData {
  id: number; name: string; code: string; field: string; grade: string;
  city?: string | null; age?: number | null; mainGoal?: string | null;
  subscriptionType?: string | null; currentTraz?: number | null;
  targetTraz?: number | null; studyHoursPerDay?: number | null;
}

interface Props { student: StudentData }

export default function ProfileView({ student }: Props) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const updateStudent = useUpdateStudent();

  const [form, setForm] = useState({
    city: student.city || "",
    age: student.age?.toString() || "",
    mainGoal: student.mainGoal || "",
    currentTraz: student.currentTraz?.toString() || "",
    targetTraz: student.targetTraz?.toString() || "",
    studyHoursPerDay: student.studyHoursPerDay?.toString() || "",
  });

  const FIELD_MAP: Record<string, string> = { tajrobi: "تجربی", riazi: "ریاضی", ensani: "انسانی" };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudent.mutate(
      {
        id: student.id,
        data: {
          city: form.city || undefined,
          age: form.age ? Number(form.age) : undefined,
          mainGoal: form.mainGoal || undefined,
          currentTraz: form.currentTraz ? Number(form.currentTraz) : undefined,
          targetTraz: form.targetTraz ? Number(form.targetTraz) : undefined,
          studyHoursPerDay: form.studyHoursPerDay ? Number(form.studyHoursPerDay) : undefined,
        },
      },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getGetMeQueryKey() });
          toast({ title: "پروفایل به‌روز شد" });
        },
        onError: () => toast({ title: "خطا", variant: "destructive" }),
      }
    );
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">پروفایل من</h1>
        <p className="text-slate-500 mt-1 text-sm">اطلاعات شخصی و اهداف تحصیلی</p>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-2xl p-6 text-white flex items-center gap-5 shadow-lg">
        <div className="w-16 h-16 bg-amber-400/20 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-amber-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold">{student.name}</h2>
          <p className="text-indigo-300 text-sm mt-0.5">
            کد داوطلبی: {student.code} | رشته {FIELD_MAP[student.field] || student.field}
          </p>
          <p className="text-indigo-400 text-xs mt-1">پایه: {student.grade}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-5">
        <h3 className="font-semibold text-slate-800">اطلاعات تکمیلی</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "شهر", key: "city", type: "text", placeholder: "مثال: تهران" },
            { label: "سن", key: "age", type: "number", placeholder: "مثال: ۱۷" },
            { label: "هدف اصلی", key: "mainGoal", type: "text", placeholder: "مثال: پزشکی تهران" },
            { label: "ساعت مطالعه روزانه", key: "studyHoursPerDay", type: "number", placeholder: "مثال: ۸" },
            { label: "تراز فعلی", key: "currentTraz", type: "number", placeholder: "مثال: ۶۵۰۰" },
            { label: "تراز هدف", key: "targetTraz", type: "number", placeholder: "مثال: ۸۵۰۰" },
          ].map((field) => (
            <div key={field.key} className={field.key === "mainGoal" ? "col-span-2" : ""}>
              <label className="text-sm font-medium text-slate-700 block mb-1">{field.label}</label>
              <input
                data-testid={`input-profile-${field.key}`}
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
              />
            </div>
          ))}
        </div>

        <button
          data-testid="button-save-profile"
          type="submit"
          disabled={updateStudent.isPending}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
        >
          {updateStudent.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          ذخیره تغییرات
        </button>
      </form>
    </div>
  );
}
