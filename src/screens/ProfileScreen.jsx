import { CalendarDays, Trophy } from "lucide-react";
import { StatCard } from "../components/CommonCards";
import Surface from "../components/Surface";

function ProfileScreen({ stats, badges, currentUser, casesProgress, onResetTestProgress }) {
  const days = Array.from({ length: 15 }, (_, i) => i + 1);

  return (
    <div className="space-y-4">
      <Surface>
        <h2 className="text-xl font-semibold">Профиль и геймификация</h2>
        <p className="mt-1 text-sm text-slate-300">Отслеживайте прогресс в кейсах, подготовке к чемпионатам и развитии проектных навыков.</p>
      </Surface>

      {casesProgress && (
        <Surface>
          <h3 className="mb-2 text-lg font-semibold">Прогресс обучения</h3>
          <p className="mb-3 text-sm" style={{ color: "var(--text-muted)" }}>
            Счётчики из системы. После сброса данных списки обнуляются.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span>
              Решено: <strong>{casesProgress.solved_count ?? 0}</strong>
            </span>
            <span>
              Не решено: <strong>{casesProgress.unsolved_count ?? 0}</strong>
            </span>
            {onResetTestProgress && (
              <button
                type="button"
                onClick={onResetTestProgress}
                className="rounded-lg border border-rose-400/40 px-3 py-1.5 text-xs text-rose-200 hover:bg-rose-500/10"
              >
                Сбросить прогресс решения
              </button>
            )}
          </div>
        </Surface>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Surface>
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            <Trophy className="h-5 w-5 text-amber-300" />
            Учебная статистика
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <StatCard
              label="Решено кейсов (из системы)"
              value={casesProgress?.solved_count ?? stats.casesSolved}
            />
            <StatCard label="Подготовлено защит идей" value={stats.pitchesMade} />
          </div>
        </Surface>

        <Surface>
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            <CalendarDays className="h-5 w-5 text-teal-300" />
            Серия и регулярность
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {days.map((day) => {
              const done = stats.loginDays.includes(day);
              return (
                <div
                  key={day}
                  className={`flex h-10 items-center justify-center rounded-lg text-xs ${
                    done ? "bg-brand-500/60 text-white" : ""
                  }`}
                  style={!done ? { background: "var(--bg-secondary)", color: "var(--text-muted)" } : {}}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </Surface>
      </div>

      <Surface>
        <h3 className="mb-3 text-lg font-semibold">Достижения</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`rounded-xl border p-3 text-sm ${
                badge.unlocked
                  ? "border-violet-300/30 bg-violet-500/20 text-violet-100"
                  : "border-slate-600 bg-slate-800/70 text-slate-400"
              }`}
            >
              <p className="font-medium">{badge.name}</p>
              <p className="mt-1 text-xs">{badge.unlocked ? "Открыто" : "Заблокировано"}</p>
            </div>
          ))}
        </div>
      </Surface>
    </div>
  );
}

export default ProfileScreen;
