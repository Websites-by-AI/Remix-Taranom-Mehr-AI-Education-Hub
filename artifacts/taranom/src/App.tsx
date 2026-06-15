import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  useLogin, useLogout, useGetMe, getGetMeQueryKey,
} from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, LayoutDashboard, FileSpreadsheet,
  Calendar, MessageSquare, LineChart, Users, Sparkles, Layers, Shield, Target,
  Palette, Building2, Menu, X, ChevronLeft, Pipette, GraduationCap, Settings,
  Brain, Loader2, ShieldAlert,
} from "lucide-react";
import { INSTITUTIONS, BRAND_CONFIG, setBrandById } from "./constants";
import { Student } from "./types";

import DashboardView from "./views/DashboardView";
import ManovaDashboard from "./views/ManovaDashboard";
import ReportView from "./views/ReportView";
import StudyPlanView from "./views/StudyPlanView";
import CounselorView from "./views/CounselorView";
import ProgressView from "./views/ProgressView";
import TrapsView from "./views/TrapsView";
import AssessmentView from "./views/AssessmentView";
import MetacognitionLabView from "./views/MetacognitionLabView";
import CounselingAdvisorView from "./views/CounselingAdvisorView";
import ParentsView from "./views/ParentsView";
import AdminView from "./views/AdminView";
import ProfileSettingsView from "./views/ProfileSettingsView";
import LandingPage from "./views/LandingPage";
import SmartNotifications from "./components/SmartNotifications";
import FocusChallengeOverlay from "./components/FocusChallengeOverlay";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
});

type Role = "student" | "parent" | "admin";

interface StudentMe {
  id: number; name: string; code: string; field: string; grade: string;
  city?: string | null; age?: number | null; mainGoal?: string | null;
  subscriptionType?: string | null; currentTraz?: number | null;
  targetTraz?: number | null; studyHoursPerDay?: number | null;
  role?: string | null;
}

const toStudent = (me: StudentMe): Student => ({
  ...me,
  currentTraz: me.currentTraz ?? undefined,
  targetTraz: me.targetTraz ?? undefined,
  studyHoursPerDay: me.studyHoursPerDay ?? undefined,
  academicProfile: {
    currentTraz: me.currentTraz ?? undefined,
    targetTraz: me.targetTraz ?? undefined,
    studyHoursPerDay: me.studyHoursPerDay ?? undefined,
  }
});


