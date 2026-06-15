import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, User, Target, BookOpen, Check } from "lucide-react";
import { Student } from "../types";

const toPersianNum = (n: number | string) => {
  const farsi = ["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];
  return n.toString().replace(/\d/g, x => farsi[parseInt(x)]);
};

interface ProfileSettingsViewProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (s: Student) => void;
}

export default function ProfileSettingsView({ student, isOpen, onClose, onUpdate }: ProfileSettingsViewProps) {
  const [name, setName] = useState(student.name);
  const [city, setCity] = useState(student.city || "");
  const [mainGoal, setMainGoal] = useState(student.mainGoal || "");
  const [studyHours, setStudyHours] = useState(student.studyHoursPerDay || 4);
  const [targetTraz, setTargetTraz] = useState(student.targetTraz || 7000);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const updated: Student = { ...student, name, city, mainGoal, studyHoursPerDay: studyHours, targetTraz };
    onUpdate(updated);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150]" />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[160] flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-lg border border-slate-100 overflow-hidden text-right" dir="rtl">
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-6 text-white flex justify-between items-center">
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition cursor-pointer">
                  <X size={18} />
                </button>
                <div>
                  <h2 className="text-base font-black">تنظیمات پروفایل</h2>
                  <p className="text-[10px] text-indigo-300 font-bold mt-0.5">ویرایش اطلاعات شخصی و اهداف تحصیلی</p>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-700 text-xl font-black flex-shrink-0">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-black text-slate-900">{student.name}</p>
                    <p className="text-[10px] text-slate-500 font-bold">{student.field} | پایه {student.grade}</p>
                    <p className="text-[9px] text-indigo-600 font-black mt-0.5">کد: {student.code}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 flex items-center gap-1"><User size={11} />نام و نام‌خانوادگی</label>
                      <input type="text" value={name} onChange={e => setName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-indigo-400 transition" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500">شهر محل سکونت</label>
                      <input type="text" value={city} onChange={e => setCity(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-indigo-400 transition" placeholder="مثال: تهران" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 flex items-center gap-1"><BookOpen size={11} />هدف اصلی شما از کنکور</label>
                    <input type="text" value={mainGoal} onChange={e => setMainGoal(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-indigo-400 transition" placeholder="مثال: پزشکی دانشگاه تهران" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-slate-500 flex items-center gap-1"><Target size={11} />تراز هدف</label>
                        <span className="text-xs font-black text-indigo-700 font-mono">{toPersianNum(targetTraz)}</span>
                      </div>
                      <input type="range" min="5000" max="12000" step="100" value={targetTraz} onChange={e => setTargetTraz(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-slate-500">ساعت مطالعه روزانه</label>
                        <span className="text-xs font-black text-amber-700 font-mono">{toPersianNum(studyHours)} ساعت</span>
                      </div>
                      <input type="range" min="1" max="12" step="0.5" value={studyHours} onChange={e => setStudyHours(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500" />
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {saved && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-2.5 rounded-xl text-xs font-black">
                      <Check size={14} />
                      اطلاعات با موفقیت ذخیره شد!
                    </motion.div>
                  )}
                </AnimatePresence>

                <button onClick={handleSave}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-indigo-950 text-white py-3 rounded-xl text-sm font-black transition cursor-pointer shadow-lg">
                  <Save size={16} />
                  ذخیره تغییرات
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
