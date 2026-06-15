import { useState } from "react";
import { useGetGoalInsight } from "@workspace/api-client-react";
import { Target, Loader2, Sparkles } from "lucide-react";

interface Props { studentId: number; currentTraz?: number | null; targetTraz?: number | null; studentField?: string }

export default function CounselingView({ currentTraz, targetTraz, studentField }: Props) {
  const getGoalInsight = useGetGoalInsight();
  const [formData, setFormData] = useState({
    currentTraz: currentTraz?.toString() || "",
    targetTraz: targetTraz?.toString() || "",
    currentPercentage: "",
    targetGrowth: "",
    latestQuizScore: "",
  });
  const [result, setResult] = useState<{ likelihood: number; text: string; recommendations: string[] } | null>(null);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    getGoalInsight.mutate(
      {
        data: {
          currentTraz: Number(formData.currentTraz),
          targetTraz: Number(formData.targetTraz),
          currentPercentage: Number(formData.currentPercentage),
          targetGrowth: Number(formData.targetGrowth),
          latestQuizScore: Number(formData.latestQuizScore),
          studentField: studentField || "tajrobi",
        },
      },
      {
        onSuccess: (data) => setResult({ likelihood: data.likelihood, text: data.text, recommendations: data.recommendations }),
      }
    );
  };

  const likelihoodColor =
    (result?.likelihood || 0) >= 70 ? "text-emerald-600" :
    (result?.likelihood || 0) >= 45 ? "text-amber-600" : "text-rose-600";

  const likelihoodBg =
    (result?.likelihood || 0) >= 70 ? "from-emerald-500 to-emerald-700" :
    (result?.likelihood || 0) >= 45 ? "from-amber-500 to-amber-700" : "from-rose-500 to-rose-700";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">انتخاب رشته هوشمند</h1>
        <p className="text-slate-500 mt-1 text-sm">شانس رسیدن به تراز هدف و توصیه‌های هوش مصنوعی</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="font-semibold text-slate-800 mb-5 flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600" />
          اطلاعات تراز و هدف
        </h2>
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "تراز فعلی", key: "currentTraz", placeholder: "مثال: ۶۵۰۰" },
              { label: "تراز هدف", key: "targetTraz", placeholder: "مثال: ۸۵۰۰" },
              { label: "درصد کلی آخرین آزمون", key: "currentPercentage", placeholder: "مثال: ۵۵" },
              { label: "هدف رشد درصد (%)", key: "targetGrowth", placeholder: "مثال: ۱۵" },
              { label: "نمره آزمونک اخیر", key: "latestQuizScore", placeholder: "مثال: ۷۰" },
            ].map((field) => (
              <div key={field.key} className={field.key === "latestQuizScore" ? "col-span-2" : ""}>
                <label className="text-sm font-medium text-slate-700 block mb-1">{field.label}</label>
                <input
                  data-testid={`input-counseling-${field.key}`}
                  type="number"
                  placeholder={field.placeholder}
                  value={formData[field.key as keyof typeof formData]}
                  onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                  required={field.key === "currentTraz" || field.key === "targetTraz"}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                />
              </div>
            ))}
          </div>
          <button
            data-testid="button-analyze-goal"
            type="submit"
            disabled={getGoalInsight.isPending}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 flex items-center justify-center gap-2"
          >
            {getGoalInsight.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <><Sparkles className="w-4 h-4" /> تحلیل با هوش مصنوعی</>
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className="space-y-4">
          <div className={`bg-gradient-to-br ${likelihoodBg} rounded-2xl p-6 text-white text-center shadow-lg`}>
            <div className="text-6xl font-bold mb-2">{result.likelihood}٪</div>
            <div className="text-lg font-semibold opacity-90">احتمال رسیدن به هدف</div>
            <p className="text-sm mt-3 opacity-80 leading-6">{result.text}</p>
          </div>

          {result.recommendations.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-semibold text-slate-800 mb-4">توصیه‌های اختصاصی هوش مصنوعی</h3>
              <div className="space-y-3">
                {result.recommendations.map((rec, i) => (
                  <div key={i} data-testid={`recommendation-${i}`} className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg">
                    <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-sm text-slate-700 leading-6">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