function MainApp({ me, role, onLogout }: { me: StudentMe; role: Role; onLogout: () => void }) {
  const [view, setView] = useState<string>(() => {
    if (role === "parent") return "parents";
    if (role === "admin") return "admin";
    return "dashboard";
  });
  const [theme, setTheme] = useState<string>(() => localStorage.getItem("taranom_app_theme") || "classic");
  const [activeBrandId, setActiveBrandId] = useState(BRAND_CONFIG.id);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFocusChallengeOpen, setIsFocusChallengeOpen] = useState(false);
  const [student, setStudent] = useState<Student>(toStudent(me));

  const switchBrand = (id: string) => {
    setBrandById(id);
    setActiveBrandId(id);
    const brand = INSTITUTIONS.find(i => i.id === id);
    if (brand) {
      setTheme(brand.theme);
      localStorage.setItem("taranom_app_theme", brand.theme);
    }
  };

  const handleThemeChange = (t: string) => {
    setTheme(t);
    localStorage.setItem("taranom_app_theme", t);
    setShowThemeMenu(false);
  };

  const getThemeCSS = (t: string): string => {
    switch (t) {
      case "emerald":
        return ":root { --color-blue-900: #064e3b !important; --color-blue-950: #022c22 !important; --color-indigo-900: #0f765e !important; --color-indigo-950: #115e50 !important; --color-amber-400: #10b981 !important; }";
      case "ruby":
        return ":root { --color-blue-900: #881337 !important; --color-blue-950: #4c0519 !important; --color-indigo-900: #be123c !important; --color-indigo-950: #9f1239 !important; --color-amber-400: #f43f5e !important; }";
      case "amber":
        return ":root { --color-blue-900: #78350f !important; --color-blue-950: #451a03 !important; --color-indigo-900: #b45309 !important; --color-indigo-950: #92400e !important; --color-amber-400: #d97706 !important; }";
      case "obsidian":
        return ":root { --color-blue-900: #334155 !important; --color-blue-950: #0f172a !important; --color-indigo-900: #475569 !important; --color-indigo-950: #1e293b !important; --color-amber-400: #64748b !important; }";
      default:
        return "";
    }
  };

  const navItems: Record<Role, { id: string; label: string; icon: React.ComponentType<{ size?: number; className?: string }>; highlight?: boolean }[]> = {
    student: [
      { id: "dashboard", label: "پرتال داوطلب", icon: LayoutDashboard },
      { id: "manova", label: "داشبورد مانوا", icon: Sparkles, highlight: true },
      { id: "report", label: "کارنامه ترازها", icon: FileSpreadsheet },
      { id: "schedule", label: "برنامه‌ریزی", icon: Calendar },
      { id: "counselor", label: "مشاور هوشمند", icon: MessageSquare },
      { id: "progress", label: "روند پیشرفت", icon: LineChart },
      { id: "traps", label: "بانک تله‌های تستی", icon: ShieldAlert },
      { id: "psychology", label: "پایش ذهنی", icon: Brain },
      { id: "metacognition", label: "فراشناخت", icon: Sparkles, highlight: true },
      { id: "counseling", label: "انتخاب رشته", icon: GraduationCap },
    ],
    parent: [
      { id: "parents", label: "نظارت والدین", icon: Users },
      { id: "manova", label: "داشبورد هوشمند", icon: Sparkles, highlight: true },
      { id: "report", label: "کارنامه‌ها", icon: FileSpreadsheet },
      { id: "counseling", label: "تخمین قبولی", icon: GraduationCap },
    ],
    admin: [
      { id: "admin", label: "پنل مدیریت AI", icon: Shield },
      { id: "manova", label: "داشبورد مانوا", icon: Sparkles, highlight: true },
    ],
  };

  const items = navItems[role] || [];

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col" dir="rtl">
      <style dangerouslySetInnerHTML={{ __html: getThemeCSS(theme) }} />

      <div className="bg-slate-900 text-white py-1 px-4 text-[9px] font-black flex justify-between items-center select-none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            سامانه ابری ترنم همدلی فعال است
          </span>
          <span className="hidden sm:inline bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/10">پروتکل امنیتی متصل است</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-400">AI: Gemini Active</span>
          <span className="font-mono text-amber-300">CLOUD_STABLE</span>
        </div>
      </div>

      <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition cursor-pointer">
                <Menu size={22} />
              </button>
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-900 via-slate-900 to-indigo-950 text-white rounded-xl shadow-md flex items-center justify-center flex-shrink-0">
                <Layers size={20} className="text-amber-400" />
              </div>
              <div className="text-right hidden sm:block">
                <span className="font-black text-sm block leading-none text-blue-950">ترنم همدلی</span>
                <span className="text-[10px] text-emerald-600 font-black block mt-0.5">
                  <Sparkles size={8} className="inline ml-0.5" />
                  مربیگری کنکور نسل آینده
                </span>
              </div>
            </div>

            <nav className="hidden lg:flex gap-0.5 overflow-x-auto">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.id} onClick={() => setView(item.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-2 text-[11px] font-bold rounded-xl transition cursor-pointer whitespace-nowrap ${view === item.id ? "bg-slate-100 text-blue-900" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50/50"}`}>
                    <Icon size={13} className={item.highlight ? "text-amber-500" : ""} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-1.5">
              {role === "student" && (
                <SmartNotifications onAction={(type) => {
                  if (type === "challenge") setIsFocusChallengeOpen(true);
                  if (type === "nudge") setView("psychology");
                }} />
              )}

              <div className="text-right hidden md:block mr-1">
                <span className="font-black text-slate-800 text-xs block">{student.name}</span>
                <span className="text-[9px] text-slate-400 font-bold">
                  {role === "student" ? "داوطلب کنکور" : role === "parent" ? "نظارت والدین" : "مدیر آکادمی"}
                </span>
              </div>

              <div className="relative">
                <button onClick={() => setShowThemeMenu(!showThemeMenu)}
                  className={`p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 transition rounded-xl border border-slate-100 cursor-pointer flex items-center gap-1 shadow-sm ${theme !== "classic" ? "ring-2 ring-blue-500" : ""}`}>
                  <Pipette size={15} className="text-amber-500" />
                  <span className="hidden sm:inline text-[10px] font-bold text-slate-500">پوسته</span>
                </button>
                {showThemeMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowThemeMenu(false)} />
                    <div className="absolute left-0 mt-2 w-60 bg-white rounded-2xl border border-slate-100 shadow-xl z-50 p-3 space-y-1 text-right">
                      <p className="text-[9px] text-slate-400 font-black border-b border-slate-100 pb-2 mb-1 flex items-center justify-between">
                        <Palette size={11} />
                        <span>انتخاب پالت رنگی</span>
                      </p>
                      {[
                        { id: "classic", name: "سورمه‌ای اصیل", color: "bg-blue-900" },
                        { id: "emerald", name: "سبز کانون", color: "bg-emerald-800" },
                        { id: "ruby", name: "یاقوت درخشان", color: "bg-rose-900" },
                        { id: "amber", name: "کهربایی گرم", color: "bg-amber-700" },
                        { id: "obsidian", name: "فولاد دودی", color: "bg-slate-700" },
                      ].map((t) => (
                        <button key={t.id} onClick={() => handleThemeChange(t.id)}
                          className={`w-full text-right p-2 rounded-xl text-[10px] font-bold flex items-center justify-between transition cursor-pointer ${theme === t.id ? "bg-slate-50 border border-slate-200" : "hover:bg-slate-50 border border-transparent"}`}>
                          <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${t.color} border border-white shadow`} />
                            <span>{t.name}</span>
                          </div>
                          {theme === t.id && <span className="text-[9px] text-blue-900 font-black bg-blue-50 px-1.5 py-0.5 rounded">فعال</span>}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {role === "student" && (
                <button onClick={() => setIsProfileOpen(true)}
                  className="p-2 bg-slate-50 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 transition rounded-xl border border-slate-100 cursor-pointer">
                  <Settings size={15} />
                </button>
              )}

              {role === "admin" && (
                <div className="relative group">
                  <button className="p-2 bg-slate-50 hover:bg-indigo-50 text-indigo-600 transition rounded-xl border border-slate-100 cursor-pointer">
                    <Building2 size={15} />
                  </button>
                  <div className="absolute left-0 mt-2 w-44 bg-white rounded-2xl border border-slate-100 shadow-xl z-50 p-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition text-right">
                    {INSTITUTIONS.map(inst => (
                      <button key={inst.id} onClick={() => switchBrand(inst.id)}
                        className={`w-full text-right p-2 rounded-xl text-[10px] font-black flex items-center justify-between hover:bg-slate-50 transition cursor-pointer ${activeBrandId === inst.id ? "text-indigo-600 bg-indigo-50/50" : "text-slate-500"}`}>
                        <span>{inst.name}</span>
                        {activeBrandId === inst.id && <Shield size={10} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={onLogout}
                className="p-2 bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-700 transition rounded-xl border border-slate-100 hover:border-red-100 cursor-pointer">
                <LogOut size={15} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] lg:hidden" />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-slate-900/98 backdrop-blur-2xl border-l border-white/5 shadow-2xl z-[101] lg:hidden overflow-y-auto flex flex-col">
              <div className="p-6 bg-white/[0.02] flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-blue-500 text-white rounded-xl flex items-center justify-center shadow-lg">
                    <Layers size={18} />
                  </div>
                  <div>
                    <span className="font-black text-white text-sm block">ترنم همدلی</span>
                    <span className="text-[9px] text-indigo-300 font-bold">مربیگری کنکور نسل آینده</span>
                  </div>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-grow p-5 space-y-1.5">
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = view === item.id;
                  return (
                    <button key={item.id} onClick={() => { setView(item.id); setIsMenuOpen(false); }}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl transition-all group cursor-pointer ${isActive ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${isActive ? "bg-white/20" : "bg-white/5 group-hover:bg-indigo-500/20"}`}>
                          <Icon size={16} className={item.highlight ? "text-amber-400" : ""} />
                        </div>
                        <span className={`text-xs font-black ${isActive ? "text-white" : "text-slate-300"}`}>{item.label}</span>
                      </div>
                      {isActive ? <ChevronLeft size={14} className="text-white" /> : <div className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-indigo-400" />}
                    </button>
                  );
                })}
              </div>
              <div className="p-6 bg-white/[0.02] mt-auto">
                <div className="flex items-center gap-4 mb-5 bg-black/40 p-4 rounded-3xl border border-white/5">
                  <div className="w-11 h-11 bg-gradient-to-b from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center text-white font-black border border-white/10 flex-shrink-0">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs font-black text-white block mb-1">{student.name}</span>
                    <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/10 px-1.5 py-0.5 rounded-md border border-indigo-500/10">{student.grade}</span>
                  </div>
                </div>
                <button onClick={onLogout}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-[10px] font-black text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer">
                  <LogOut size={16} />
                  خروج امن از حساب کاربری
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        <AnimatePresence mode="wait">
          <motion.div key={view} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
            {role === "student" && (
              <>
                {view === "dashboard" && <DashboardView studentId={student.id} studentName={student.name} />}
                {view === "manova" && <ManovaDashboard student={student} onNavigate={setView} />}
                {view === "report" && <ReportView studentId={student.id} />}
                {view === "schedule" && <StudyPlanView />}
                {view === "counselor" && <CounselorView studentField={student.field} />}
                {view === "progress" && <ProgressView studentId={student.id} targetTraz={student.targetTraz} />}
                {view === "traps" && <TrapsView studentId={student.id} />}
                {view === "psychology" && <AssessmentView student={student} onNavigateChange={setView} />}
                {view === "metacognition" && <MetacognitionLabView student={student} />}
                {view === "counseling" && <CounselingAdvisorView student={student} />}
              </>
            )}
            {role === "parent" && (
              <>
                {view === "parents" && <ParentsView student={student} />}
                {view === "manova" && <ManovaDashboard student={student} onNavigate={setView} />}
                {view === "report" && <ReportView studentId={student.id} />}
                {view === "counseling" && <CounselingAdvisorView student={student} />}
              </>
            )}
            {role === "admin" && (
              <>
                {view === "admin" && <AdminView />}
                {view === "manova" && <ManovaDashboard student={student} onNavigate={setView} />}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-white border-t border-slate-100 py-5 text-center text-xs text-slate-400">
        پلتفرم هوشمند آموزشی ترنم همدلی — مربیگری کنکور سراسری ۱۴۰۵ • کپی‌رایت ۱۴۰۵
      </footer>

      <ProfileSettingsView
        student={student}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onUpdate={(updated) => setStudent(updated)}
      />

      <FocusChallengeOverlay
        isActive={isFocusChallengeOpen}
        onClose={() => setIsFocusChallengeOpen(false)}
        onComplete={() => {}}
      />
    </div>
  );
}

function AppContent() {
  const [manualRole, setManualRole] = useState<Role | null>(null);
  // localMe: set immediately from login response (bypasses cookie for first load)
  const [localMe, setLocalMe] = useState<StudentMe | null>(null);
  const logoutMutation = useLogout();

  // useGetMe for page-refresh persistence (when cookie works)
  const { data: serverMe, isLoading: meLoading } = useGetMe({
    query: { queryKey: getGetMeQueryKey(), retry: false, enabled: !localMe },
  });

  // Merge: prefer localMe (just logged in), fall back to serverMe (page refresh)
  const me = localMe ?? (serverMe as StudentMe | undefined) ?? null;
  const loggedIn = !!me || meLoading;

  if (meLoading && !localMe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mx-auto mb-3" />
          <p className="text-sm text-slate-500 font-bold">در حال بارگذاری سامانه...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.clear();
        setLocalMe(null);
        setManualRole(null);
      },
    });
  };

  if (!loggedIn || !me) {
    return <LandingPage onLogin={(r, studentData) => {
      setManualRole(r);
      setLocalMe(studentData);
    }} />;
  }

  const role: Role = (manualRole ?? (me.role as Role | null) ?? "student") as Role;

  return <MainApp me={me} role={role} onLogout={handleLogout} />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
