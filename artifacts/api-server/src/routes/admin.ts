import { Router } from "express";
import { ActivateProviderBody, TestAiProviderBody } from "@workspace/api-zod";
import { activeProvider, setActiveProvider, saveProviderState, maskKey } from "../lib/ai";
import { logger } from "../lib/logger";

const router = Router();

router.get("/admin/status", (_req, res) => {
  res.json({
    activeProvider: activeProvider?.id || null,
    activeModel: activeProvider?.model || null,
    providerStatus: {
      gemini: { hasKey: !!(process.env.GEMINI_API_KEY?.trim()) },
      gapgpt: { hasKey: !!(process.env.GAPGPT_API_KEY?.trim()) },
    },
  });
});

router.get("/admin/secrets", (_req, res) => {
  const gemKey = process.env.GEMINI_API_KEY;
  const gapKey = process.env.GAPGPT_API_KEY;
  const gapUrl = process.env.GAPGPT_BASE_URL || "https://api.gapgpt.app/v1";
  const gapModel = process.env.GAPGPT_MODEL || "gemini-2.5-flash";

  const keys = [
    {
      name: "GEMINI_API_KEY", provider: "gemini", label: "Google Gemini API Key",
      ...maskKey(gemKey), model: "gemini-2.0-flash",
    },
    {
      name: "GAPGPT_API_KEY", provider: "gapgpt", label: "GapGPT (سرور ایرانی)",
      ...maskKey(gapKey), model: gapModel,
    },
  ];
  res.json({
    keys,
    activeProvider: activeProvider ? { id: activeProvider.id, model: activeProvider.model } : null,
    diskProvider: null,
  });
});

router.post("/admin/activate-provider", async (req, res): Promise<void> => {
  const parsed = ActivateProviderBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const { provider, apiKey, baseUrl, model } = parsed.data;
  const providerState = {
    id: provider,
    apiKey,
    baseUrl: baseUrl || (provider === "gapgpt" ? "https://api.gapgpt.app/v1" : ""),
    model: model || (provider === "gemini" ? "gemini-2.0-flash" : "gemini-2.5-flash"),
  };
  setActiveProvider(providerState);
  saveProviderState(providerState);
  logger.info({ provider, model: providerState.model }, "AI provider activated");
  res.json({ success: true, message: `ارائه‌دهنده ${provider} با موفقیت فعال شد` });
});

router.post("/admin/test-ai", async (req, res): Promise<void> => {
  const parsed = TestAiProviderBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const { provider, apiKey, baseUrl, model, prompt = "سلام! یک جمله انگیزشی به فارسی بگو.", useEnvKey } = parsed.data;
  const start = Date.now();

  try {
    let response = "";
    const key = useEnvKey
      ? (provider === "gemini" ? process.env.GEMINI_API_KEY : process.env.GAPGPT_API_KEY) || ""
      : apiKey;

    if (provider === "gemini") {
      const { GoogleGenAI } = await import("@google/genai");
      const client = new GoogleGenAI({ apiKey: key });
      const m = model || "gemini-2.0-flash";
      const result = await client.models.generateContent({
        model: m,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });
      response = result.text?.trim() || "";
    } else {
      const url = baseUrl || "https://api.gapgpt.app/v1";
      const m = model || "gemini-2.5-flash";
      const r = await fetch(`${url}/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
        body: JSON.stringify({ model: m, messages: [{ role: "user", content: prompt }], max_tokens: 256 }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json() as { choices?: { message?: { content?: string } }[] };
      response = data.choices?.[0]?.message?.content?.trim() || "";
    }

    res.json({ success: true, message: "اتصال موفق", response, latency: Date.now() - start, provider, model: model || "" });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    res.json({ success: false, message: `خطا: ${msg}`, latency: Date.now() - start, provider, model: model || "" });
  }
});

router.get("/admin/config-status", (_req, res) => {
  res.json({
    hasGemini: !!(process.env.GEMINI_API_KEY?.trim()),
    hasGapGPT: !!(process.env.GAPGPT_API_KEY?.trim()),
    activeProvider: activeProvider?.id || null,
    activeModel: activeProvider?.model || null,
    configSource: "environment",
    cloudflare: {
      note: "برای استقرار روی Cloudflare، wrangler.toml را تنظیم کنید و secret‌ها را با wrangler secret put بارگذاری کنید",
    },
  });
});

export default router;
