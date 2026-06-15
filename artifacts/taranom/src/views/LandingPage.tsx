import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Brain, GraduationCap, BarChart3, MessageSquare, Shield,
  Calendar, Star, ChevronLeft, X, Loader2, Users, Target, Zap,
  Phone, Mail, MapPin, Instagram, Send, CheckCircle2, Menu,
} from "lucide-react";
import { useLogin } from "@workspace/api-client-react";

type Role = "student" | "parent" | "admin";

interface StudentMe {
  id: number; name: string; code: string; field: string; grade: string;
  city?: string | null; age?: number | null; mainGoal?: string | null;
  subscriptionType?: string | null; currentTraz?: number | null;
  targetTraz?: number | null; studyHoursPerDay?: number | null;
  role?: string | null;
}

interface Props {
  onLogin: (role: Role, studentData: StudentMe) => void;
}

const NAV_LINKS = [
  { id: "features", label: "ویژگی‌ها" },
  { id: "about", label: "درباره ما" },
  { id: "services", label: "خدمات" },
  { id: "contact", label: "تماس با ما" },
];

const FEATURES = [
  {
    icon: Brain,
    title: "مشاور هوش مصنوعی",
    desc: "پاسخ فوری به سوالات کنکور با مدل Gemini — مثل داشتن یک مشاور خصوصی ۲۴ ساعته",
    color: "from-violet-500 to-indigo-600",
    bg: "bg-violet-50",
  },
  {
    icon: BarChart3,
    title: "داشبورد مانوا",
    desc: "تحلیل عمیق ترازها، نقاط ضعف و قوت در هر درس — نقشه راه شخصی‌سازی‌شده برای هر داوطلب",
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Calendar,
    title: "برنامه‌ریزی هوشمند",
    desc: "برنامه مطالعاتی کایزن با تایمر پومودورو — پایش تمرکز و بهره‌وری لحظه به لحظه",
    color: "from-amber-500 to-orange-600",
    bg: "bg-amber-50",
  },
  {
    icon: GraduationCap,
    title: "انتخاب رشته دقیق",
    desc: "تخمین احتمال قبولی در هر رشته با الگوریتم آماری — بر اساس تراز واقعی کنکور‌های قبلی",
    color: "from-sky-500 to-blue-600",
    bg: "bg-sky-50",
  },
  {
    icon: Shield,
    title: "بانک تله‌های تستی",
    desc: "شناسایی اشتباهات رایج و تله‌های طراح سوال — پیش‌بینی نقاط خطرناک آزمون",
    color: "from-rose-500 to-pink-600",
    bg: "bg-rose-50",
  },
  {
    icon: MessageSquare,
    title: "سنجش روانشناختی",
    desc: "ارزیابی آمادگی ذهنی و فراشناخت — مدیریت اضطراب کنکور با رویکرد علمی",
    color: "from-purple-500 to-fuchsia-600",
    bg: "bg-purple-50",
  },
];

const SERVICES = [
  { title: "اشتراک دانش‌آموز", price: "رایگان / پریمیوم", desc: "دسترسی به تمام ابزارهای کنکور، مشاور AI و داشبورد شخصی", badge: "پرطرفدار" },
  { title: "پنل والدین", price: "همراه اشتراک", desc: "نظارت بر پیشرفت فرزند، دریافت گزارش هفتگی و ارتباط با مشاور", badge: null },
  { title: "پکیج آکادمی‌ها", price: "سازمانی", desc: "اتصال پلتفرم به سایت وردپرسی آکادمی، مدیریت چندین دانش‌آموز", badge: "جدید" },
];

const STATS = [
  { value: "+۱۰۰۰۰", label: "داوطلب فعال" },
  { value: "+۵۰۰", label: "آکادمی همکار" },
  { value: "۸۵٪", label: "نرخ موفقیت" },
  { value: "۲۴/۷", label: "پشتیبانی AI" },
];

const ROLE_LABELS: Record<Role, string> = { student: "دانش‌آموز", parent: "والدین", admin: "مدیر" };

