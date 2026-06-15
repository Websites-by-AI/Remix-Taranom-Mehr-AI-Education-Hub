import { useState } from "react";
import { useAnalyzeExam } from "@workspace/api-client-react";
import { BrainCircuit, Plus, Trash2, Loader2, Sparkles } from "lucide-react";

interface Props { studentField?: string }
interface Lesson { lessonName: string; percentage: number; correct: number; wrong: number; empty: number }

export default function PsychologyView({ studentField }: Props) {
  const analyzeExam = useAnalyzeExam();
  const [lessons, setLessons] = useState<Lesson[]>([{ lessonName: "", percentage: 0, correct: 0, wrong: 0, empty: 0 }]);
  const [result, setResult] = useState<{ weaknesses: unknown[]; estimatedNextTraz: number; psychological?: unknown } | null>(null);

  const addLesson = () => setLessons([...lessons, { lessonName: "", percentage: 0, correct: 0, wrong: 0, empty: 0 }]);
  const removeLesson = (i: number) => setLessons(lessons.filter((_, idx) => idx !== i));
  const updateLesson = (i: number, key: keyof Lesson, val: string | number) => {
    const updated = [...lessons];
    updated[i] = { ...updated[i], [key]: val };
    setLessons(updated);
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    analyzeExam.mutate(
      { data: { lessons: lessons.map((l) => ({ ...l, percentage: Number(l.percentage), correct: Number(l.correct), wrong: Number(l.wrong), empty: Number(l.empty) })), field: studentField || "tajrobi" } },
      { onSuccess: (data) => setResult({ weaknesses: data.weaknesses, estimatedNextTraz: data.estimatedNextTraz, psychological: data.psychological }) }
    );
  };

  const psych = result?.psychological as { pattern?: string; description?: string; stressLevel?: number; suggestion?: string } | undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">سنجش روانشناختی و تحلیل آزمون</h1>
        <p className="text-slate-500 mt-1 text-sm">درصد دروس آخرین آزمون را وارد کنید تا تحلیل AI دریافت کنید</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="space-y-3">
            {lessons.map((lesson, i) => (
              <div key={i} className="grid grid-cols-5 gap-2 items-center">
                <input
                  data-testid={`input-lesson-name-${i}`}
                  placeholder="نام درس"
                  value={lesson.lessonName}
                  onChange={(e) => updateLesson(i, "lessonName", e.target.value)}
                  required
                  className="col-span-2 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                />
                <input
                  data-testid={`input-lesson-pct-${i}`}
                  type="number" min="0" max="100"
                  placeholder="درصد"
                  value={lesson.percentage}
                  onChange={(e) => updateLesson(i, "percentage", e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                />
                <input
                  data-testid={`input-lesson-correct-${i}`}
                  type="number" min="0"
                  placeholder="صحیح"
                  value={lesson.correct}
                  onChange={(e) => updateLesson(i, "correct", e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                />
                <button type="button" onClick={() => removeLesson(i)} disabled={lessons.length === 1}
                  className="text-slate-300 hover:text-rose-500 transition-colors disabled:opacity-30 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addLesson}
            className="flex items-center gap-2 text-indigo-600 text-sm hover:underline">
            <Plus className="w-4 h-4" /> افزودن درس
          </button>
          <button
            data-testid="button-analyze-psychology"
            type="submit"
            disabled={analyzeExam.isPending}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 flex items-center justify-center gap-2"
          >
            {analyzeExam.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <><Sparkles className="w-4 h-4" /> تحلیل هوشمند</>
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-2xl p-6 text-center shadow-lg">
              <BrainCircuit className="w-8 h-8 mx-auto mb-2 opacity-80" />
              <div className="text-4xl font-bold">{result.estimatedNextTraz.toLocaleString("fa-IR")}</div>
              <div className="text-sm opacity-80 mt-1">تراز پیش‌بینی‌شده آزمون بعدی</div>
            </div>
            {psych && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-3">الگوی روانشناختی</h3>
                <div className="text-lg font-bold text-amber-600 mb-1">{psych.pattern || "—"}</div>
                <p className="text-sm text-slate-600 leading-6 mb-3">{psych.description || ""}</p>
                {psych.stressLevel !== undefined && (
                  <div>
                    <div className="text-xs text-slate-500 mb-1">سطح استرس: {psych.stressLevel}/10</div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-rose-500"
                        style={{ width: `${(psych.stressLevel / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                {psych.suggestion && <p className="text-xs text-indigo-600 mt-3 bg-indigo-50 rounded px-3 py-2">{psych.suggestion}</p>}
              </div>
            )}
          </div>

          {(result.weaknesses as { topic: string; subject: string; percentage: number; recommendation: string; severity: string }[]).length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-semibold text-slate-800 mb-4">نقاط ضعف شناسایی‌شده</h3>
              <div className="space-y-3">
                {(result.weaknesses as { topic: string; subject: string; percentage: number; recommendation: string; severity: string }[]).map((w, i) => (
                  <div key={i} data-testid={`weakness-${i}`} className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-slate-800 text-sm">{w.topic}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        w.severity === "high" ? "bg-rose-100 text-rose-700" :
                        w.severity === "medium" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                      }`}>
                        {w.severity === "high" ? "حیاتی" : w.severity === "medium" ? "متوسط" : "کم"}
                      </span>
                      <span className="text-xs font-bold text-indigo-700 mr-auto">{w.percentage}٪</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-5">{w.recommendation}</p>
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
