import { useState } from "react";
import { Bell, X, Zap, BookOpen, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SmartNotificationsProps {
  onAction: (type: string) => void;
}

interface Notification {
  id: string;
  type: "challenge" | "nudge" | "reminder";
  title: string;
  body: string;
  icon: React.ReactNode;
  color: string;
  time: string;
  read: boolean;
}

export default function SmartNotifications({ onAction }: SmartNotificationsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "challenge",
      title: "چالش تمرکز هوشمند",
      body: "مربی کایزن تشخیص داده الان بهترین زمان برای یک چالش ۵ دقیقه‌ای است!",
      icon: <Zap size={14} />,
      color: "text-amber-500 bg-amber-50 border-amber-100",
      time: "همین لحظه",
      read: false
    },
    {
      id: "2",
      type: "nudge",
      title: "پایش آمادگی ذهنی",
      body: "سطح تمرکز شما در آزمون‌های اخیر نیاز به بررسی دارد.",
      icon: <Brain size={14} />,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
      time: "۳۰ دقیقه پیش",
      read: false
    },
    {
      id: "3",
      type: "reminder",
      title: "یادآوری مطالعه",
      body: "امروز برنامه درسی زیست‌شناسی فصل ۳ را مرور کنید.",
      icon: <BookOpen size={14} />,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      time: "۱ ساعت پیش",
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleNotificationClick = (n: Notification) => {
    markRead(n.id);
    onAction(n.type);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-500 transition rounded-xl border border-slate-100 cursor-pointer shadow-sm"
        title="اعلان‌ها"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -left-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 mt-2.5 w-80 bg-white rounded-2xl border border-slate-100 shadow-xl z-50 overflow-hidden text-right"
            >
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg transition">
                  <X size={14} className="text-slate-400" />
                </button>
                <div>
                  <span className="font-black text-slate-900 text-sm">اعلان‌های هوشمند</span>
                  {unreadCount > 0 && (
                    <span className="mr-1.5 text-[9px] font-black text-rose-600 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded-full">
                      {unreadCount} جدید
                    </span>
                  )}
                </div>
              </div>

              <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
                {notifications.map(n => (
                  <button
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`w-full p-4 text-right hover:bg-slate-50 transition flex items-start gap-3 ${n.read ? "opacity-60" : ""}`}
                  >
                    <div className={`p-2 rounded-xl border text-xs flex-shrink-0 mt-0.5 ${n.color}`}>
                      {n.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-400 font-bold">{n.time}</span>
                        {!n.read && <span className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0" />}
                      </div>
                      <p className="text-xs font-black text-slate-800 mt-0.5">{n.title}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed font-medium">{n.body}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-3 border-t border-slate-100 text-center">
                <button
                  onClick={() => { setNotifications(prev => prev.map(n => ({ ...n, read: true }))); }}
                  className="text-[10px] font-black text-slate-400 hover:text-indigo-600 transition"
                >
                  همه را خواندم
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
