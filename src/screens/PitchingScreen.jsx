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

        <div className="mb-4 flex-1 space-y-3 overflow-y-auto rounded-xl border border-white/10 bg-slate-950/40 p-3">
          {!chatStarted && (
            <div className="rounded-lg border border-dashed border-slate-600 bg-slate-900/40 p-4 text-sm text-slate-300">
              Опишите вашу идею (кружок, школьный проект, стартап-клуб или вузовский проект). Система подскажет риски и шаги.
            </div>
          )}
          {chatMessages.map((msg, index) => (
            <div
              key={`${msg.role}-${index}`}
              className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                msg.role === "user"
                  ? "ml-auto bg-indigo-500/25 text-indigo-100"
                  : "bg-teal-500/15 text-teal-100"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {isAiTyping && (
            <div className="inline-flex items-center gap-2 rounded-xl bg-teal-500/15 px-3 py-2 text-sm text-teal-100">
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
            className="w-full resize-none rounded-xl border border-white/10 bg-slate-800/70 px-3 py-2 text-sm text-slate-100 outline-none ring-teal-400/40 placeholder:text-slate-400 focus:ring-2"
          />
          <button
            onClick={chatStarted ? sendPitchResponse : startPitch}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-teal-600 px-4 py-2 text-sm font-medium transition hover:brightness-110"
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
