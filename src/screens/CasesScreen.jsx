import { BadgeCheck, LoaderCircle, Sparkles } from "lucide-react";
import { FeedbackList } from "../components/CommonCards";
import Surface from "../components/Surface";

function CasesScreen({
  caseCatalog,
  activeCase,
  setActiveCase,
  caseAnswer,
  setCaseAnswer,
  submitCase,
  isEvaluating,
  feedbackVisible,
  caseFeedback,
  caseMessages,
  followupInput,
  setFollowupInput,
  sendCaseFollowup,
  isFollowupLoading,
  acknowledgeCase,
  getDifficultyPill,
  showCompletionPulse,
  apiMode,
  apiError,
  casesProgress,
  lastEvaluation,
}) {
  return (
    <div className="space-y-4">
      {apiMode && (
        <div className="rounded-xl border px-3 py-2 text-xs" style={{ borderColor: "var(--border-color)", color: "var(--text-muted)", background: "var(--bg-card)" }}>
          Режим backend: <span className="font-semibold">{apiMode}</span>
        </div>
      )}
      {casesProgress && (
        <div className="flex flex-wrap gap-3 rounded-xl border px-3 py-2 text-sm" style={{ borderColor: "var(--border-color)", background: "var(--bg-card)", color: "var(--text-main)" }}>
          <span>
            Решено: <strong>{casesProgress.solved_count ?? 0}</strong>
          </span>
          <span style={{ color: "var(--text-muted)" }}>|</span>
          <span>
            Не решено: <strong>{casesProgress.unsolved_count ?? 0}</strong>
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            (данные системы, до сброса прогресса)
          </span>
        </div>
      )}
      {apiError && (
        <div className="rounded-xl border border-rose-300/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          {apiError}
        </div>
      )}
      {!activeCase && (
        <Surface>
          <h2 className="mb-4 text-xl font-semibold">Каталог кейсов для школы и вуза</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {caseCatalog.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border p-4"
                style={{ borderColor: "var(--border-color)", background: "var(--bg-card)" }}
              >
                <h3 className="font-semibold">{item.title}</h3>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-indigo-500/20 px-2 py-1 text-indigo-200">{item.category}</span>
                  <span className={`rounded-full px-2 py-1 ${getDifficultyPill(item.difficulty)}`}>
                    {item.difficulty}
                  </span>
                  {item.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border px-2 py-0.5"
                      style={{ borderColor: "var(--border-color)", color: "var(--text-muted)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {item.background && (
                  <p className="mt-3 line-clamp-2 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {item.background}
                  </p>
                )}
                <button
                  onClick={() => setActiveCase(item)}
                  className="mt-4 rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium transition hover:bg-teal-500"
                >
                  Начать
                </button>
              </article>
            ))}
          </div>
        </Surface>
      )}

      {activeCase && (
        <Surface className="space-y-4">
          <div className="space-y-4 rounded-xl border p-4" style={{ borderColor: "var(--border-color)", background: "var(--bg-card)" }}>
            <div>
              <h3 className="font-display text-lg font-semibold">{activeCase.title}</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-xs text-indigo-200">{activeCase.category}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs ${getDifficultyPill(activeCase.difficulty)}`}>
                  {activeCase.difficulty}
                </span>
                {activeCase.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border px-2 py-0.5 text-xs"
                    style={{ borderColor: "var(--brand-500)", color: "var(--brand-500)", background: "var(--bg-card)", opacity: 0.8 }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {activeCase.shortDescription ? (
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {activeCase.shortDescription}
              </p>
            ) : null}

            {activeCase.background ? (
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--brand-500)" }}>
                  Контекст
                </p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-main)" }}>
                  {activeCase.background}
                </p>
              </div>
            ) : null}

            {activeCase.task ? (
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--brand-500)" }}>
                  Задание
                </p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-main)" }}>
                  {activeCase.task}
                </p>
              </div>
            ) : null}

            {activeCase.referenceSolutionSummary ? (
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--brand-500)" }}>
                  Ориентир эталона (кратко)
                </p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-muted)" }}>
                  {activeCase.referenceSolutionSummary}
                </p>
              </div>
            ) : null}

            {activeCase.evaluationCriteria?.length > 0 ? (
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--brand-500)" }}>
                  Критерии оценки
                </p>
                <ul className="list-inside list-disc text-sm" style={{ color: "var(--text-main)" }}>
                  {activeCase.evaluationCriteria.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {!activeCase.background && !activeCase.task && !activeCase.shortDescription ? (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Цель: собрать сильное решение для учебной защиты: проблема, гипотеза, шаги внедрения, метрики и риски.
              </p>
            ) : null}
          </div>

          <textarea
            value={caseAnswer}
            onChange={(e) => setCaseAnswer(e.target.value)}
            placeholder="Напишите структурированное решение: проблема, гипотеза, решение, метрики, план на 2-4 недели..."
            rows={12}
            className="w-full rounded-xl border px-4 py-3 text-sm outline-none ring-brand-500/40 focus:ring-2"
            style={{ background: "var(--bg-input)", borderColor: "var(--border-color)", color: "var(--text-main)" }}
          />

          <button
            onClick={submitCase}
            disabled={isEvaluating}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            style={{ background: "linear-gradient(135deg, var(--brand-500), var(--brand-600))" }}
          >
            {isEvaluating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Отправить на оценку AI
          </button>

          {feedbackVisible && (
            <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-color)", background: "var(--bg-secondary)" }}>
              <h4 className="mb-3 text-base font-semibold">AI-анализ в сравнении с эталоном</h4>
              {lastEvaluation?.score != null && (
                <p className="mb-2 text-lg font-bold" style={{ color: "var(--brand-500)" }}>Оценка: {lastEvaluation.score}</p>
              )}
              {lastEvaluation?.summary ? (
                <p className="mb-3 text-sm leading-relaxed" style={{ color: "var(--text-main)" }}>{lastEvaluation.summary}</p>
              ) : null}
              {lastEvaluation?.criteria_scores?.length > 0 && (
                <div className="mb-4 overflow-x-auto rounded-lg border" style={{ borderColor: "var(--border-color)", background: "var(--bg-card)" }}>
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b" style={{ borderColor: "var(--border-color)", color: "var(--text-muted)" }}>
                        <th className="px-2 py-1">Критерий</th>
                        <th className="px-2 py-1">Балл</th>
                        <th className="px-2 py-1">Комментарий</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lastEvaluation.criteria_scores.map((row) => (
                        <tr key={row.name} className="border-b" style={{ borderColor: "var(--border-color)" }}>
                          <td className="px-2 py-1 font-mono" style={{ color: "var(--text-main)" }}>{row.name}</td>
                          <td className="px-2 py-1" style={{ color: "var(--text-main)" }}>{row.score}</td>
                          <td className="px-2 py-1" style={{ color: "var(--text-muted)" }}>{row.rationale ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <FeedbackList title="Сильные стороны" points={caseFeedback.strengths} tone="text-emerald-600 dark:text-emerald-200" />
              <FeedbackList
                title="Слабые места и риски"
                points={caseFeedback.weaknesses}
                tone="text-amber-600 dark:text-amber-100"
              />
              <FeedbackList title="Инновационные идеи" points={caseFeedback.innovative} tone="text-cyan-600 dark:text-cyan-100" />

              <div className="mt-4 space-y-2 rounded-lg border p-3" style={{ borderColor: "var(--border-color)", background: "var(--bg-card)" }}>
                <p className="text-xs uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                  Follow-up после оценки
                </p>
                <div className="flex gap-2">
                  <input
                    value={followupInput}
                    onChange={(e) => setFollowupInput(e.target.value)}
                    placeholder="Например: какой эксперимент провести первым?"
                    className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500/40"
                    style={{ background: "var(--bg-input)", borderColor: "var(--border-color)", color: "var(--text-main)" }}
                  />
                  <button
                    onClick={sendCaseFollowup}
                    disabled={isFollowupLoading}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
                    style={{ background: "var(--brand-500)" }}
                  >
                    {isFollowupLoading ? "Отправка..." : "Спросить"}
                  </button>
                </div>
              </div>

              {caseMessages?.length > 0 && (
                <div className="mt-4 rounded-lg border p-3" style={{ borderColor: "var(--border-color)", background: "var(--bg-card)" }}>
                  <p className="mb-2 text-xs uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>История сессии обучения</p>
                  <div className="max-h-44 space-y-2 overflow-y-auto">
                    {caseMessages.map((msg, idx) => (
                      <div
                        key={`${msg.role}-${idx}`}
                        className={`rounded-lg px-3 py-2 text-sm ${
                          msg.role === "user"
                            ? "bg-indigo-500/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-100"
                            : "bg-teal-500/10 text-teal-700 dark:bg-teal-500/15 dark:text-teal-100"
                        }`}
                      >
                        {msg.content}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={acknowledgeCase}
                className={`mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                  showCompletionPulse
                    ? "animate-pulse bg-emerald-500 text-slate-950"
                    : "bg-emerald-600 text-white hover:bg-emerald-500"
                }`}
              >
                <BadgeCheck className="h-4 w-4" />
                Подтвердить и отметить как завершенный
              </button>
            </div>
          )}
        </Surface>
      )}
    </div>
  );
}

export default CasesScreen;
