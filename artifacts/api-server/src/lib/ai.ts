import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { logger } from "./logger";

export interface ActiveProvider {
  id: string;
  apiKey: string;
  baseUrl: string;
  model: string;
}

const PROVIDER_STATE_PATH = path.join(process.cwd(), "data", "active-provider.json");

export function saveProviderState(p: ActiveProvider | null) {
  try {
    fs.mkdirSync(path.dirname(PROVIDER_STATE_PATH), { recursive: true });
    fs.writeFileSync(PROVIDER_STATE_PATH, JSON.stringify(p || null, null, 2), "utf8");
  } catch (e) {
    logger.warn({ err: e }, "Could not save provider state");
  }
}

export function loadProviderState(): ActiveProvider | null {
  try {
    if (fs.existsSync(PROVIDER_STATE_PATH)) {
      const data = JSON.parse(fs.readFileSync(PROVIDER_STATE_PATH, "utf8"));
      if (data && data.id && data.apiKey) return data;
    }
  } catch {}
  return null;
}

export let activeProvider: ActiveProvider | null = null;

export function setActiveProvider(p: ActiveProvider | null) {
  activeProvider = p;
}

export function initDefaultProvider() {
  const saved = loadProviderState();
  if (saved) {
    activeProvider = saved;
    logger.info({ id: saved.id, model: saved.model }, "Restored AI provider from disk");
    return;
  }
  const gemKey = process.env.GEMINI_API_KEY;
  if (gemKey && gemKey.trim()) {
    activeProvider = { id: "gemini", apiKey: gemKey, baseUrl: "", model: "gemini-2.0-flash" };
    logger.info({ model: "gemini-2.0-flash" }, "Default AI provider: Gemini from env");
    return;
  }
  const gapKey = process.env.GAPGPT_API_KEY;
  if (gapKey && gapKey.trim()) {
    const gapUrl = process.env.GAPGPT_BASE_URL || "https://api.gapgpt.app/v1";
    const gapModel = process.env.GAPGPT_MODEL || "gemini-2.5-flash";
    activeProvider = { id: "gapgpt", apiKey: gapKey, baseUrl: gapUrl, model: gapModel };
    logger.info({ model: gapModel }, "Default AI provider: GapGPT from env");
  }
}

function getGeminiClient(key?: string): GoogleGenAI | null {
  try {
    const apiKey = key || process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === "" || apiKey === "undefined") return null;
    return new GoogleGenAI({ apiKey });
  } catch {
    return null;
  }
}

async function callOpenAICompatible(
  baseUrl: string,
  apiKey: string,
  model: string,
  messages: { role: string; content: string }[],
  timeoutMs = 30000
): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model, messages, max_tokens: 1024 }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text().catch(() => res.statusText)}`);
    const data = await res.json() as { choices?: { message?: { content?: string } }[] };
    return data.choices?.[0]?.message?.content?.trim() || "";
  } finally {
    clearTimeout(timer);
  }
}

export async function callAI(messages: { role: string; content: string }[]): Promise<string> {
  if (activeProvider && activeProvider.id !== "gemini") {
    return callOpenAICompatible(activeProvider.baseUrl, activeProvider.apiKey, activeProvider.model, messages);
  }
  const key = activeProvider?.apiKey || process.env.GEMINI_API_KEY;
  const gemini = getGeminiClient(key);
  if (!gemini) throw new Error("no_ai");
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const response = await gemini.models.generateContent({
    model: activeProvider?.model || "gemini-2.0-flash",
    contents,
  });
  return response.text?.trim() || "";
}

export async function callAIJson(prompt: string): Promise<unknown> {
  if (activeProvider && activeProvider.id !== "gemini") {
    const raw = await callOpenAICompatible(
      activeProvider.baseUrl, activeProvider.apiKey, activeProvider.model,
      [{ role: "user", content: prompt }], 45000
    );
    const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
    const s = cleaned.indexOf("{");
    const e = cleaned.lastIndexOf("}");
    if (s === -1 || e === -1) throw new Error("no json");
    return JSON.parse(cleaned.slice(s, e + 1));
  }
  const key = activeProvider?.apiKey || process.env.GEMINI_API_KEY;
  const gemini = getGeminiClient(key);
  if (!gemini) throw new Error("no_ai");
  const response = await gemini.models.generateContent({
    model: activeProvider?.model || "gemini-2.0-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: { responseMimeType: "application/json" },
  });
  const raw = response.text?.trim() || "{}";
  return JSON.parse(raw.replace(/```json/gi, "").replace(/```/g, "").trim());
}

export function maskKey(k: string | undefined): { set: boolean; masked: string } {
  if (!k || k.trim() === "" || k === "undefined" || k === "null") {
    return { set: false, masked: "— تنظیم نشده" };
  }
  const t = k.trim();
  const prefix = t.slice(0, 12);
  const stars = "•".repeat(Math.min(24, Math.max(6, t.length - 12)));
  return { set: true, masked: prefix + stars };
}

export function getOfflineChatReply(message: string): string {
  const lower = (message || "").toLowerCase();
  if (lower.includes("تجربی") || lower.includes("زیست") || lower.includes("پزشکی")) {
    return "سلام کنکوری پرتلاش تجربی! برای قبولی در رشته‌های تاپ تجربی، زیست‌شناسی و شیمی کلیدی‌ترین دروس شما هستند. روزانه حداقل ۳ پارت مطالعه عمیق کتاب درسی به همراه تحلیل دقیق تصاویر زیست و تمرین ۵۰ تست زمان‌دار شیمی را در اولویت قرار دهید.";
  }
  if (lower.includes("ریاضی") || lower.includes("حسابان") || lower.includes("شریف")) {
    return "سلام مهندس آینده! در رشته ریاضی، درس حسابان، دیفرانسیل و هندسه پایه‌های حیاتی تراز شما هستند. تسلط روی فرمول‌ها و به حداقل رساندن اشتباهات محاسباتی تله‌های تستی تراز حسابان شما را رشد می‌دهد.";
  }
  if (lower.includes("انسانی") || lower.includes("ادبیات") || lower.includes("فلسفه")) {
    return "سلام داوطلب گرانقدر رشته انسانی! عربی تخصصی، ادبیات تخصصی و فلسفه و منطق دروس تعیین‌کننده هستند.";
  }
  return "داوطلب فرزانه ترنم مهر، برای تحلیل بهتر روند پیشرفت، تراز آخرین آزمون آزمایشی، رشته تحصیلی و درصد دروس آسیب‌دیده را ذکر کنید.";
}

export function getOfflineGoalInsight(currentTraz: number, targetTraz: number, currentPercentage: number) {
  const trazDiff = (targetTraz || 8500) - (currentTraz || 6500);
  let baseLikelihood = 80;
  if (trazDiff > 0) baseLikelihood -= Math.min(60, Math.round(trazDiff / 30));
  const likelihood = Math.min(96, Math.max(12, baseLikelihood));
  return {
    likelihood,
    text: `مسیر آماده‌سازی ${likelihood >= 70 ? "امیدبخش" : "نیازمند تلاش بیشتر"} است. تراز هدف ${targetTraz} با مداومت قابل دستیابی است.`,
    recommendations: [
      "بهینه‌سازی زمان‌بندی مرور خلاصه‌نویسی‌ها.",
      "تثبیت درصد پاسخ‌دهی با حل ۳۰ تست زمان‌دار موازی.",
      "حفظ پیوستگی استریک مطالعاتی روزانه.",
    ],
  };
}
