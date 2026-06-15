import { useState } from "react";
import { useGetAdminStatus, getGetAdminStatusQueryKey, useGetAdminSecrets, getGetAdminSecretsQueryKey, useActivateProvider, useTestAiProvider, useGetConfigStatus, getGetConfigStatusQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { ShieldAlert, Loader2, Check, X, Zap, Settings, Puzzle, Copy, Download, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WP_PLUGIN_CODE = `<?php
/**
 * Plugin Name: ترنم همدلی — اتصال هوشمند کنکور
 * Plugin URI:  https://taranomehr.com
 * Description: یکپارچه‌سازی پلتفرم هوشمند کنکور ترنم همدلی با سایت وردپرسی شما. امکان نمایش داشبورد دانش‌آموز، ورود به سیستم و مشاور هوش مصنوعی را در هر صفحه یا نوشته فراهم می‌کند.
 * Version:     1.0.0
 * Author:      ترنم همدلی
 * Author URI:  https://taranomehr.com
 * Text Domain: taranom-mehr
 * License:     GPL-2.0+
 */

if ( ! defined( 'ABSPATH' ) ) exit;

define( 'TARANOM_VERSION', '1.0.0' );
define( 'TARANOM_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );

// ──────────────────────────────────────────
// ۱. تنظیمات پایه
// ──────────────────────────────────────────
function taranom_get_platform_url() {
    return rtrim( get_option( 'taranom_platform_url', '' ), '/' );
}

// ──────────────────────────────────────────
// ۲. شورت‌کدها
// ──────────────────────────────────────────

/**
 * [taranom_embed]
 * نمایش کامل پلتفرم به صورت iframe
 * پارامترها: height="750" width="100%" border_radius="16"
 */
function taranom_embed_shortcode( $atts ) {
    $atts = shortcode_atts( [
        'height'        => '750',
        'width'         => '100%',
        'border_radius' => '16',
    ], $atts, 'taranom_embed' );

    $url = taranom_get_platform_url();
    if ( empty( $url ) ) {
        return '<div style="padding:16px;border:1px solid #f87171;border-radius:8px;color:#b91c1c;font-family:Vazirmatn,sans-serif;direction:rtl;">
            ⚠️ آدرس پلتفرم ترنم همدلی تنظیم نشده است. به <a href="' . esc_url( admin_url( 'options-general.php?page=taranom-mehr' ) ) . '">تنظیمات افزونه</a> بروید.
        </div>';
    }

    ob_start(); ?>
    <div class="taranom-embed-wrapper" style="width:<?php echo esc_attr($atts['width']); ?>;overflow:hidden;border-radius:<?php echo esc_attr($atts['border_radius']); ?>px;box-shadow:0 8px 32px rgba(0,0,0,0.1);">
        <iframe
            src="<?php echo esc_url( $url ); ?>"
            width="100%"
            height="<?php echo esc_attr($atts['height']); ?>px"
            frameborder="0"
            allow="clipboard-write"
            style="display:block;border:none;"
            loading="lazy"
            title="پلتفرم ترنم همدلی">
        </iframe>
    </div>
    <?php return ob_get_clean();
}
add_shortcode( 'taranom_embed', 'taranom_embed_shortcode' );

/**
 * [taranom_login_button]
 * دکمه ورود که کاربر را به پلتفرم هدایت می‌کند
 * پارامترها: text="ورود به ترنم همدلی" color="#f59e0b" target="_blank"
 */
function taranom_login_button_shortcode( $atts ) {
    $atts = shortcode_atts( [
        'text'   => 'ورود به ترنم همدلی 🎓',
        'color'  => '#f59e0b',
        'target' => '_blank',
    ], $atts, 'taranom_login_button' );

    $url = taranom_get_platform_url();
    if ( empty( $url ) ) return '';

    return sprintf(
        '<a href="%s" target="%s" rel="noopener" style="display:inline-block;padding:12px 28px;background:%s;color:#1e1b4b;font-weight:700;border-radius:12px;text-decoration:none;font-family:Vazirmatn,sans-serif;direction:rtl;box-shadow:0 4px 14px rgba(245,158,11,0.3);">%s</a>',
        esc_url( $url ),
        esc_attr( $atts['target'] ),
        esc_attr( $atts['color'] ),
        esc_html( $atts['text'] )
    );
}
add_shortcode( 'taranom_login_button', 'taranom_login_button_shortcode' );

/**
 * [taranom_badge]
 * نمایش بج وضعیت اتصال
 */
function taranom_badge_shortcode( $atts ) {
    $url = taranom_get_platform_url();
    $connected = ! empty( $url );
    $color  = $connected ? '#10b981' : '#ef4444';
    $label  = $connected ? 'متصل به ترنم همدلی ✓' : 'اتصال برقرار نشده';
    return sprintf(
        '<span style="display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:999px;background:%s22;color:%s;font-size:13px;font-family:Vazirmatn,sans-serif;direction:rtl;font-weight:600;">
            <span style="width:8px;height:8px;border-radius:50%%;background:%s;display:inline-block;"></span>%s
        </span>',
        $color, $color, $color, esc_html( $label )
    );
}
add_shortcode( 'taranom_badge', 'taranom_badge_shortcode' );

// ──────────────────────────────────────────
// ۳. صفحه تنظیمات وردپرس
// ──────────────────────────────────────────
function taranom_admin_menu() {
    add_options_page(
        'تنظیمات ترنم همدلی',
        'ترنم همدلی',
        'manage_options',
        'taranom-mehr',
        'taranom_settings_page'
    );
}
add_action( 'admin_menu', 'taranom_admin_menu' );

function taranom_settings_page() {
    if ( ! current_user_can( 'manage_options' ) ) return;

    if ( isset( $_POST['taranom_save'] ) ) {
        check_admin_referer( 'taranom_save_settings' );
        update_option( 'taranom_platform_url', esc_url_raw( $_POST['taranom_platform_url'] ?? '' ) );
        update_option( 'taranom_api_key',     sanitize_text_field( $_POST['taranom_api_key'] ?? '' ) );
        echo '<div class="notice notice-success is-dismissible"><p>✅ تنظیمات ذخیره شد.</p></div>';
    }
    ?>
    <div class="wrap" dir="rtl" style="font-family:Vazirmatn,Tahoma,sans-serif;">
        <h1>🎓 تنظیمات افزونه ترنم همدلی</h1>
        <p style="color:#6b7280;">پلتفرم هوشمند کنکور را به سایت وردپرسی خود متصل کنید.</p>

        <form method="post">
            <?php wp_nonce_field( 'taranom_save_settings' ); ?>
            <table class="form-table" style="direction:rtl;">
                <tr>
                    <th scope="row"><label for="taranom_platform_url">آدرس پلتفرم ترنم همدلی</label></th>
                    <td>
                        <input id="taranom_platform_url" name="taranom_platform_url" type="url"
                            value="<?php echo esc_attr( get_option('taranom_platform_url') ); ?>"
                            class="regular-text" placeholder="https://your-app.replit.app" />
                        <p class="description">آدرس کامل پلتفرم شما (مثال: https://taranom.replit.app)</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="taranom_api_key">کلید API (اختیاری)</label></th>
                    <td>
                        <input id="taranom_api_key" name="taranom_api_key" type="password"
                            value="<?php echo esc_attr( get_option('taranom_api_key') ); ?>"
                            class="regular-text" />
                        <p class="description">در صورت فعال بودن احراز هویت API</p>
                    </td>
                </tr>
            </table>
            <?php submit_button( 'ذخیره تنظیمات', 'primary', 'taranom_save' ); ?>
        </form>

        <hr />
        <h2>📋 شورت‌کدهای موجود</h2>
        <table class="widefat striped" style="direction:rtl;">
            <thead>
                <tr><th>شورت‌کد</th><th>توضیح</th><th>مثال</th></tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>[taranom_embed]</code></td>
                    <td>نمایش کامل پلتفرم در صفحه</td>
                    <td><code>[taranom_embed height="750"]</code></td>
                </tr>
                <tr>
                    <td><code>[taranom_login_button]</code></td>
                    <td>دکمه ورود به پلتفرم</td>
                    <td><code>[taranom_login_button text="شروع کنکور هوشمند"]</code></td>
                </tr>
                <tr>
                    <td><code>[taranom_badge]</code></td>
                    <td>نمایش وضعیت اتصال</td>
                    <td><code>[taranom_badge]</code></td>
                </tr>
            </tbody>
        </table>

        <hr />
        <h2>📦 اطلاعات افزونه</h2>
        <p>نسخه: <strong>1.0.0</strong> | نویسنده: <strong>ترنم همدلی</strong> | مجوز: <strong>GPL-2.0+</strong></p>
    </div>
    <?php
}

// ──────────────────────────────────────────
// ۴. بارگذاری فونت Vazirmatn در فرانت‌اند
// ──────────────────────────────────────────
function taranom_enqueue_assets() {
    global $post;
    if ( is_a( $post, 'WP_Post' ) && has_shortcode( $post->post_content, 'taranom_embed' ) ) {
        wp_enqueue_style(
            'taranom-vazirmatn',
            'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;600;700&display=swap',
            [],
            TARANOM_VERSION
        );
    }
}
add_action( 'wp_enqueue_scripts', 'taranom_enqueue_assets' );

// ──────────────────────────────────────────
// ۵. فعال‌سازی / غیرفعال‌سازی
// ──────────────────────────────────────────
register_activation_hook( __FILE__, function () {
    add_option( 'taranom_platform_url', '' );
    add_option( 'taranom_api_key', '' );
} );

register_deactivation_hook( __FILE__, function () {
    // تنظیمات حفظ می‌شوند — برای حذف کامل از Uninstall استفاده کنید
} );
`;

const CREATION_PROMPT = `یک افزونه وردپرس کامل حرفه‌ای به زبان PHP بساز که پلتفرم وب هوشمند کنکور ترنم همدلی را به سایت وردپرسی متصل کند.

مشخصات افزونه:
- نام: ترنم همدلی — اتصال هوشمند کنکور
- نسخه: 1.0.0
- زبان رابط: فارسی RTL
- مجوز: GPL-2.0+

قابلیت‌های مورد نیاز:
۱. شورت‌کد [taranom_embed] برای نمایش پلتفرم به صورت iframe در هر صفحه یا نوشته
   - پارامترهای قابل تنظیم: height, width, border_radius
   - نمایش خطای راهنما اگر آدرس تنظیم نشده باشد
۲. شورت‌کد [taranom_login_button] برای دکمه ورود با استایل سفارشی
   - پارامترها: text, color, target
۳. شورت‌کد [taranom_badge] برای نمایش وضعیت اتصال
۴. صفحه تنظیمات در منوی وردپرس با فیلدهای:
   - آدرس پلتفرم (URL)
   - کلید API (رمزنگاری‌شده)
۵. بارگذاری خودکار فونت Vazirmatn فقط در صفحاتی که شورت‌کد استفاده شده
۶. hook های فعال‌سازی و غیرفعال‌سازی استاندارد وردپرس
۷. بررسی امنیتی ABSPATH، nonce و current_user_can

کدنویسی کامل و production-ready باشد، بدون هیچ TODO یا stub.`;

export default function AdminView() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: status } = useGetAdminStatus({ query: { queryKey: getGetAdminStatusQueryKey() } });
  const { data: secrets } = useGetAdminSecrets({ query: { queryKey: getGetAdminSecretsQueryKey() } });
  const { data: configStatus } = useGetConfigStatus({ query: { queryKey: getGetConfigStatusQueryKey() } });
  const activateProvider = useActivateProvider();
  const testAi = useTestAiProvider();

  const [activeTab, setActiveTab] = useState<"ai" | "wordpress">("ai");
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; response?: string; latency?: number } | null>(null);
  const [customKey, setCustomKey] = useState<{ [k: string]: string }>({});
  const [testProvider, setTestProvider] = useState("gemini");
  const [testPrompt, setTestPrompt] = useState("سلام! یک جمله انگیزشی به فارسی بگو.");

  const [showPluginCode, setShowPluginCode] = useState(false);
  const [showCreationPrompt, setShowCreationPrompt] = useState(false);
  const [improvePrompt, setImprovePrompt] = useState("");
  const [generatingImprove, setGeneratingImprove] = useState(false);

  const handleActivate = (provider: string, apiKey: string, model?: string, baseUrl?: string) => {
    activateProvider.mutate(
      { data: { provider, apiKey, model, baseUrl } },
      {
        onSuccess: (r) => {
          qc.invalidateQueries({ queryKey: getGetAdminStatusQueryKey() });
          toast({ title: "موفق", description: r.message });
        },
        onError: () => toast({ title: "خطا", variant: "destructive" }),
      }
    );
  };

  const handleTest = () => {
    setTestResult(null);
    testAi.mutate(
      { data: { provider: testProvider, prompt: testPrompt, useEnvKey: true } },
      { onSuccess: (r) => setTestResult(r), onError: () => setTestResult({ success: false, message: "خطا در اتصال" }) }
    );
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: `${label} کپی شد ✓` });
    });
  };

  const downloadPlugin = () => {
    const blob = new Blob([WP_PLUGIN_CODE], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "taranom-mehr.php";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "فایل PHP دانلود شد", description: "آن را در پوشه‌ای با نام taranom-mehr قرار داده و ZIP کنید" });
  };

  const generateImprovePrompt = async () => {
    setGeneratingImprove(true);
    setImprovePrompt("");
    try {
      const res = await fetch("/api/ai/counsel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `من یک افزونه وردپرس برای پلتفرم کنکور ترنم همدلی دارم که شامل این قابلیت‌هاست:
- شورت‌کد [taranom_embed] برای نمایش iframe
- شورت‌کد [taranom_login_button] برای دکمه ورود
- شورت‌کد [taranom_badge] برای وضعیت اتصال
- صفحه تنظیمات با URL و API Key
- بارگذاری فونت Vazirmatn

یک پرامپت حرفه‌ای و جامع برای بهبود این افزونه بنویس که:
۱. قابلیت‌های جدید پیشنهاد دهد (مثلاً: widget برای سایدبار، SSO با وردپرس، REST API برای sync داده، shortcode نمودار پیشرفت)
۲. بهبودهای امنیتی را مشخص کند
۳. بهینه‌سازی‌های کد را ذکر کند
۴. پرامپت آماده کپی باشد که بشود مستقیم به یک AI داد

پرامپت را به فارسی و انگلیسی بنویس.`,
        }),
      });
      const data = await res.json() as { message?: string; reply?: string };
      setImprovePrompt(data.message || data.reply || "پرامپت تولید نشد");
    } catch {
      setImprovePrompt("خطا در تولید پرامپت. لطفاً دوباره امتحان کنید.");
    }
    setGeneratingImprove(false);
  };

  const keys = (secrets?.keys || []) as { name: string; provider: string; label: string; set: boolean; masked: string; model: string }[];

  const tabs = [
    { id: "ai" as const, label: "مدیریت هوش مصنوعی", icon: <Zap className="w-4 h-4" /> },
    { id: "wordpress" as const, label: "افزونه وردپرس", icon: <Puzzle className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-indigo-600" />
          پنل مدیریت
        </h1>
        <p className="text-slate-500 mt-1 text-sm">تنظیمات سیستم، هوش مصنوعی و افزونه‌ها</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-t-xl transition-all ${
              activeTab === tab.id
                ? "bg-white border border-b-0 border-slate-200 text-indigo-700 shadow-sm"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Tab: AI Management ─── */}
      {activeTab === "ai" && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <div className="text-xs text-slate-500 mb-1">ارائه‌دهنده فعال</div>
              <div className="font-bold text-lg text-indigo-700">{status?.activeProvider || "—"}</div>
              <div className="text-sm text-slate-500">{status?.activeModel || "—"}</div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <div className="text-xs text-slate-500 mb-1">وضعیت Gemini</div>
              <div className={`font-bold text-lg flex items-center gap-1 ${configStatus?.hasGemini ? "text-emerald-600" : "text-slate-400"}`}>
                {configStatus?.hasGemini ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                {configStatus?.hasGemini ? "فعال" : "غیرفعال"}
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <div className="text-xs text-slate-500 mb-1">وضعیت GapGPT</div>
              <div className={`font-bold text-lg flex items-center gap-1 ${configStatus?.hasGapGPT ? "text-emerald-600" : "text-slate-400"}`}>
                {configStatus?.hasGapGPT ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                {configStatus?.hasGapGPT ? "فعال" : "غیرفعال"}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-600" />
              کلیدهای API ثبت‌شده
            </h2>
            <div className="space-y-3">
              {keys.map((key) => (
                <div key={key.name} data-testid={`card-key-${key.name}`} className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">{key.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        <span className={`inline-flex items-center gap-1 ${key.set ? "text-emerald-600" : "text-rose-500"}`}>
                          {key.set ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          {key.set ? key.masked : "تنظیم نشده"}
                        </span>
                      </div>
                      {key.model && <div className="text-xs text-slate-400 mt-0.5">مدل: {key.model}</div>}
                    </div>
                    <div className="flex gap-2 items-center">
                      <input
                        data-testid={`input-api-key-${key.provider}`}
                        type="password"
                        placeholder="کلید جدید (اختیاری)"
                        value={customKey[key.provider] || ""}
                        onChange={(e) => setCustomKey({ ...customKey, [key.provider]: e.target.value })}
                        className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white w-48"
                      />
                      <button
                        data-testid={`button-activate-${key.provider}`}
                        onClick={() => {
                          const k = customKey[key.provider] || (key.set ? "use-env" : "");
                          if (!k) { toast({ title: "کلید وارد کنید", variant: "destructive" }); return; }
                          handleActivate(key.provider, k === "use-env" ? process.env.GEMINI_API_KEY || "" : k, key.model);
                        }}
                        disabled={activateProvider.isPending}
                        className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-indigo-700 flex items-center gap-1"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        فعال‌سازی
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-semibold text-slate-800 mb-4">تست اتصال هوش مصنوعی</h2>
            <div className="space-y-3">
              <div className="flex gap-3">
                <select
                  data-testid="select-test-provider"
                  value={testProvider}
                  onChange={(e) => setTestProvider(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                >
                  <option value="gemini">Google Gemini</option>
                  <option value="gapgpt">GapGPT</option>
                </select>
                <input
                  data-testid="input-test-prompt"
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50"
                />
                <button
                  data-testid="button-test-ai"
                  onClick={handleTest}
                  disabled={testAi.isPending}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700 flex items-center gap-2"
                >
                  {testAi.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "تست"}
                </button>
              </div>
              {testResult && (
                <div data-testid="result-ai-test" className={`p-4 rounded-xl text-sm ${testResult.success ? "bg-emerald-50 border border-emerald-200" : "bg-rose-50 border border-rose-200"}`}>
                  <div className={`font-semibold mb-1 ${testResult.success ? "text-emerald-700" : "text-rose-700"}`}>
                    {testResult.success ? "اتصال موفق" : "اتصال ناموفق"}
                    {testResult.latency && ` — ${testResult.latency.toLocaleString("fa-IR")} ms`}
                  </div>
                  {testResult.response && <p className="text-slate-700 leading-6">{testResult.response}</p>}
                  {!testResult.success && <p className="text-rose-600">{testResult.message}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── Tab: WordPress Plugin ─── */}
      {activeTab === "wordpress" && (
        <div className="space-y-5">

          {/* Header card */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Puzzle className="w-6 h-6" />
                  <h2 className="text-xl font-bold">افزونه وردپرس ترنم همدلی</h2>
                </div>
                <p className="text-indigo-100 text-sm leading-6">
                  این پلتفرم را به سایت وردپرسی خود متصل کنید. با چند خط shortcode، داشبورد کنکور را در هر صفحه نمایش دهید.
                </p>
                <div className="flex gap-3 mt-4 flex-wrap">
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">نسخه ۱.۰.۰</span>
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">GPL-2.0+</span>
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">۳ شورت‌کد</span>
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">PHP 7.4+</span>
                </div>
              </div>
              <button
                onClick={downloadPlugin}
                className="flex-shrink-0 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-5 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg"
              >
                <Download className="w-5 h-5" />
                دانلود PHP
              </button>
            </div>
          </div>

          {/* ── WordPress page visual preview ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <span className="text-lg">🖥️</span>
                پیش‌نمایش — اینطور در سایت وردپرسی شما دیده می‌شود
              </h3>
              <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full">نمایش واقعی</span>
            </div>

            {/* Browser chrome mock */}
            <div className="bg-slate-100 p-3">
              <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-slate-200">
                {/* Browser bar */}
                <div className="bg-slate-800 flex items-center gap-2 px-4 py-2.5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex-1 mx-3 bg-slate-700 rounded-md px-3 py-1 text-[10px] text-slate-300 font-mono">
                    https://academy.example.ir/portal-konkur
                  </div>
                </div>

                {/* WordPress site mock */}
                <div className="bg-white" dir="rtl">
                  {/* WP header */}
                  <div className="bg-slate-900 text-white flex items-center justify-between px-5 py-3">
                    <div className="font-black text-sm flex items-center gap-2">
                      <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center text-slate-900 text-xs font-black">آ</div>
                      آکادمی نمونه
                    </div>
                    <nav className="hidden sm:flex gap-4 text-xs text-slate-300">
                      <span>خانه</span>
                      <span>دوره‌ها</span>
                      <span className="text-amber-400 font-bold">پرتال دانش‌آموزی</span>
                      <span>درباره ما</span>
                    </nav>
                  </div>

                  {/* WP page title */}
                  <div className="px-6 pt-5 pb-3 border-b border-slate-100">
                    <div className="text-xs text-slate-400 mb-1">آکادمی نمونه / پرتال دانش‌آموزی</div>
                    <h1 className="text-lg font-black text-slate-900">پرتال هوشمند کنکور</h1>
                    <p className="text-slate-500 text-xs mt-1">با وارد کردن کد داوطلبی خود، به داشبورد اختصاصی‌تان دسترسی پیدا کنید.</p>
                  </div>

                  {/* Shortcode rendered: taranom_badge + taranom_embed */}
                  <div className="px-6 py-4 space-y-4">
                    {/* badge shortcode output */}
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                        متصل به ترنم همدلی ✓
                      </span>
                      <span className="text-xs text-slate-400">— [taranom_badge]</span>
                    </div>

                    {/* embed shortcode output: iframe preview */}
                    <div className="relative rounded-xl overflow-hidden border-2 border-indigo-200 shadow-md">
                      <div className="absolute top-2 right-2 z-10 bg-black/50 text-white text-[9px] font-mono px-2 py-0.5 rounded">
                        [taranom_embed height="650"]
                      </div>
                      {/* Simulated platform inside iframe */}
                      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white" style={{ height: 220 }}>
                        {/* Status bar */}
                        <div className="bg-slate-950 px-3 py-1 text-[8px] flex justify-between text-slate-400">
                          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />سامانه فعال است</span>
                          <span className="text-amber-300 font-mono">CLOUD_STABLE</span>
                        </div>
                        {/* Simulated nav */}
                        <div className="bg-white/5 px-3 py-2 flex items-center justify-between border-b border-white/10">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-amber-400/20 rounded-lg flex items-center justify-center">
                              <span className="text-amber-400 text-[8px] font-black">✦</span>
                            </div>
                            <span className="text-[10px] font-black">ترنم همدلی</span>
                          </div>
                          <div className="flex gap-2 text-[8px] text-slate-300">
                            <span className="bg-white/10 px-2 py-0.5 rounded">داشبورد</span>
                            <span>کارنامه</span>
                            <span>مشاور AI</span>
                            <span className="text-amber-400">⚙</span>
                          </div>
                        </div>
                        {/* Simulated dashboard content */}
                        <div className="p-3 grid grid-cols-3 gap-2">
                          {[
                            { label: "تراز کل", value: "۷۲۴۰", color: "bg-amber-500/20 border-amber-500/30" },
                            { label: "هدف", value: "۸۵۰۰", color: "bg-emerald-500/20 border-emerald-500/30" },
                            { label: "پیشرفت", value: "۸۵٪", color: "bg-indigo-500/20 border-indigo-500/30" },
                          ].map((c) => (
                            <div key={c.label} className={`${c.color} border rounded-lg p-2 text-center`}>
                              <div className="text-[8px] text-slate-400">{c.label}</div>
                              <div className="text-sm font-black text-white">{c.value}</div>
                            </div>
                          ))}
                        </div>
                        <div className="px-3 pb-3">
                          <div className="bg-white/5 rounded-lg p-2.5">
                            <div className="text-[8px] text-slate-400 mb-1.5">نمودار پیشرفت هفتگی</div>
                            <div className="flex items-end gap-1 h-10">
                              {[40, 55, 45, 70, 60, 85, 75].map((h, i) => (
                                <div key={i} className="flex-1 bg-indigo-500/60 rounded-sm" style={{ height: `${h}%` }} />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* login button shortcode */}
                    <div className="flex items-center gap-3">
                      <button className="bg-amber-400 text-slate-900 font-black text-xs px-4 py-2 rounded-xl shadow-lg cursor-default">
                        ورود به ترنم همدلی 🎓
                      </button>
                      <span className="text-xs text-slate-400">— [taranom_login_button]</span>
                    </div>
                  </div>

                  {/* WP footer */}
                  <div className="bg-slate-100 border-t border-slate-200 px-5 py-3 text-[10px] text-slate-400 text-center">
                    © ۱۴۰۵ آکادمی نمونه — Powered by WordPress + ترنم همدلی Plugin
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-3 bg-indigo-50 border-t border-indigo-100 text-xs text-indigo-700">
              💡 این پیش‌نمایش نشان می‌دهد صفحه وردپرسی شما بعد از نصب افزونه چگونه به نظر می‌رسد.
              هر شورت‌کد با یک نشانگر <code className="bg-indigo-100 px-1 rounded font-mono">[...]</code> مشخص شده است.
            </div>
          </div>

          {/* Installation guide */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">📦 نحوه نصب افزونه</h3>
            <ol className="space-y-3 text-sm text-slate-700">
              {[
                { step: "۱", title: "دانلود فایل PHP", desc: "دکمه «دانلود PHP» بالا را بزنید. فایل taranom-mehr.php دانلود می‌شود." },
                { step: "۲", title: "ساخت پوشه و ZIP", desc: "یک پوشه با نام taranom-mehr بسازید، فایل PHP را داخل آن بگذارید، سپس آن پوشه را ZIP کنید → taranom-mehr.zip" },
                { step: "۳", title: "آپلود در وردپرس", desc: "در پنل وردپرس به مسیر افزونه‌ها ← افزودن ← بارگذاری افزونه بروید و فایل ZIP را آپلود کنید." },
                { step: "۴", title: "فعال‌سازی", desc: "افزونه را فعال کنید، سپس به تنظیمات ← ترنم همدلی بروید." },
                { step: "۵", title: "تنظیم آدرس", desc: "آدرس کامل این پلتفرم را وارد کنید (مثال: https://yourapp.replit.app) و ذخیره کنید." },
                { step: "۶", title: "استفاده از شورت‌کد", desc: "در هر صفحه یا نوشته shortcode [taranom_embed] را قرار دهید. پلتفرم نمایش داده می‌شود!" },
              ].map((item) => (
                <li key={item.step} className="flex gap-4 p-3 rounded-xl bg-slate-50">
                  <span className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{item.step}</span>
                  <div>
                    <div className="font-semibold text-slate-800 mb-0.5">{item.title}</div>
                    <div className="text-slate-500 text-xs leading-5">{item.desc}</div>
                  </div>
                </li>
              ))}
            </ol>

            {/* Shortcodes table */}
            <div className="mt-5 border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600">شورت‌کدهای موجود</div>
              <table className="w-full text-sm">
                <tbody>
                  {[
                    { code: "[taranom_embed]", desc: "نمایش کامل پلتفرم (iframe)", example: '[taranom_embed height="800"]' },
                    { code: "[taranom_login_button]", desc: "دکمه ورود به پلتفرم", example: '[taranom_login_button text="شروع کنکور"]' },
                    { code: "[taranom_badge]", desc: "بج وضعیت اتصال", example: "[taranom_badge]" },
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                      <td className="px-4 py-2.5 font-mono text-xs text-indigo-700 font-bold">{row.code}</td>
                      <td className="px-4 py-2.5 text-slate-600 text-xs">{row.desc}</td>
                      <td className="px-4 py-2.5">
                        <button
                          onClick={() => copyToClipboard(row.example, row.code)}
                          className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2 py-1 rounded-lg flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          کپی مثال
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Plugin code viewer */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <button
              onClick={() => setShowPluginCode(!showPluginCode)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <span className="font-semibold text-slate-800 flex items-center gap-2">
                <span className="text-lg">📄</span>
                کد کامل افزونه PHP
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">برای مشاهده کلیک کنید</span>
                {showPluginCode ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </div>
            </button>
            {showPluginCode && (
              <div className="border-t border-slate-100">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-800">
                  <span className="text-xs text-slate-400 font-mono">taranom-mehr/taranom-mehr.php</span>
                  <button
                    onClick={() => copyToClipboard(WP_PLUGIN_CODE, "کد افزونه")}
                    className="flex items-center gap-1.5 text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    کپی کد
                  </button>
                </div>
                <pre className="bg-slate-900 text-emerald-300 text-xs p-4 overflow-x-auto leading-5 max-h-96 overflow-y-auto font-mono whitespace-pre-wrap">
                  {WP_PLUGIN_CODE}
                </pre>
              </div>
            )}
          </div>

          {/* Creation prompt */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <button
              onClick={() => setShowCreationPrompt(!showCreationPrompt)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <span className="font-semibold text-slate-800 flex items-center gap-2">
                <span className="text-lg">💬</span>
                پرامپت ساخت افزونه
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">پرامپتی که این افزونه را ساخته</span>
                {showCreationPrompt ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </div>
            </button>
            {showCreationPrompt && (
              <div className="border-t border-slate-100">
                <div className="flex items-center justify-between px-4 py-2 bg-amber-50 border-b border-amber-100">
                  <span className="text-xs text-amber-700">این پرامپت را کپی کرده و به هر AI بدهید تا همین افزونه را بسازد یا بهبود دهد</span>
                  <button
                    onClick={() => copyToClipboard(CREATION_PROMPT, "پرامپت ساخت")}
                    className="flex items-center gap-1.5 text-xs bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    کپی پرامپت
                  </button>
                </div>
                <div className="p-5 bg-amber-50/50">
                  <pre className="text-sm text-slate-700 leading-7 whitespace-pre-wrap font-sans">{CREATION_PROMPT}</pre>
                </div>
              </div>
            )}
          </div>

          {/* Improve prompt generator */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  تولید پرامپت بهبود با AI
                </h3>
                <p className="text-xs text-slate-500 mt-1">هوش مصنوعی یک پرامپت حرفه‌ای برای ارتقای افزونه تولید می‌کند</p>
              </div>
              <button
                onClick={generateImprovePrompt}
                disabled={generatingImprove}
                className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-60"
              >
                {generatingImprove ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />در حال تولید...</>
                ) : (
                  <><Sparkles className="w-4 h-4" />تولید پرامپت بهبود</>
                )}
              </button>
            </div>

            {improvePrompt && (
              <div className="border border-purple-200 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-purple-50 border-b border-purple-100">
                  <span className="text-xs text-purple-700 font-medium">پرامپت بهبود تولیدشده توسط AI — قابل کپی و ویرایش</span>
                  <button
                    onClick={() => copyToClipboard(improvePrompt, "پرامپت بهبود")}
                    className="flex items-center gap-1.5 text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    کپی
                  </button>
                </div>
                <textarea
                  value={improvePrompt}
                  onChange={(e) => setImprovePrompt(e.target.value)}
                  rows={10}
                  className="w-full p-4 text-sm text-slate-700 leading-7 bg-purple-50/30 border-none outline-none resize-y font-sans"
                  placeholder="پرامپت بهبود در اینجا نمایش داده می‌شود..."
                />
              </div>
            )}

            {!improvePrompt && !generatingImprove && (
              <div className="border-2 border-dashed border-purple-200 rounded-xl p-8 text-center">
                <Sparkles className="w-8 h-8 text-purple-300 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">دکمه «تولید پرامپت بهبود» را بزنید تا AI یک پرامپت حرفه‌ای برای ارتقای افزونه بسازد</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
