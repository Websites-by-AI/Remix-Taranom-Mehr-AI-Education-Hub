import { Router } from "express";
import { SendChatBody, AnalyzeExamBody, GetGoalInsightBody } from "@workspace/api-zod";
import { callAI, callAIJson, getOfflineChatReply, getOfflineGoalInsight } from "../lib/ai";

const router = Router();

const MOTIVATIONAL_QUOTES = [
  "هر روزی که مطالعه می‌کنی، آینده‌ات را می‌سازی.",
  "کنکور یک امتحان تلاش است، نه هوش — تو توانایی قبولی را داری.",
  "استمرار، مرز بین موفقیت و شکست است.",
  "هدفت را واضح ببین، مسیرت را با برنامه طی کن.",
  "امروز قدمی کوچک برداری، فردا بزرگ‌ترین پله را صعود کرده‌ای.",
  "نه استعداد، بلکه پشتکار است که رتبه‌ساز می‌شود.",
  "اگر سخت است، یعنی ارزش دارد. ادامه بده.",
  "هر تست اشتباه که تحلیل می‌کنی، یک نقطه‌ضعف را برای همیشه حذف می‌کنی.",
];

router.get("/ai/motivational", (_req, res) => {
  const quote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
  res.json({ quote });
});

router.post("/ai/chat", async (req, res): Promise<void> => {
  const parsed = SendChatBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const { message, history = [], studentField } = parsed.data;

  const systemPrompt = `تو دکتر راضیه راداَن، مشاور تخصصی کنکور ترنم مهر هستی. وظیفه‌ات کمک به دانش‌آموزان ایرانی برای موفقیت در کنکور سراسری است.
رشته دانش‌آموز: ${studentField || "نامشخص"}.
- همیشه به فارسی پاسخ بده
- مثبت، حمایتگر و علمی باش
- راهنمایی دقیق و کاربردی بده
- از اصطلاحات آموزشی کنکور ایران استفاده کن (تراز، رتبه، درصد، آزمون گاج، قلم‌چی)`;

  try {
    const messages = [
      { role: "user", content: systemPrompt },
      ...(history || []).map((m: { role: string; content: string }) => ({ role: m.role, content: m.content })),
      { role: "user", content: message },
    ];
    const reply = await callAI(messages);
    res.json({ reply: reply || getOfflineChatReply(message) });
  } catch {
    res.json({ reply: getOfflineChatReply(message) });
  }
});

router.post("/ai/analyze-exam", async (req, res): Promise<void> => {
  const parsed = AnalyzeExamBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const { lessons, field } = parsed.data;
  const fieldName = field === "riazi" ? "ریاضی" : field === "ensani" ? "انسانی" : "تجربی";

  const prompt = `تو یک تحلیلگر هوشمند کنکور ایران هستی. آرایه JSON تحلیل عملکرد درس‌های یک داوطلب کنکور رشته ${fieldName} را دریافت کردی:

${JSON.stringify(lessons, null, 2)}

یک تحلیل جامع JSON برگردان با فرمت دقیق زیر (فقط JSON، بدون توضیحات):
{
  "weaknesses": [{"topic": "نام درس", "subject": "موضوع ضعیف", "percentage": عدد, "recommendation": "توصیه دقیق", "questionsCount": عدد, "severity": "high/medium/low"}],
  "estimatedNextTraz": عدد,
  "psychological": {"pattern": "نام الگو", "description": "توضیح", "stressLevel": عدد1تا10, "suggestion": "پیشنهاد"},
  "remedialPlan": [{"day": "روز اول", "morningPlan": "برنامه صبح", "afternoonPlan": "برنامه بعداز‌ظهر", "totalQuestions": عدد}]
}`;

  try {
    const result = await callAIJson(prompt) as Record<string, unknown>;
    res.json({
      weaknesses: result.weaknesses || [],
      estimatedNextTraz: result.estimatedNextTraz || 5500,
      psychological: result.psychological,
      remedialPlan: result.remedialPlan,
    });
  } catch {
    const totalPct = (lessons || []).reduce((s: number, l: { percentage: number }) => s + l.percentage, 0);
    const avg = lessons.length > 0 ? totalPct / lessons.length : 0;
    const estTraz = Math.round(4000 + avg * 40);
    res.json({
      weaknesses: (lessons || [])
        .filter((l: { percentage: number }) => l.percentage < 40)
        .map((l: { lessonName: string; percentage: number }) => ({
          topic: l.lessonName, subject: "مبحث ضعیف", percentage: l.percentage,
          recommendation: `تمرکز بیشتر روی ${l.lessonName} ضروری است`,
          questionsCount: 30, severity: l.percentage < 25 ? "high" : "medium",
        })),
      estimatedNextTraz: estTraz,
    });
  }
});

router.post("/ai/goal-insight", async (req, res): Promise<void> => {
  const parsed = GetGoalInsightBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const { currentTraz, targetTraz, currentPercentage, targetGrowth, latestQuizScore, studentField } = parsed.data;

  const fieldName = studentField === "riazi" ? "ریاضی" : studentField === "ensani" ? "انسانی" : "تجربی";

  const prompt = `داوطلب کنکور رشته ${fieldName}:
تراز فعلی: ${currentTraz}، تراز هدف: ${targetTraz}، درصد کلی آخرین آزمون: ${currentPercentage || 0}%، رشد هدف: ${targetGrowth || 0}%، نمره آزمونک اخیر: ${latestQuizScore || 0}

فقط یک JSON با این فرمت برگردان:
{"likelihood": عدد0تا100, "text": "توضیح کوتاه فارسی", "recommendations": ["پیشنهاد۱", "پیشنهاد۲", "پیشنهاد۳"]}`;

  try {
    const result = await callAIJson(prompt) as { likelihood: number; text: string; recommendations: string[] };
    res.json({
      likelihood: result.likelihood || 70,
      text: result.text || "مسیر پیشرفت نیاز به ارزیابی دارد.",
      recommendations: result.recommendations || [],
    });
  } catch {
    res.json(getOfflineGoalInsight(currentTraz, targetTraz, currentPercentage || 0));
  }
});

export default router;