export default function LandingPage({ onLogin }: Props) {
  const [showLogin, setShowLogin] = useState(false);
  const [role, setRole] = useState<Role>("student");
  const [code, setCode] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const loginMutation = useLogin();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { data: { code, role } },
      {
        onSuccess: (data) => {
          const studentData: StudentMe = {
            id: data.student.id,
            name: data.student.name,
            code: data.student.code,
            field: data.student.field ?? "",
            grade: data.student.grade ?? "",
            city: data.student.city ?? null,
            age: data.student.age ?? null,
            mainGoal: data.student.mainGoal ?? null,
            subscriptionType: data.student.subscriptionType ?? null,
            currentTraz: data.student.currentTraz ?? null,
            targetTraz: data.student.targetTraz ?? null,
            studyHoursPerDay: data.student.studyHoursPerDay ?? null,
            role: (data.role as string) || role,
          };
          onLogin((data.role as Role) || role, studentData);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-white font-[Vazirmatn,sans-serif]" dir="rtl">

      {/* ── STICKY HEADER ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-tr from-indigo-900 to-slate-900 rounded-xl flex items-center justify-center shadow">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div className="leading-none">
              <span className="font-black text-slate-900 text-lg">ترنم همدلی</span>
              <span className="hidden sm:block text-[10px] text-slate-400 font-medium">پلتفرم هوشمند کنکور</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <button key={l.id} onClick={() => scrollTo(l.id)}
                className="px-4 py-2 text-sm text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition font-medium cursor-pointer">
                {l.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => setShowLogin(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition shadow-md shadow-indigo-200 cursor-pointer">
              ورود به سامانه
            </button>
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40" onClick={() => setMobileMenuOpen(false)}>
              <motion.div initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }}
                className="absolute left-0 top-0 h-full w-64 bg-white shadow-2xl p-6 space-y-3"
                onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-black text-slate-900">منو</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"><X className="w-5 h-5" /></button>
                </div>
                {NAV_LINKS.map((l) => (
                  <button key={l.id} onClick={() => scrollTo(l.id)}
                    className="w-full text-right px-4 py-3 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition font-medium cursor-pointer block">
                    {l.label}
                  </button>
                ))}
                <button onClick={() => { setMobileMenuOpen(false); setShowLogin(true); }}
                  className="w-full bg-indigo-600 text-white text-sm font-bold py-3 rounded-xl mt-4 cursor-pointer">
                  ورود به سامانه
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 text-white py-24 sm:py-32">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              هوش مصنوعی فعال — Gemini 2.0 Flash
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              مسیر قبولی در کنکور<br />
              <span className="text-amber-400">با هوش مصنوعی</span>
            </h1>
            <p className="text-indigo-200 text-lg sm:text-xl mt-6 max-w-2xl mx-auto leading-8">
              ترنم همدلی اولین پلتفرم کنکور با مشاور هوشمند، داشبورد تحلیلی و برنامه‌ریزی شخصی‌سازی‌شده برای هر داوطلب است.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setShowLogin(true)}
              className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-black px-8 py-4 rounded-2xl text-lg shadow-2xl shadow-amber-400/30 transition cursor-pointer flex items-center justify-center gap-2">
              <Zap className="w-5 h-5" />
              شروع رایگان
            </button>
            <button onClick={() => scrollTo("features")}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-8 py-4 rounded-2xl text-lg transition cursor-pointer flex items-center justify-center gap-2">
              بیشتر بدانید
              <ChevronLeft className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Stats bar */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-white/10 mt-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-amber-400">{s.value}</div>
                <div className="text-indigo-300 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-indigo-600 text-sm font-bold bg-indigo-50 px-4 py-1.5 rounded-full">ابزارهای هوشمند</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4">هر چیزی که برای کنکور نیاز داری</h2>
            <p className="text-slate-500 mt-3 text-lg max-w-xl mx-auto">از برنامه‌ریزی تا روانشناسی، از تحلیل تراز تا انتخاب رشته — همه در یک پلتفرم</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-default">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-6">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-emerald-600 text-sm font-bold bg-emerald-50 px-4 py-1.5 rounded-full">درباره ما</span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4 leading-tight">
                ما باور داریم هر داوطلب<br />
                <span className="text-indigo-600">لایق بهترین مشاور است</span>
              </h2>
              <p className="text-slate-600 mt-6 leading-8 text-base">
                ترنم همدلی با ترکیب هوش مصنوعی پیشرفته و روانشناسی آموزشی، یک تجربه مشاوره‌ای کاملاً شخصی‌سازی‌شده برای هر داوطلب کنکور فراهم می‌کند. ما اعتقاد داریم که دسترسی به مشاور باکیفیت نباید به پول یا موقعیت جغرافیایی وابسته باشد.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "تحلیل داده‌محور بر اساس کنکورهای واقعی",
                  "مشاور AI در دسترس ۲۴ ساعته، ۷ روز هفته",
                  "پایش روانشناختی و مدیریت اضطراب کنکور",
                  "یکپارچه‌سازی با سایت آکادمی‌های آموزشی",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-slate-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowLogin(true)}
                className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg cursor-pointer inline-flex items-center gap-2">
                شروع کنید
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "داوطلبان موفق", value: "+۱۰ هزار", icon: Users, color: "bg-indigo-50 border-indigo-100" },
                { label: "آکادمی همکار", value: "+۵۰۰", icon: GraduationCap, color: "bg-emerald-50 border-emerald-100" },
                { label: "مشاوره AI", value: "بی‌نهایت", icon: Brain, color: "bg-amber-50 border-amber-100" },
                { label: "نرخ موفقیت", value: "۸۵٪", icon: Target, color: "bg-rose-50 border-rose-100" },
              ].map((s) => (
                <div key={s.label} className={`${s.color} border rounded-2xl p-6 text-center`}>
                  <s.icon className="w-8 h-8 mx-auto mb-3 text-slate-600" />
                  <div className="text-2xl font-black text-slate-900">{s.value}</div>
                  <div className="text-slate-500 text-sm mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-20 bg-gradient-to-br from-slate-900 to-indigo-950 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-amber-400 text-sm font-bold bg-amber-400/10 border border-amber-400/20 px-4 py-1.5 rounded-full">خدمات ما</span>
            <h2 className="text-3xl sm:text-4xl font-black mt-4">پلن مناسب خودت را انتخاب کن</h2>
            <p className="text-indigo-300 mt-3 text-lg">از دانش‌آموز منفرد تا آکادمی‌های بزرگ — برای همه راه‌حل داریم</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => (
              <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className={`bg-white/10 border rounded-2xl p-7 hover:bg-white/15 transition-all relative ${i === 0 ? "border-amber-400/50 ring-1 ring-amber-400/30" : "border-white/10"}`}>
                {s.badge && (
                  <span className={`absolute -top-3 right-6 text-xs font-black px-3 py-1 rounded-full ${s.badge === "جدید" ? "bg-emerald-500 text-white" : "bg-amber-400 text-slate-900"}`}>
                    {s.badge}
                  </span>
                )}
                <h3 className="font-black text-xl mb-2">{s.title}</h3>
                <div className="text-amber-400 font-bold text-lg mb-4">{s.price}</div>
                <p className="text-indigo-200 text-sm leading-6">{s.desc}</p>
                <button onClick={() => setShowLogin(true)}
                  className="mt-6 w-full bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold py-3 rounded-xl transition text-sm cursor-pointer">
                  شروع کنید
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-slate-900 text-center mb-10">نظر داوطلبان موفق</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "علی محمدی", univ: "قبولی پزشکی تهران", text: "مشاور AI ترنم همدلی نقاط ضعفم رو توی زیست دقیقاً پیدا کرد و برنامه‌ام رو کاملاً تغییر داد." },
              { name: "فاطمه رضایی", univ: "قبولی دندانپزشکی مشهد", text: "داشبورد مانوا هر هفته بهم می‌گفت کجام و چی باید بخونم. واقعاً فرق داشت با روش‌های قبلی." },
              { name: "امیرحسین کریمی", univ: "قبولی مهندسی شریف", text: "بخش سنجش روانشناختی اضطرابم رو خیلی کمتر کرد. یاد گرفتم چطور مدیریت کنم." },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-600 text-sm leading-6 mb-4">"{t.text}"</p>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                  <div className="text-emerald-600 text-xs font-medium">{t.univ}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-rose-600 text-sm font-bold bg-rose-50 px-4 py-1.5 rounded-full">تماس با ما</span>
            <h2 className="text-3xl font-black text-slate-900 mt-4">سوالی داری؟ اینجاییم</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Phone, title: "تلفن پشتیبانی", value: "۰۲۱-۴۴۵۵۶۶۷۷", color: "text-indigo-600 bg-indigo-50" },
              { icon: Mail, title: "ایمیل", value: "info@taranomehr.com", color: "text-emerald-600 bg-emerald-50" },
              { icon: MapPin, title: "دفتر مرکزی", value: "تهران، خیابان ولیعصر", color: "text-amber-600 bg-amber-50" },
            ].map((c) => (
              <div key={c.title} className="text-center p-6 rounded-2xl border border-slate-100 hover:shadow-md transition">
                <div className={`w-12 h-12 rounded-xl ${c.color} flex items-center justify-center mx-auto mb-4`}>
                  <c.icon className="w-6 h-6" />
                </div>
                <div className="font-bold text-slate-800 mb-1">{c.title}</div>
                <div className="text-slate-500 text-sm">{c.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10 pb-10 border-b border-slate-800">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-slate-800 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="font-black text-lg">ترنم همدلی</div>
                  <div className="text-slate-400 text-xs">پلتفرم هوشمند کنکور سراسری</div>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-7 max-w-xs">
                ترنم همدلی با هدف دموکراتیزه کردن دسترسی به مشاور باکیفیت کنکور ساخته شده — برای همه داوطلبان، در هر کجای ایران.
              </p>
              <div className="flex gap-3 mt-6">
                <a href="#" className="w-9 h-9 bg-slate-800 hover:bg-indigo-600 rounded-xl flex items-center justify-center transition cursor-pointer">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 bg-slate-800 hover:bg-sky-600 rounded-xl flex items-center justify-center transition cursor-pointer">
                  <Send className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4 text-slate-300">لینک‌های سریع</h4>
              <ul className="space-y-3">
                {NAV_LINKS.map((l) => (
                  <li key={l.id}>
                    <button onClick={() => scrollTo(l.id)} className="text-slate-400 hover:text-white text-sm transition cursor-pointer">
                      {l.label}
                    </button>
                  </li>
                ))}
                <li>
                  <button onClick={() => setShowLogin(true)} className="text-amber-400 hover:text-amber-300 text-sm font-bold transition cursor-pointer">
                    ورود به سامانه
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4 text-slate-300">خدمات</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li>مشاور هوش مصنوعی</li>
                <li>داشبورد مانوا</li>
                <li>انتخاب رشته</li>
                <li>برنامه‌ریزی هوشمند</li>
                <li>پنل والدین</li>
                <li>افزونه وردپرس</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
            <span>© ۱۴۰۵ ترنم همدلی — تمامی حقوق محفوظ است</span>
            <div className="flex gap-4">
              <span>حریم خصوصی</span>
              <span>شرایط استفاده</span>
              <span>قوانین</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── LOGIN MODAL ── */}
      <AnimatePresence>
        {showLogin && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={() => setShowLogin(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}>
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 text-center text-white relative">
                <button onClick={() => setShowLogin(false)}
                  className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
                <div className="w-14 h-14 mx-auto bg-amber-400/20 rounded-2xl flex items-center justify-center border border-amber-400/30 mb-4">
                  <Sparkles className="w-7 h-7 text-amber-400" />
                </div>
                <h2 className="text-2xl font-black">ورود به ترنم همدلی</h2>
                <p className="text-indigo-300 text-sm mt-1">دستیار تخصصی موفقیت در کنکور</p>
              </div>

              <div className="p-7 space-y-5">
                <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl">
                  {(["student", "parent", "admin"] as const).map((r) => (
                    <button key={r} onClick={() => setRole(r)}
                      className={`flex-1 py-2.5 text-xs font-black rounded-xl transition cursor-pointer ${role === r ? "bg-white text-indigo-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                      {ROLE_LABELS[r]}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="text-xs font-black text-slate-600 block mb-1.5">
                      {role === "admin" ? "کد مدیریت" : "شماره داوطلبی یا نام کاربری"}
                    </label>
                    <input value={code} onChange={(e) => setCode(e.target.value)}
                      className="w-full text-center text-lg bg-slate-50 border border-slate-200 h-12 rounded-xl outline-none focus:border-indigo-400 transition"
                      placeholder={role === "admin" ? "admin" : "شماره یا نام"} />
                  </div>
                  {loginMutation.isError && (
                    <p className="text-sm text-rose-600 text-center bg-rose-50 py-2 rounded-xl border border-rose-100 font-bold">
                      کد وارد شده صحیح نیست
                    </p>
                  )}
                  <button type="submit" disabled={loginMutation.isPending || !code.trim()}
                    className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-900 font-black h-12 text-base rounded-xl shadow-lg shadow-amber-500/20 transition cursor-pointer flex items-center justify-center gap-2">
                    {loginMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "ورود به سامانه هوشمند"}
                  </button>
                </form>

                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <p className="text-[10px] text-slate-400 font-black text-center">ورود سریع به دمو:</p>
                  <div className="flex gap-2">
                    {[
                      { code: "admin", role: "admin" as Role, label: "مدیر آکادمی" },
                      { code: "demo", role: "student" as Role, label: "دانش‌آموز نمونه" },
                    ].map((m) => (
                      <button key={m.code} onClick={() => { setCode(m.code); setRole(m.role); }}
                        className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 transition cursor-pointer">
                        <span className="font-mono text-indigo-700 block">{m.code}</span>
                        <span className="text-slate-400 block text-[9px]">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
