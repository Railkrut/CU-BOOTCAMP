import { BriefcaseBusiness, Flame, MessageSquare, Rocket } from "lucide-react";
import Surface from "../components/Surface";

function DashboardScreen({
  user,
  streak,
  recentActivity,
  onGoPitch,
  onGoCases,
  problemStats,
  productHighlights,
  audienceSegments,
  funnelStages,
}) {
  return (
    <div className="space-y-4">
      <Surface className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-semibold">Кейс Ап</h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Платформа для школьников и студентов: учитесь запускать идеи через кейсы и симуляции.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border px-3 py-2" style={{ borderColor: "rgba(249,115,22,0.35)", background: "rgba(249,115,22,0.12)" }}>
          <Flame className="h-5 w-5" style={{ color: "var(--brand-500)" }} />
          <span className="text-sm font-medium">Серия: {streak} дней</span>
        </div>
      </Surface>

      <div className="grid gap-4 md:grid-cols-3">
        {problemStats.map((item) => (
          <Surface key={item.label}>
            <p className="font-display text-2xl font-semibold" style={{ color: "var(--brand-500)" }}>{item.value}</p>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>{item.label}</p>
          </Surface>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <button
          onClick={onGoPitch}
          className="premium-card p-5 text-left transition hover:-translate-y-0.5"
        >
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg text-white" style={{ background: "linear-gradient(135deg, var(--brand-500), var(--brand-600))" }}>
            <Rocket className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold">Проанализировать идею стартапа</h3>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            Получите обратную связь по MVP, рискам и первым шагам запуска без лишней теории.
          </p>
        </button>
        <button
          onClick={onGoCases}
          className="premium-card p-5 text-left transition hover:-translate-y-0.5"
        >
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg text-white" style={{ background: "linear-gradient(135deg, var(--brand-500), var(--brand-600))" }}>
            <BriefcaseBusiness className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold">Решить практический кейс</h3>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            Готовьтесь к олимпиадам, кейс-чемпионатам и собеседованиям в бизнес-клубы.
          </p>
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Surface>
          <h3 className="mb-3 text-lg font-semibold">Что внутри платформы</h3>
          <ul className="space-y-2 text-sm">
            {productHighlights.map((item) => (
              <li key={item} className="rounded-lg border px-3 py-2" style={{ borderColor: "var(--border-color)", color: "var(--text-main)" }}>
                {item}
              </li>
            ))}
          </ul>
        </Surface>

        <Surface>
          <h3 className="mb-3 text-lg font-semibold">Целевая аудитория</h3>
          <ul className="space-y-2 text-sm">
            {audienceSegments.map((item) => (
              <li key={item} className="rounded-lg border px-3 py-2" style={{ borderColor: "var(--border-color)", color: "var(--text-main)" }}>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <p className="mb-2 text-xs uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Воронка продукта</p>
            <div className="flex flex-wrap gap-2">
              {funnelStages.map((stage) => (
                <span key={stage} className="rounded-full border px-3 py-1 text-xs" style={{ borderColor: "rgba(249,115,22,0.35)", color: "var(--brand-500)", background: "rgba(249,115,22,0.08)" }}>
                  {stage}
                </span>
              ))}
            </div>
          </div>
        </Surface>
      </div>

      <Surface>
        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <MessageSquare className="h-5 w-5 text-violet-300" />
          Последняя активность
        </h3>
        <ul className="space-y-2 text-sm">
          {recentActivity.map((item) => (
            <li key={item} className="rounded-lg border px-3 py-2" style={{ borderColor: "var(--border-color)", color: "var(--text-main)" }}>
              {item}
            </li>
          ))}
        </ul>
      </Surface>
    </div>
  );
}

export default DashboardScreen;
