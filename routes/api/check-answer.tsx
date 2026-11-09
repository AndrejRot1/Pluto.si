import { define } from "../../utils.ts";
import { getAccessTokenFromRequest } from "../../utils/auth-cookies.ts";
import { supabaseAdmin } from "../../utils/supabase-admin.ts";
import { subjectSystemPrompt, isSubjectId } from "../../data/subjects.ts";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

async function getApiKey(): Promise<string | undefined> {
  let apiKey = Deno.env.get("DEEPSEEK_API_KEY");
  if (!apiKey) {
    try {
      const envContent = await Deno.readTextFile(".env");
      for (const line of envContent.split("\n")) {
        if (line.startsWith("DEEPSEEK_API_KEY=")) {
          apiKey = line.substring("DEEPSEEK_API_KEY=".length).trim();
          break;
        }
      }
    } catch {
      // ignore
    }
  }
  return apiKey;
}

export const handler = define.handlers({
  async POST(ctx) {
    const token = getAccessTokenFromRequest(ctx.req);
    if (!token) return json({ error: "Unauthorized" }, 401);
    const { data: { user }, error: authError } = await supabaseAdmin.auth
      .getUser(token);
    if (authError || !user) return json({ error: "Unauthorized" }, 401);

    let body: {
      exercise?: string;
      answer?: string;
      subject?: string;
      topic?: string;
      language?: string;
      difficulty?: number;
      duration_ms?: number;
    } = {};
    try {
      body = await ctx.req.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }

    const exercise = String(body.exercise || "").trim();
    const answer = String(body.answer || "").trim();
    if (!exercise || !answer) {
      return json({ error: "Missing exercise or answer" }, 400);
    }

    const language = body.language || "sl";
    const subject = isSubjectId(String(body.subject || "math"))
      ? String(body.subject)
      : "math";
    const apiKey = await getApiKey();
    if (!apiKey) {
      return json({ error: "AI not configured" }, 500);
    }

    const system = subjectSystemPrompt(subject, language) +
      `\nYou are grading a student's answer. Respond ONLY with valid JSON: {"correct":true|false,"feedback":"short feedback"}.
Be fair: accept equivalent correct forms.
In feedback, wrap every formula in $...$ or $$...$$ (chemistry: $\\ce{H2O}$). Keep feedback to 1-2 short sentences.`;

    const userPrompt =
      `Exercise:\n${exercise}\n\nStudent answer:\n${answer}\n\nGrade the answer.`;

    const res = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        temperature: 0,
        messages: [
          { role: "system", content: system },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!res.ok) {
      return json({ error: "Grading failed" }, 502);
    }

    const data = await res.json();
    const raw = String(data.choices?.[0]?.message?.content || "").trim();
    let correct = false;
    let feedback = raw;
    try {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]) as {
          correct?: boolean;
          feedback?: string;
        };
        correct = Boolean(parsed.correct);
        feedback = String(parsed.feedback || "");
      }
    } catch {
      correct = /"correct"\s*:\s*true/i.test(raw);
    }

    await supabaseAdmin.from("learning_events").insert({
      user_id: user.id,
      subject,
      topic: body.topic || null,
      event_type: "answer_checked",
      is_correct: correct,
      difficulty: Number(body.difficulty) || 1,
      duration_ms: Math.max(0, Number(body.duration_ms) || 0),
    });

    return json({ correct, feedback });
  },
});
