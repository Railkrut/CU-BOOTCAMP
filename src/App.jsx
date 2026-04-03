import { useEffect, useState } from "react";
import { Moon, Sparkles, Sun } from "lucide-react";
import DashboardScreen from "./screens/DashboardScreen";
import PitchingScreen from "./screens/PitchingScreen";
import CasesScreen from "./screens/CasesScreen";
import ProfileScreen from "./screens/ProfileScreen";
import {
  audienceSegments,
  caseCatalog,
  caseFeedback,
  funnelStages,
  initialBadges,
  initialRecentActivity,
  navItems,
  problemStats,
  productHighlights,
} from "./data/appData";
import { ApiError } from "./services/apiClient";
import { testApi } from "./services/testApi";
import { generatePitchFollowUp, generatePitchRiskAnalysis } from "./services/mockAiService";

function App() {
  const [theme, setTheme] = useState("dark");
  const [activeScreen, setActiveScreen] = useState("dashboard");
  const [activeCase, setActiveCase] = useState(null);
  const [liveCases, setLiveCases] = useState(caseCatalog);
  const [caseAnswer, setCaseAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [liveCaseFeedback, setLiveCaseFeedback] = useState(caseFeedback);
  const [caseMessages, setCaseMessages] = useState([]);
  const [followupInput, setFollowupInput] = useState("");
  const [isFollowupLoading, setIsFollowupLoading] = useState(false);
  const [showCompletionPulse, setShowCompletionPulse] = useState(false);
  const [apiMode, setApiMode] = useState(null);
  const [apiError, setApiError] = useState("");
  const [casesProgress, setCasesProgress] = useState(null);
  const [lastEvaluation, setLastEvaluation] = useState(null);

  const [chatStarted, setChatStarted] = useState(false);
  const [pitchInput, setPitchInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [ideaSummary, setIdeaSummary] = useState("Начните анализ, чтобы автоматически собрать профиль стартапа.");
  const [identifiedRisks, setIdentifiedRisks] = useState("Риски еще не проанализированы.");
  const [mitigations, setMitigations] = useState("Опишите, как команда протестирует идею в учебном формате.");

  const [recentActivity, setRecentActivity] = useState(initialRecentActivity);
  const [profileStats, setProfileStats] = useState({
    casesSolved: 12,
    pitchesMade: 8,
    dailyStreak: 5,
    loginDays: [1, 2, 3, 5, 6, 8, 9, 11, 12, 14, 15],
  });
  const [badges, setBadges] = useState(initialBadges);

  const currentUser = "Nadia";
  const chatCanSend = pitchInput.trim().length > 0;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const getDifficultyPill = (difficulty) => {
    if (difficulty === "Легкий") return "bg-emerald-500/20 text-emerald-300";
    if (difficulty === "Средний") return "bg-amber-500/20 text-amber-300";
    if (difficulty === "easy") return "bg-emerald-500/20 text-emerald-300";
    if (difficulty === "medium") return "bg-amber-500/20 text-amber-300";
    return "bg-rose-500/20 text-rose-300";
  };

  const mapCase = (item) => ({
    id: item.id,
    title: item.title,
    category: item.theme || item.category || "Кейс",
    difficulty:
      item.difficulty === "easy"
        ? "Легкий"
        : item.difficulty === "medium"
          ? "Средний"
          : item.difficulty === "hard"
            ? "Сложный"
            : item.difficulty,
    shortDescription: item.short_description ?? item.shortDescription ?? "",
    background: item.background ?? "",
    task: item.task ?? "",
    tags: Array.isArray(item.tags) ? item.tags : [],
    referenceSolutionSummary: item.reference_solution_summary ?? "",
    evaluationCriteria: Array.isArray(item.evaluation_criteria) ? item.evaluation_criteria : [],
  });

  const applyEvaluationPayload = (ev) => {
    if (!ev) return;
    const strengths = ev.strengths ?? [];
    const weaknesses = ev.weaknesses ?? [];
    const novel = ev.novel_ideas ?? ev.improvements ?? [];
    setLiveCaseFeedback({ strengths, weaknesses, innovative: novel });
    setLastEvaluation({
      mode: ev.mode ?? null,
      summary: ev.summary ?? "",
      score: ev.score ?? null,
      criteria_scores: ev.criteria_scores ?? ev.criteriaScores ?? [],
      strengths,
      weaknesses,
      improvements: ev.improvements ?? [],
      novel_ideas: ev.novel_ideas ?? [],
      messages: ev.messages,
    });
  };

  const refreshProgress = async () => {
    try {
      const progress = await testApi.getCasesProgress();
      setCasesProgress(progress);
      setProfileStats((prev) => ({
        ...prev,
        casesSolved: progress.solved_count ?? prev.casesSolved,
      }));
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    const loadInitial = async () => {
      try {
        const health = await testApi.health();
        setApiMode(health.mode ?? null);
        if (health.status !== "ok" || !health.ready) {
          setApiError(health.error || "Бэкенд не готов к обработке тестовых запросов.");
          return;
        }

        const [state, progress, apiCases] = await Promise.all([
          testApi.getCaseState(),
          testApi.getCasesProgress(),
          testApi.getCases(),
        ]);

        setApiMode(state.mode ?? health.mode ?? null);
        setCasesProgress(progress);
        setProfileStats((prev) => ({
          ...prev,
          casesSolved: progress.solved_count ?? prev.casesSolved,
        }));

        if (Array.isArray(apiCases) && apiCases.length > 0) {
          setLiveCases(apiCases.map(mapCase));
        }

        if (state.active_case) {
          setActiveCase(mapCase(state.active_case));
          setCaseMessages(state.messages ?? []);
          setLastEvaluation(null);
          if (state.last_evaluation) {
            applyEvaluationPayload(state.last_evaluation);
            setFeedbackVisible(true);
          } else {
            setFeedbackVisible(false);
          }
        }
      } catch {
        setApiError("Не удалось подключиться к /test API. Работаем в локальном режиме.");
      }
    };

    loadInitial();
  }, []);

  const startPitch = async () => {
    if (!chatCanSend) return;
    const userMessage = pitchInput.trim();
    setChatStarted(true);
    setChatMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setPitchInput("");
    setIsAiTyping(true);
    setIdeaSummary(userMessage);
    setIdentifiedRisks("Анализируем потенциальные риски...");
    setMitigations("Ожидается ваш ответ.");

    const result = await generatePitchRiskAnalysis();
    setChatMessages((prev) => [...prev, { role: "ai", text: result.aiReply }]);
    setIsAiTyping(false);
    setIdentifiedRisks(result.identifiedRisks);
    setRecentActivity((prev) => [result.activity, ...prev.slice(0, 3)]);
  };

  const sendPitchResponse = async () => {
    if (!chatCanSend) return;
    const response = pitchInput.trim();
    setChatMessages((prev) => [...prev, { role: "user", text: response }]);
    setPitchInput("");
    setIsAiTyping(true);
    setMitigations(response);

    const aiReply = await generatePitchFollowUp();
    setChatMessages((prev) => [...prev, { role: "ai", text: aiReply }]);
    setIsAiTyping(false);
  };

  const startCase = async (selectedCase) => {
    setApiError("");
    try {
      const started = await testApi.startCase(String(selectedCase.id));
      setActiveCase(mapCase(started.case));
      setCaseMessages(started.messages ?? []);
      setLiveCaseFeedback(caseFeedback);
      setLastEvaluation(null);
      setFeedbackVisible(false);
      setCaseAnswer("");
      setFollowupInput("");
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        setApiError("Кейс не найден. Обновите список и попробуйте снова.");
      } else if (error instanceof ApiError && error.status === 503) {
        setApiError("Бэкенд в режиме misconfigured. Проверьте настройки Yandex/MOCK.");
      } else {
        setApiError("Не удалось стартовать кейс.");
      }
    }
  };

  const submitCase = async () => {
    if (!caseAnswer.trim()) return;
    setIsEvaluating(true);
    setFeedbackVisible(false);

    try {
      const evaluation = await testApi.submitCase(caseAnswer);

      if (evaluation.case) {
        setActiveCase(mapCase(evaluation.case));
      }

      applyEvaluationPayload(evaluation);
      setCaseMessages(evaluation.messages ?? []);
      setFeedbackVisible(true);
      setIsEvaluating(false);
      await refreshProgress();
    } catch (error) {
      setIsEvaluating(false);
      if (error instanceof ApiError && error.status === 400) {
        setApiError("Сначала активируйте кейс через 'Начать'.");
      } else if (error instanceof ApiError && error.status === 502) {
        setApiError("Провайдер LLM временно недоступен (502). Попробуйте повторить.");
      } else {
        setApiError("Не удалось отправить решение.");
      }
    }
  };

  const sendCaseFollowup = async () => {
    if (!followupInput.trim()) return;
    setIsFollowupLoading(true);
    setApiError("");
    try {
      const response = await testApi.followupCase(followupInput.trim());
      if (response.case) {
        setActiveCase(mapCase(response.case));
      }
      setCaseMessages(response.messages ?? []);
      const followupFeedback = {
        strengths: response.advice ?? liveCaseFeedback.strengths,
        weaknesses: response.risks ?? liveCaseFeedback.weaknesses,
        innovative: response.next_questions ?? liveCaseFeedback.innovative,
      };
      setLiveCaseFeedback(followupFeedback);
      setFollowupInput("");
    } catch (error) {
      if (error instanceof ApiError && error.status === 400) {
        setApiError("Follow-up доступен после submit решения.");
      } else {
        setApiError("Не удалось отправить follow-up вопрос.");
      }
    } finally {
      setIsFollowupLoading(false);
    }
  };

  const acknowledgeCase = () => {
    if (!activeCase) return;
    setShowCompletionPulse(true);
    setRecentActivity((prev) => [`Завершено: ${activeCase.title}`, ...prev.slice(0, 3)]);
    setProfileStats((prev) => ({
      ...prev,
      casesSolved: prev.casesSolved + 1,
    }));
    setBadges((prev) =>
      prev.map((badge) =>
        badge.id === "consistency-master" ? { ...badge, unlocked: true } : badge,
      ),
    );
    setTimeout(() => {
      setShowCompletionPulse(false);
      setActiveCase(null);
      setCaseAnswer("");
      setFeedbackVisible(false);
      setLastEvaluation(null);
      refreshProgress();
    }, 900);
  };

  return (
    <div className="min-h-screen text-[var(--text-main)]">
      <div className="mx-auto flex max-w-7xl gap-4 px-3 py-4 sm:px-4 lg:px-6">
        <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-64 flex-col rounded-2xl border p-4 shadow-sm lg:flex" style={{ borderColor: "var(--border-color)", background: "var(--bg-sidebar)" }}>
          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{ background: "linear-gradient(135deg, var(--brand-500), var(--brand-600))" }}>
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-sm font-semibold">Кейс CU</h1>
            </div>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveScreen(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition ${
                    active
                      ? "text-white shadow-lg"
                      : "hover:bg-slate-200/80 dark:hover:bg-white/5"
                  }`}
                  style={
                    active
                      ? { background: "linear-gradient(135deg, var(--brand-500), var(--brand-600))" }
                      : { color: "var(--text-muted)" }
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
          <div className="mt-auto rounded-xl border p-3 text-xs" style={{ borderColor: "var(--border-color)", color: "var(--text-muted)", background: "var(--bg-card)" }}>
            Фокус недели: 1 анализ идеи + 1 кейс = готовый материал для портфолио/чемпионата.
          </div>
          <button
            onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
            className="mt-2 inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium"
            style={{ borderColor: "var(--border-color)", color: "var(--text-muted)" }}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {theme === "dark" ? "Светлая тема" : "Темная тема"}
          </button>
        </aside>

        <div className="w-full space-y-4">
          <div className="rounded-2xl border p-3 lg:hidden" style={{ borderColor: "var(--border-color)", background: "var(--bg-sidebar)" }}>
            <div className="flex items-center gap-2 overflow-x-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = activeScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveScreen(item.id)}
                    className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs ${
                      active ? "text-white" : ""
                    }`}
                    style={
                      active
                        ? { background: "linear-gradient(135deg, var(--brand-500), var(--brand-600))" }
                        : { background: "var(--bg-card)", color: "var(--text-muted)" }
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {activeScreen === "dashboard" && (
            <DashboardScreen
              user={currentUser}
              streak={profileStats.dailyStreak}
              recentActivity={recentActivity}
              onGoPitch={() => setActiveScreen("pitching")}
              onGoCases={() => setActiveScreen("cases")}
              problemStats={problemStats}
              productHighlights={productHighlights}
              audienceSegments={audienceSegments}
              funnelStages={funnelStages}
            />
          )}

          {activeScreen === "pitching" && (
            <PitchingScreen
              chatStarted={chatStarted}
              pitchInput={pitchInput}
              setPitchInput={setPitchInput}
              startPitch={startPitch}
              sendPitchResponse={sendPitchResponse}
              chatMessages={chatMessages}
              isAiTyping={isAiTyping}
              ideaSummary={ideaSummary}
              identifiedRisks={identifiedRisks}
              mitigations={mitigations}
            />
          )}

          {activeScreen === "cases" && (
            <CasesScreen
              caseCatalog={liveCases}
              activeCase={activeCase}
              setActiveCase={startCase}
              caseAnswer={caseAnswer}
              setCaseAnswer={setCaseAnswer}
              submitCase={submitCase}
              isEvaluating={isEvaluating}
              feedbackVisible={feedbackVisible}
              caseFeedback={liveCaseFeedback}
              caseMessages={caseMessages}
              followupInput={followupInput}
              setFollowupInput={setFollowupInput}
              sendCaseFollowup={sendCaseFollowup}
              isFollowupLoading={isFollowupLoading}
              acknowledgeCase={acknowledgeCase}
              getDifficultyPill={getDifficultyPill}
              showCompletionPulse={showCompletionPulse}
              apiMode={apiMode}
              apiError={apiError}
              casesProgress={casesProgress}
              lastEvaluation={lastEvaluation}
            />
          )}

          {activeScreen === "profile" && (
            <ProfileScreen
              stats={profileStats}
              badges={badges}
              currentUser={currentUser}
              casesProgress={casesProgress}
              onResetTestProgress={async () => {
                try {
                  await testApi.resetCasesProgress();
                  await refreshProgress();
                  setApiError("");
                } catch {
                  setApiError("Не удалось сбросить прогресс на сервере.");
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
