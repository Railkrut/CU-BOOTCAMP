export function CanvasCard({ title, value }) {
  return (
    <article className="rounded-xl border border-white/10 bg-slate-800/70 p-3">
      <p className="mb-1 text-xs uppercase tracking-wide text-slate-400">{title}</p>
      <p className="text-sm text-slate-100">{value}</p>
    </article>
  );
}

export function FeedbackList({ title, points, tone }) {
  return (
    <div className="mb-3">
      <h5 className="mb-1 text-sm font-semibold">{title}</h5>
      <ul className={`space-y-1 text-sm ${tone}`}>
        {points.map((point) => (
          <li key={point}>- {point}</li>
        ))}
      </ul>
    </div>
  );
}

export function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-800/70 p-3">
      <p className="text-2xl font-semibold text-teal-200">{value}</p>
      <p className="mt-1 text-xs text-slate-300">{label}</p>
    </div>
  );
}
