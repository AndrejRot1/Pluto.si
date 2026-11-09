import { define } from "../../utils.ts";
import { supabaseAdmin } from "../../utils/supabase-admin.ts";
import { getAccessTokenFromRequest } from "../../utils/auth-cookies.ts";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

async function getUserId(req: Request): Promise<string | null> {
  const token = getAccessTokenFromRequest(req);
  if (!token) return null;
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return null;
  return user.id;
}

export const handler = define.handlers({
  async GET(ctx) {
    const userId = await getUserId(ctx.req);
    if (!userId) return json({ error: "Unauthorized" }, 401);

    const { data: events, error } = await supabaseAdmin
      .from("learning_events")
      .select(
        "id, subject, topic, event_type, is_correct, difficulty, duration_ms, created_at",
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      console.error("progress GET error:", error);
      return json({ error: "Failed to load progress" }, 500);
    }

    const rows = events ?? [];
    const started = rows.filter((e) => e.event_type === "exercise_started");
    const checked = rows.filter((e) => e.event_type === "answer_checked");
    const correct = checked.filter((e) => e.is_correct === true);
    const totalExercises = started.length;
    const correctAnswers = correct.length;
    const accuracy = checked.length > 0
      ? Math.round((correctAnswers / checked.length) * 100)
      : 0;
    const timeSpentMs = rows.reduce(
      (sum, e) => sum + (e.duration_ms || 0),
      0,
    );

    const topicMap = new Map<
      string,
      { topic: string; subject: string; attempted: number; correct: number }
    >();
    for (const e of checked) {
      const key = `${e.subject}::${e.topic || "Unknown"}`;
      const cur = topicMap.get(key) || {
        topic: e.topic || "Unknown",
        subject: e.subject,
        attempted: 0,
        correct: 0,
      };
      cur.attempted += 1;
      if (e.is_correct) cur.correct += 1;
      topicMap.set(key, cur);
    }

    const topicPerformance = [...topicMap.values()]
      .map((t) => ({
        ...t,
        accuracy: t.attempted > 0
          ? Math.round((t.correct / t.attempted) * 100)
          : 0,
      }))
      .sort((a, b) => b.attempted - a.attempted)
      .slice(0, 12);

    const recentActivity = rows.slice(0, 20).map((e) => ({
      id: e.id,
      subject: e.subject,
      topic: e.topic,
      event_type: e.event_type,
      is_correct: e.is_correct,
      created_at: e.created_at,
    }));

    const subjectIds = ["math", "physics", "chemistry", "biology"] as const;
    const bySubject = Object.fromEntries(
      subjectIds.map((sid) => {
        const sStarted = started.filter((e) => e.subject === sid);
        const sChecked = checked.filter((e) => e.subject === sid);
        const sCorrect = sChecked.filter((e) => e.is_correct === true);
        const sRows = rows.filter((e) => e.subject === sid);
        return [
          sid,
          {
            totalExercises: sStarted.length,
            correctAnswers: sCorrect.length,
            accuracyRate: sChecked.length > 0
              ? Math.round((sCorrect.length / sChecked.length) * 100)
              : 0,
            timeSpentMs: sRows.reduce(
              (sum, e) => sum + (e.duration_ms || 0),
              0,
            ),
            topicPerformance: topicPerformance.filter((t) => t.subject === sid),
          },
        ];
      }),
    );

    return json({
      totalExercises,
      accuracyRate: accuracy,
      correctAnswers,
      timeSpentMs,
      topicPerformance,
      recentActivity,
      bySubject,
    });
  },

  async POST(ctx) {
    const userId = await getUserId(ctx.req);
    if (!userId) return json({ error: "Unauthorized" }, 401);

    let body: Record<string, unknown> = {};
    try {
      body = await ctx.req.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }

    const eventType = String(body.event_type || "");
    if (
      !["exercise_started", "answer_checked", "solution_viewed"].includes(
        eventType,
      )
    ) {
      return json({ error: "Invalid event_type" }, 400);
    }

    const subject = String(body.subject || "math");
    if (!["math", "physics", "chemistry", "biology"].includes(subject)) {
      return json({ error: "Invalid subject" }, 400);
    }

    const row = {
      user_id: userId,
      subject,
      topic: body.topic ? String(body.topic) : null,
      event_type: eventType,
      is_correct: typeof body.is_correct === "boolean"
        ? body.is_correct
        : null,
      difficulty: Number(body.difficulty) || 1,
      duration_ms: Math.max(0, Number(body.duration_ms) || 0),
    };

    const { error } = await supabaseAdmin.from("learning_events").insert(row);
    if (error) {
      console.error("progress POST error:", error);
      return json({ error: "Failed to save event" }, 500);
    }

    return json({ ok: true });
  },
});
