import { LoaderCircle, Send, Target } from "lucide-react";
import { CanvasCard } from "../components/CommonCards";
import Surface from "../components/Surface";

function PitchingScreen({
  chatStarted,
  pitchInput,
  setPitchInput,
  startPitch,
  sendPitchResponse,
  chatMessages,
  isAiTyping,
  ideaSummary,
  identifiedRisks,
  mitigations,
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
      <Surface className="flex min-h-[70vh] flex-col">
        <h2 className="mb-3 text-xl font-semibold">Режим анализа идеи</h2>
        <p className="mb-4 text-sm text-slate-300">
          Тренировочный ассистент для школьных и студенческих проектов: от идеи до понятного плана действий.
        </p>

        <div className="mb-4 flex-1 space-y-3 overflow-y-auto rounded-xl border p-3" style={{ borderColor: "var(--border-color)", background: "var(--bg-secondary)" }}>
          {!chatStarted && (
            <div className="rounded-lg border border-dashed p-4 text-sm" style={{ borderColor: "var(--border-color)", background: "var(--bg-card)", color: "var(--text-muted)" }}>
              Опишите вашу идею (кружок, школьный проект, стартап-клуб или вузовский проект). Система подскажет риски и шаги.
            </div>
          )}
          {chatMessages.map((msg, index) => (
            <div
              key={`${msg.role}-${index}`}
              className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                msg.role === "user"
                  ? "ml-auto bg-indigo-500/10 text-indigo-700 dark:bg-indigo-500/25 dark:text-indigo-100"
                  : "bg-teal-500/10 text-teal-700 dark:bg-teal-500/15 dark:text-teal-100"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {isAiTyping && (
            <div className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm" style={{ background: "var(--bg-card)", color: "var(--brand-500)" }}>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              AI-наставник анализирует...
            </div>
          )}
        </div>

        <div className="space-y-2">
          <textarea
            value={pitchInput}
            onChange={(e) => setPitchInput(e.target.value)}
            placeholder={chatStarted ? "Ответьте ассистенту..." : "Опишите идею, для кого она и как вы хотите ее протестировать..."}
            rows={3}
            className="w-full resize-none rounded-xl border px-3 py-2 text-sm outline-none ring-brand-500/40 focus:ring-2"
            style={{ background: "var(--bg-input)", borderColor: "var(--border-color)", color: "var(--text-main)" }}
          />
          <button
            onClick={chatStarted ? sendPitchResponse : startPitch}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white transition hover:brightness-110"
            style={{ background: "linear-gradient(135deg, var(--brand-500), var(--brand-600))" }}
          >
            <Send className="h-4 w-4" />
            {chatStarted ? "Отправить ответ" : "Начать анализ"}
          </button>
        </div>
      </Surface>

      <Surface className="h-fit">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <Target className="h-5 w-5 text-teal-300" />
          Канва проекта
        </h3>
        <div className="space-y-3">
          <CanvasCard title="Краткое описание идеи" value={ideaSummary} />
          <CanvasCard title="Выявленные риски" value={identifiedRisks} />
          <CanvasCard title="Меры снижения рисков" value={mitigations} />
        </div>
      </Surface>
    </div>
  );
}

export default PitchingScreen;
