import { useEffect, useState } from "preact/hooks";
import { subjects, type SubjectId } from "../data/subjects.ts";

type SubjectStats = {
  totalExercises: number;
  accuracyRate: number;
  correctAnswers: number;
  timeSpentMs: number;
  topicPerformance: Array<{
    topic: string;
    subject: string;
    attempted: number;
    correct: number;
    accuracy: number;
  }>;
};

type ProgressData = SubjectStats & {
  recentActivity: Array<{
    id: string;
    subject: string;
    topic: string | null;
    event_type: string;
    is_correct: boolean | null;
    created_at: string;
  }>;
  bySubject: Record<string, SubjectStats>;
};

function formatDuration(ms: number): string {
  const sec = Math.floor(ms / 1000);
  if (sec < 60) return `${sec}s`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  return `${h}h ${min % 60}m`;
}

type Filter = "all" | SubjectId;

export default function ProgressPanel() {
  const [data, setData] = useState<ProgressData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    fetch("/api/progress")
      .then(async (res) => {
        if (!res.ok) throw new Error("Napaka pri nalaganju napredka");
        return res.json();
      })
      .then((json) => setData(json))
      .catch((e) => setError(e.message || "Napaka"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div class="max-w-3xl mx-auto p-6 text-gray-600">Nalagam napredek...</div>
    );
  }

  if (error || !data) {
    return (
      <div class="max-w-3xl mx-auto p-6 text-red-600">
        {error || "Ni podatkov"}
      </div>
    );
  }

  const stats: SubjectStats = filter === "all"
    ? data
    : (data.bySubject?.[filter] || {
      totalExercises: 0,
      accuracyRate: 0,
      correctAnswers: 0,
      timeSpentMs: 0,
      topicPerformance: [],
    });

  const topics = filter === "all"
    ? data.topicPerformance
    : stats.topicPerformance;

  const activity = filter === "all"
    ? data.recentActivity
    : data.recentActivity.filter((a) => a.subject === filter);

  const cards = [
    { label: "Skupaj nalog", value: String(stats.totalExercises), icon: "🎯", bg: "bg-blue-50", iconBg: "bg-blue-100" },
    { label: "Natančnost", value: `${stats.accuracyRate}%`, icon: "📈", bg: "bg-green-50", iconBg: "bg-green-100" },
    { label: "Pravilni odgovori", value: String(stats.correctAnswers), icon: "🏅", bg: "bg-purple-50", iconBg: "bg-purple-100" },
    { label: "Čas učenja", value: formatDuration(stats.timeSpentMs), icon: "⏱", bg: "bg-orange-50", iconBg: "bg-orange-100" },
  ];

  const subjectLabel = Object.fromEntries(
    subjects.map((s) => [s.id, s.label.sl]),
  );

  return (
    <div class="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Tvoj napredek</h1>
        <p class="text-gray-600 mt-1">
          Spremljaj učenje po predmetih: matematika, fizika, kemija, biologija
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          class={`px-3 py-1.5 text-sm rounded-lg font-medium ${
            filter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
          }`}
        >
          Vse
        </button>
        {subjects.map((s) => (
          <button
            type="button"
            key={s.id}
            onClick={() => setFilter(s.id)}
            class={`px-3 py-1.5 text-sm rounded-lg font-medium ${
              filter === s.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            {s.emoji} {s.label.sl}
          </button>
        ))}
      </div>

      {filter === "all" && (
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {subjects.map((s) => {
            const sStats = data.bySubject?.[s.id];
            return (
              <button
                type="button"
                key={s.id}
                onClick={() => setFilter(s.id)}
                class="text-left rounded-xl border border-gray-200 bg-white p-3 hover:border-blue-300 transition-colors"
              >
                <div class="text-sm font-semibold text-gray-900">
                  {s.emoji} {s.label.sl}
                </div>
                <div class="text-xs text-gray-600 mt-1">
                  {sStats?.totalExercises ?? 0} nalog · {sStats?.accuracyRate ?? 0}%
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cards.map((c) => (
          <div
            key={c.label}
            class={`rounded-xl border border-gray-200 ${c.bg} p-4 flex items-center gap-3`}
          >
            <div class={`w-11 h-11 rounded-lg ${c.iconBg} flex items-center justify-center text-xl`}>
              {c.icon}
            </div>
            <div>
              <div class="text-2xl font-bold text-gray-900">{c.value}</div>
              <div class="text-sm text-gray-600">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
        <h2 class="text-lg font-semibold text-gray-900 mb-3">Uspešnost po temah</h2>
        {topics.length === 0 ? (
          <p class="text-sm text-gray-500">
            Še ni podatkov. Reši naloge in preveri odgovore.
          </p>
        ) : (
          <div class="space-y-3">
            {topics.map((t) => (
              <div key={`${t.subject}-${t.topic}`}>
                <div class="flex justify-between text-sm mb-1">
                  <span class="font-medium text-gray-800">
                    {subjectLabel[t.subject] || t.subject}: {t.topic}
                  </span>
                  <span class="text-gray-600">
                    {t.correct}/{t.attempted} ({t.accuracy}%)
                  </span>
                </div>
                <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div class="h-full bg-blue-600 rounded-full" style={`width: ${t.accuracy}%`} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
        <h2 class="text-lg font-semibold text-gray-900 mb-3">Zadnja aktivnost</h2>
        {activity.length === 0 ? (
          <p class="text-sm text-gray-500">Še ni aktivnosti.</p>
        ) : (
          <ul class="space-y-2">
            {activity.map((a) => (
              <li
                key={a.id}
                class="text-sm text-gray-700 flex justify-between gap-3 border-b border-gray-100 pb-2"
              >
                <span>
                  {subjectLabel[a.subject] || a.subject}
                  {a.topic ? ` · ${a.topic}` : ""} · {a.event_type}
                  {a.is_correct === true ? " ✓" : a.is_correct === false ? " ✗" : ""}
                </span>
                <span class="text-gray-400 whitespace-nowrap">
                  {new Date(a.created_at).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
