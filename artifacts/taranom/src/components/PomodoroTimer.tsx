import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Clock, Sparkles, AlertCircle, Info } from "lucide-react";

type TimerMode = "work" | "shortBreak" | "longBreak";

const modeConfig = {
  work: { label: "مطالعه عمیق", minutes: 25, bg: "bg-gradient-to-br from-blue-900 to-indigo-950", icon: <Clock size={16} /> },
  shortBreak: { label: "استراحت کوتاه", minutes: 5, bg: "bg-gradient-to-br from-emerald-700 to-teal-800", icon: <Sparkles size={16} /> },
  longBreak: { label: "استراحت بلند", minutes: 15, bg: "bg-gradient-to-br from-indigo-700 to-purple-800", icon: <AlertCircle size={16} /> }
};

const toPersianNum = (n: number | string) => {
  const farsi = ["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];
  return n.toString().replace(/\d/g, x => farsi[parseInt(x)]);
};

export default function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>("work");
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [focusProgress, setFocusProgress] = useState(100);
  const [isFocusDropped, setIsFocusDropped] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState("هوش مصنوعی ترنم همدلی آماده پایش تمرکز شما است. تایمر را شروع کنید.");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const focusIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s === 0) {
            setMinutes(m => {
              if (m === 0) {
                setIsActive(false);
                if (mode === "work") {
                  setSessionsCompleted(c => c + 1);
                  setAiAnalysis("پومودورو با موفقیت تکمیل شد! یک استراحت کوتاه بگیرید.");
                }
                return modeConfig[mode].minutes;
              }
              return m - 1;
            });
            return 59;
          }
          return s - 1;
        });
      }, 1000);

      focusIntervalRef.current = setInterval(() => {
        setFocusProgress(p => {
          const newP = Math.max(0, p - (Math.random() * 2 + 0.5));
          if (newP < 30 && !isFocusDropped) {
            setIsFocusDropped(true);
            setAiAnalysis("⚠️ هشدار: افت تمرکز تشخیص داده شد! یک استراحت کوتاه توصیه می‌شود.");
          }
          return newP;
        });
      }, 3000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (focusIntervalRef.current) clearInterval(focusIntervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (focusIntervalRef.current) clearInterval(focusIntervalRef.current);
    };
  }, [isActive, mode, isFocusDropped]);

  const startTimer = () => { setIsActive(true); setAiAnalysis("تمرکز شما در حال پایش است. موفق باشید!"); };
  const pauseTimer = () => { setIsActive(false); setAiAnalysis("تایمر متوقف شد. هر زمان آماده شدید ادامه دهید."); };
  const resetTimer = () => {
    setIsActive(false);
    setMinutes(modeConfig[mode].minutes);
    setSeconds(0);
    setFocusProgress(100);
    setIsFocusDropped(false);
    setAiAnalysis("تایمر ریست شد. آماده مطالعه جدید هستید!");
  };

  const toggleMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);
    setMinutes(modeConfig[newMode].minutes);
    setSeconds(0);
    setFocusProgress(100);
    setIsFocusDropped(false);
  };

  const recoverFocus = () => {
    setFocusProgress(70);
    setIsFocusDropped(false);
    setAiAnalysis("تمرکز مجدداً بازیابی شد. ادامه دهید!");
  };

  const triggerFocusWarning = () => {
    setFocusProgress(20);
    setIsFocusDropped(true);
  };

  const formatTime = (m: number, s: number) => {
    const mm = m < 10 ? `۰${toPersianNum(m)}` : toPersianNum(m);
    const ss = s < 10 ? `۰${toPersianNum(s)}` : toPersianNum(s);
    return `${mm}:${ss}`;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
      <div className={`p-8 md:w-1/2 flex flex-col items-center justify-center text-white relative transition-all duration-500 ${modeConfig[mode].bg}`}>
        <div className="absolute top-4 right-6 flex items-center gap-2 opacity-60">
          <Clock size={14} />
          <span className="text-[10px] font-bold">سیستم پومودورو ترنم همدلی</span>
        </div>

        <div className="text-6xl font-black font-mono mb-6 tracking-widest drop-shadow-sm select-none">
          {formatTime(minutes, seconds)}
        </div>

        <div className="flex items-center gap-2 mb-8 bg-black/10 px-4 py-2 rounded-full border border-white/10">
          {modeConfig[mode].icon}
          <span className="text-xs font-bold">{modeConfig[mode].label}</span>
        </div>

        <div className="flex items-center gap-4">
          {!isActive ? (
            <button onClick={startTimer} className="w-14 h-14 bg-white text-slate-900 rounded-full flex items-center justify-center hover:scale-110 transition shadow-lg cursor-pointer">
              <Play fill="currentColor" size={24} />
            </button>
          ) : (
            <button onClick={pauseTimer} className="w-14 h-14 bg-white text-slate-900 rounded-full flex items-center justify-center hover:scale-110 transition shadow-lg cursor-pointer">
              <Pause fill="currentColor" size={24} />
            </button>
          )}
          <button onClick={resetTimer} className="w-12 h-12 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition border border-white/20 cursor-pointer">
            <RotateCcw size={20} />
          </button>
        </div>

        <div className="mt-8 flex gap-1">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`w-2.5 h-2.5 rounded-full border border-white/30 transition-all ${sessionsCompleted >= i ? "bg-amber-400 border-amber-400 scale-125" : "bg-white/10"}`} />
          ))}
        </div>
      </div>

      <div className="p-8 md:w-1/2 flex flex-col justify-between text-right space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">
              <Sparkles size={14} className="animate-pulse" />
              <span className="text-[10px] font-black italic">AI Monitoring Active</span>
            </div>
            <h3 className="text-sm font-black text-slate-800">پایش هوشمند تمرکز</h3>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-black">
              <span className={focusProgress < 30 ? "text-rose-600 animate-pulse" : "text-emerald-700"}>
                {toPersianNum(Math.round(focusProgress))}٪ تراز تمرکز
              </span>
              <span className="text-slate-400">تحلیل آنی</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${focusProgress}%` }}
                className={`h-full rounded-full transition-colors ${focusProgress > 60 ? "bg-emerald-500" : focusProgress > 30 ? "bg-amber-500" : "bg-rose-500"}`}
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
            <div className="flex gap-2 items-start">
              <Info size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">{aiAnalysis}</p>
            </div>
          </div>

          <AnimatePresence>
            {isFocusDropped && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="p-4 bg-rose-50 border border-rose-100 rounded-2xl space-y-3"
              >
                <div className="flex items-center gap-2 text-rose-700">
                  <AlertCircle size={18} />
                  <span className="text-xs font-black">تشخیص افت عمیق تمرکز!</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleMode("shortBreak")} className="flex-1 bg-white border border-rose-200 text-rose-700 py-2 rounded-xl text-[10px] font-black hover:bg-rose-500 hover:text-white transition cursor-pointer">
                    پذیرش استراحت هوشمند
                  </button>
                  <button onClick={recoverFocus} className="flex-1 bg-rose-600 text-white py-2 rounded-xl text-[10px] font-black hover:bg-rose-700 transition cursor-pointer">
                    تمرکز مجدد
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {(["work", "shortBreak", "longBreak"] as TimerMode[]).map(m => (
              <button key={m} onClick={() => toggleMode(m)} className={`py-2 px-1 rounded-xl text-[10px] font-black border transition cursor-pointer ${mode === m ? "bg-blue-50 border-blue-200 text-blue-900" : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"}`}>
                {m === "work" ? "مطالعه (۲۵)" : m === "shortBreak" ? "کوتاه (۵)" : "طولانی (۱۵)"}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center pt-1 border-t border-slate-50">
            <button onClick={triggerFocusWarning} className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 hover:text-rose-600 transition underline cursor-pointer">
              <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
              تست دستی هشدار تمرکز
            </button>
            <span className="text-[9px] font-bold text-slate-400">موتور K-Focus v1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
