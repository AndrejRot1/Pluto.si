import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import { supabaseAdmin } from "../utils/supabase-admin.ts";
import { isAdminEmail } from "../utils/admin.ts";

type ProfileRow = {
  id: string;
  email: string;
  subscription_status: string | null;
  trial_helps_used: number | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string | null;
};

function statusBadge(status: string | null) {
  const s = status || "unknown";
  const colors: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-800",
    trial: "bg-sky-100 text-sky-800",
    expired: "bg-amber-100 text-amber-900",
    canceled: "bg-slate-100 text-slate-700",
    cancelled: "bg-slate-100 text-slate-700",
  };
  return colors[s] || "bg-gray-100 text-gray-700";
}

export default define.page(async (ctx) => {
  const email = ctx.state.user?.email;
  if (!isAdminEmail(email)) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/app" },
    });
  }

  const { data: profiles } = await supabaseAdmin
    .from("profiles")
    .select(
      "id, email, subscription_status, trial_helps_used, stripe_customer_id, stripe_subscription_id, created_at",
    )
    .order("created_at", { ascending: false });

  const rows = (profiles || []) as ProfileRow[];
  const counts = {
    total: rows.length,
    trial: rows.filter((p) => p.subscription_status === "trial").length,
    active: rows.filter((p) => p.subscription_status === "active").length,
    expired: rows.filter((p) => p.subscription_status === "expired").length,
  };

  const { count: eventsCount } = await supabaseAdmin
    .from("learning_events")
    .select("id", { count: "exact", head: true });

  const { count: subscriptionsCount } = await supabaseAdmin
    .from("subscriptions")
    .select("id", { count: "exact", head: true });

  return (
    <>
      <Head>
        <title>Admin • Pluto.si</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div class="min-h-screen bg-slate-50">
        <header class="border-b border-slate-200 bg-white">
          <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <div>
              <h1 class="text-lg font-semibold text-slate-900">Admin dashboard</h1>
              <p class="text-xs text-slate-500">Samo za {email}</p>
            </div>
            <div class="flex items-center gap-3 text-sm">
              <a href="/app" class="text-blue-600 hover:underline">← Chat</a>
              <a href="/settings" class="text-slate-600 hover:underline">
                Nastavitve
              </a>
            </div>
          </div>
        </header>

        <main class="mx-auto max-w-6xl space-y-6 px-4 py-6">
          <section class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div class="rounded-xl border border-slate-200 bg-white p-4">
              <p class="text-xs uppercase tracking-wide text-slate-500">
                Uporabniki
              </p>
              <p class="mt-1 text-3xl font-semibold text-slate-900">
                {counts.total}
              </p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white p-4">
              <p class="text-xs uppercase tracking-wide text-slate-500">
                Active / Trial / Expired
              </p>
              <p class="mt-1 text-lg font-semibold text-slate-900">
                {counts.active} / {counts.trial} / {counts.expired}
              </p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white p-4">
              <p class="text-xs uppercase tracking-wide text-slate-500">
                Learning events
              </p>
              <p class="mt-1 text-3xl font-semibold text-slate-900">
                {eventsCount ?? 0}
              </p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white p-4">
              <p class="text-xs uppercase tracking-wide text-slate-500">
                Stripe subscriptions
              </p>
              <p class="mt-1 text-3xl font-semibold text-slate-900">
                {subscriptionsCount ?? 0}
              </p>
            </div>
          </section>

          <section class="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div class="border-b border-slate-100 px-4 py-3">
              <h2 class="text-sm font-semibold text-slate-800">Uporabniki</h2>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full text-left text-sm">
                <thead class="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th class="px-4 py-2 font-medium">Email</th>
                    <th class="px-4 py-2 font-medium">Status</th>
                    <th class="px-4 py-2 font-medium">Trial used</th>
                    <th class="px-4 py-2 font-medium">Stripe</th>
                    <th class="px-4 py-2 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((p) => (
                    <tr class="border-t border-slate-100" key={p.id}>
                      <td class="px-4 py-2.5 text-slate-800">{p.email}</td>
                      <td class="px-4 py-2.5">
                        <span
                          class={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${
                            statusBadge(p.subscription_status)
                          }`}
                        >
                          {p.subscription_status || "—"}
                        </span>
                      </td>
                      <td class="px-4 py-2.5 text-slate-700">
                        {p.trial_helps_used ?? 0}/10
                      </td>
                      <td class="px-4 py-2.5 text-xs text-slate-500">
                        {p.stripe_subscription_id
                          ? "✓ sub"
                          : p.stripe_customer_id
                          ? "customer only"
                          : "—"}
                      </td>
                      <td class="px-4 py-2.5 text-xs text-slate-500">
                        {p.created_at
                          ? new Date(p.created_at).toLocaleDateString("sl-SI")
                          : "—"}
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td class="px-4 py-6 text-slate-500" colSpan={5}>
                        Ni uporabnikov.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </>
  );
});
