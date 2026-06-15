import { useState } from "react";
import {
  Brain, HeartHandshake, Target, Zap, BookOpen,
  Star, TrendingUp, AlertCircle, Check, ChevronLeft, RefreshCw, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell
} from "recharts";
import { Student } from "../types";

const toPersianNum = (n: number | string) => {
  const farsi = ["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];
  return n.toString().replace(/\d/g, x => farsi[parseInt(x)]);
};

const QUIZ_QUESTIONS = [
  {
    id: 1, section: "انگیزه و هدف",
    question: "وقتی به کنکور فکر می‌کنید، چه احساسی دارید؟",
    options: ["اضطراب شدید و ترس", "نگرانی ولی با انگیزه", "آرامش و اطمینان", "بی‌تفاوتی کامل"],
    scores: [1, 3, 5, 2]
  },
  {
    id: 2, section: "مدیریت استرس",
    question: "هنگام مطالعه مبحث دشوار، معمولاً چه می‌کنید؟",
    options: ["مطالعه را رها می‌کنم", "برنامه را عوض می‌کنم", "با استراتژی ادامه می‌دهم", "از مربی کمک می‌گیرم"],
    scores: [1, 2, 5, 4]
  },
  {
    id: 3, section: "خودشناسی",
    question: "چند ساعت مطالعه مؤثر در روز دارید؟",
    options: ["کمتر از ۲ ساعت", "۲ تا ۴ ساعت", "۴ تا ۶ ساعت", "بیش از ۶ ساعت"],
    scores: [1, 2, 4, 5]
  },
  {
    id: 4, section: "رزیلینس",
    question: "بعد از یک آزمون بد، چند روز طول می‌کشد تا مجدداً انگیزه بگیرید؟",
    options: ["بیشتر از یک هفته", "۳ تا ۷ روز", "۱ تا ۲ روز", "همان روز"],
    scores: [1, 2, 4, 5]
  },
  {
    id: 5, section: "تمرکز",
    question: "در هنگام مطالعه، حواس‌پرتی به موبایل دارید؟",
    options: ["هر ۱۰ دقیقه یک‌بار", "هر ۳۰ دقیقه", "هر ساعت یک‌بار", "تقریباً هرگز"],
    scores: [1, 2, 4, 5]
  }
];

const RADAR_DATA_BASE = [
  { metric: "انگیزه", key: "motivation" },
  { metric: "مدیریت استرس", key: "stress" },
  { metric: "خودشناسی", key: "self" },
  { metric: "رزیلینس", key: "resilience" },
  { metric: "تمرکز", key: "focus" },
];

export default function AssessmentView({ student, onNavigateChange }: { student: Student; onNavigateChange?: (v: string) => void }) {
  const [phase, setPhase] = useState<"intro" | "quiz" | "result">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState<{ level: string; text: string; recommendations: string[] } | null>(null);

  const handleAnswer = (optIdx: number) => {
    const score = QUIZ_QUESTIONS[currentQ].scores[optIdx];
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      setCurrentQ(prev => prev + 1);
    } else {
      setPhase("result");
      generateInsight(newAnswers);
    }
  };

  const generateInsight = (scores: number[]) => {
    setAiLoading(true);
    setTimeout(() => {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      const level = avg >= 4 ? "عالی" : avg >= 3 ? "خوب" : avg >= 2 ? "متوسط" : "نیاز به بهبود";
      setAiInsight({
        level,
        text: avg >= 4
          ? `داوطلب گرامی ${student.name}، سطح آمادگی روانی شما در سطح رتبه برتر است. با این سطح انگیزه و تمرکز، قبولی در رشته دلخواه شما کاملاً دستیابنی است.`
          : avg >= 3
          ? `داوطلب عزیز ${student.name}، آمادگی روانی شما در سطح خوبی است اما برخی حوزه‌ها نیاز به تقویت دارند. با اصلاح برنامه مطالعاتی می‌توانید به سطح عالی برسید.`
          : `داوطلب گرامی ${student.name}، برخی شاخص‌های روانی نیاز به توجه دارند. پیشنهاد می‌شود با مشاور کایزن ترنم همدلی جلسه داشته باشید.`,
        recommendations: [
          "هر روز ۱۰ دقیقه مدیتیشن یا تنفس عمیق انجام دهید.",
          "یک دفترچه موفقیت روزانه داشته باشید و دستاوردها را یادداشت کنید.",
          "از تکنیک Pomodoro برای بهبود تمرکز و کاهش حواس‌پرتی استفاده کنید.",
          "هفته‌ای یک‌بار با مشاور آکادمی جلسه کوتاه داشته باشید."
        ]
      });
      setAiLoading(false);
    }, 2000);
  };

  const totalScore = answers.reduce((a, b) => a + b, 0);
  const maxScore = QUIZ_QUESTIONS.length * 5;
  const percentage = Math.round((totalScore / maxScore) * 100);

  const radarData = RADAR_DATA_BASE.map((item, i) => ({
    metric: item.metric,
    value: answers[i] ? Math.round((answers[i] / 5) * 100) : 60
  }));

  const barData = QUIZ_QUESTIONS.map((q, i) => ({
    name: q.section.substring(0, 6),
    score: answers[i] ? Math.round((answers[i] / 5) * 100) : 0
  }));

  const reset = () => {
    setPhase("intro");
    setCurrentQ(0);
    setAnswers([]);
    setAiInsight(null);
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <div className="bg-gradient-to-br from-indigo-900 via-purple-950 to-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-indigo-200 text-[10px] font-black">
              <Brain size={14} />
              <span>Psychological Readiness Assessment — APA Standard</span>
            </div>
            <h1 className="text-3xl font-black">سنجش آمادگی روانشناختی داوطلب</h1>
            <p className="text-slate-400 text-xs leading-relaxed max-w-2xl">
              ارزیابی سطح انگیزه، تمرکز، رزیلینس و مدیریت استرس بر اساس استانداردهای روانشناختی APA جهت برنامه‌ریزی هدفمند.
            </p>
          </div>
          <div className="p-5 bg-white/5 border border-white/10 rounded-2xl text-center min-w-[120px]">
            <HeartHandshake size={28} className="text-rose-300 mx-auto mb-2" />
            <span className="text-[10px] text-slate-400 font-black block">سطح آمادگی</span>
            <span className="text-xl font-black text-white">{phase === "result" ? `${toPersianNum(percentage)}٪` : "—"}</span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-indigo-50 rounded-2xl mx-auto flex items-center justify-center">
              <Brain size={36} className="text-indigo-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-slate-900">آزمون سنجش آمادگی ذهنی</h2>
              <p className="text-sm text-slate-500 leading-relaxed max-w-lg mx-auto">
                این آزمون ۵ سوالی وضعیت روانشناختی شما را در حوزه‌های انگیزه، استرس، تمرکز و رزیلینس ارزیابی می‌کند.
                نتایج کاملاً محرمانه است و برای بهینه‌سازی برنامه مطالعاتی شما استفاده می‌شود.
              </p>
            </div>
            <div className="flex justify-center gap-4 flex-wrap">
              {[
                { label: "۵ سوال کوتاه", icon: <BookOpen size={14} />, color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
                { label: "۲ دقیقه زمان", icon: <Target size={14} />, color: "text-amber-600 bg-amber-50 border-amber-100" },
                { label: "تحلیل AI فوری", icon: <Sparkles size={14} />, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black ${item.color}`}>
                  {item.icon}{item.label}
                </div>
              ))}
            </div>
            <button onClick={() => setPhase("quiz")}
              className="bg-indigo-900 hover:bg-slate-900 text-white font-black px-10 py-3.5 rounded-xl text-sm transition shadow-lg cursor-pointer">
              شروع ارزیابی
            </button>
          </motion.div>
        )}

        {phase === "quiz" && (
          <motion.div key={`q-${currentQ}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400">{QUIZ_QUESTIONS[currentQ].section}</span>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {QUIZ_QUESTIONS.map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full transition-all ${i < currentQ ? "bg-indigo-500" : i === currentQ ? "bg-indigo-300 scale-125" : "bg-slate-200"}`} />
                  ))}
                </div>
                <span className="text-[10px] font-black text-slate-500">{toPersianNum(currentQ + 1)} از {toPersianNum(QUIZ_QUESTIONS.length)}</span>
              </div>
            </div>

            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full transition-all" style={{ width: `${((currentQ) / QUIZ_QUESTIONS.length) * 100}%` }} />
            </div>

            <h3 className="text-lg font-black text-slate-900 leading-relaxed">{QUIZ_QUESTIONS[currentQ].question}</h3>

            <div className="space-y-3">
              {QUIZ_QUESTIONS[currentQ].options.map((opt, i) => (
                <button key={i} onClick={() => handleAnswer(i)}
                  className="w-full text-right p-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-900 transition-all cursor-pointer flex items-center justify-between group">
                  <span>{opt}</span>
                  <ChevronLeft size={16} className="text-slate-300 group-hover:text-indigo-500 transition" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === "result" && (
          <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            {aiLoading ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl mx-auto flex items-center justify-center">
                  <Brain size={28} className="text-indigo-400 animate-pulse" />
                </div>
                <p className="text-sm font-black text-slate-700">هوش مصنوعی ترنم همدلی در حال تحلیل پاسخ‌های شما است...</p>
                <div className="flex justify-center gap-2">
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
                      className="w-2 h-2 rounded-full bg-indigo-400" />
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2"><Brain size={16} className="text-indigo-600" />پروفایل روانشناختی شما</h3>
                    <div className="h-56" style={{ direction: "ltr" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="#e2e8f0" />
                          <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9, fill: "#475569" }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
                          <Radar dataKey="value" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.2} strokeWidth={2} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2"><TrendingUp size={16} className="text-amber-600" />امتیاز هر حوزه</h3>
                    <div className="h-56" style={{ direction: "ltr" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} />
                          <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} width={40} />
                          <Tooltip formatter={(v: number) => [`${Math.round(v)}٪`, "امتیاز"]} contentStyle={{ borderRadius: 12, fontSize: 11 }} />
                          <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                            {barData.map((entry, i) => (
                              <Cell key={i} fill={entry.score >= 80 ? "#10b981" : entry.score >= 60 ? "#3b82f6" : entry.score >= 40 ? "#f59e0b" : "#ef4444"} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {aiInsight && (
                  <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl border border-white/5 p-6 space-y-5 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-amber-400" />
                        <span className="text-xs font-black text-slate-300">تحلیل هوشمند مربی ترنم همدلی</span>
                      </div>
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${
                        aiInsight.level === "عالی" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" :
                        aiInsight.level === "خوب" ? "bg-blue-500/20 text-blue-300 border-blue-500/30" :
                        "bg-amber-500/20 text-amber-300 border-amber-500/30"
                      }`}>
                        سطح آمادگی: {aiInsight.level}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed font-medium">{aiInsight.text}</p>
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black text-amber-300 flex items-center gap-1.5"><Star size={11} />توصیه‌های کایزن برای بهبود آمادگی:</h4>
                      {aiInsight.recommendations.map((rec, i) => (
                        <div key={i} className="flex items-start gap-2 bg-white/5 border border-white/5 p-3 rounded-xl">
                          <span className="w-5 h-5 bg-white/10 text-white/70 rounded-lg flex items-center justify-center text-[9px] font-black flex-shrink-0 mt-0.5">{toPersianNum(i + 1)}</span>
                          <p className="text-[11px] text-slate-300 leading-relaxed">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-center gap-3">
                  <button onClick={reset} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-2.5 rounded-xl text-sm font-black hover:bg-slate-50 transition cursor-pointer">
                    <RefreshCw size={14} />انجام مجدد آزمون
                  </button>
                  {onNavigateChange && (
                    <button onClick={() => onNavigateChange("metacognition")}
                      className="flex items-center gap-2 bg-indigo-900 text-white px-6 py-2.5 rounded-xl text-sm font-black hover:bg-slate-900 transition cursor-pointer">
                      <Brain size={14} />ورود به آزمایشگاه فراشناخت
                    </button>
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
