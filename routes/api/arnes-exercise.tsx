import { define } from "../../utils.ts";
import { mostUsedExercises } from "../../data/most-used-exercises.ts";
import { getAccessTokenFromRequest } from "../../utils/auth-cookies.ts";
import { supabaseAdmin } from "../../utils/supabase-admin.ts";

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

function stripHtml(html: string): string {
  let s = html;
  s = s.replace(/<script[\s\S]*?<\/script>/gi, " ");
  s = s.replace(/<style[\s\S]*?<\/style>/gi, " ");
  // Hide solution blocks (white text / res spans)
  s = s.replace(/<span[^>]*id=["']res\d+["'][^>]*>[\s\S]*?<\/span>/gi, " ");
  s = s.replace(/<span[^>]*style=["'][^"']*color\s*:\s*white[^"']*["'][^>]*>[\s\S]*?<\/span>/gi, " ");
  s = s.replace(/<[^>]+>/g, " ");
  s = s.replace(/&nbsp;/g, " ");
  s = s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

export const handler = define.handlers({
  async POST(ctx) {
    const token = getAccessTokenFromRequest(ctx.req);
    if (!token) return json({ error: "Unauthorized" }, 401);
    const { data: { user }, error: authError } = await supabaseAdmin.auth
      .getUser(token);
    if (authError || !user) return json({ error: "Unauthorized" }, 401);

    let body: { id?: string; language?: string } = {};
    try {
      body = await ctx.req.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }

    const item = mostUsedExercises.find((e) => e.id === body.id);
    if (!item) return json({ error: "Unknown exercise set" }, 400);

    const language = body.language || "sl";
    const apiKey = await getApiKey();
    if (!apiKey) return json({ error: "AI not configured" }, 500);

    let pageText = "";
    try {
      const res = await fetch(item.url, {
        headers: { "User-Agent": "Pluto.si tutor bot" },
      });
      if (!res.ok) {
        return json({ error: "Failed to fetch source exercises" }, 502);
      }
      const html = await res.text();
      pageText = stripHtml(html).slice(0, 12000);
    } catch (e) {
      console.error("Arnes fetch failed", e);
      return json({ error: "Failed to fetch source exercises" }, 502);
    }

    if (pageText.length < 80) {
      return json({ error: "Source page empty" }, 502);
    }

    const langLine = language === "sl"
      ? "Odgovori v slovenščini."
      : "Respond in English.";

    const endHint = language === "sl"
      ? "Na koncu dodaj vrstico: Klikni 'Rešitev' za prikaz rešitve"
      : "End with: Click 'Solution' to show the solution";

    const system =
      `You are a Slovenian secondary-school math tutor. ${langLine}
You receive raw text scraped from a public exercise page (source listed below).
Pick EXACTLY ONE exercise from the page (preferably a non-trivial one).
Then restate ONLY the problem clearly with LaTeX in $...$ / $$...$$.
Do NOT solve it. Do NOT give hints toward the answer. Do NOT invent a different problem — use one from the provided text.
${endHint}
After that add a short credit line: Vir: ${item.url}`;

    const userPrompt =
      `Exercise set: ${item.label.sl}\nSource: ${item.url}\n\nPAGE TEXT:\n${pageText}`;

    const res = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        temperature: 0.4,
        messages: [
          { role: "system", content: system },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("DeepSeek arnes error", res.status, errText.slice(0, 200));
      return json({ error: "AI failed" }, 502);
    }

    const data = await res.json();
    const reply = String(data.choices?.[0]?.message?.content || "").trim();
    if (!reply) return json({ error: "Empty AI reply" }, 502);

    return json({
      reply,
      topic: item.label.sl,
      source: item.url,
    });
  },
});
