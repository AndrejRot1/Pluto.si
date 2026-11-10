import { define } from "../../../utils.ts";
import { getSupabaseConfig } from "../../../utils/supabase-env.ts";

export const handler = define.handlers({
  async GET() {
    try {
      const { url, anonKey } = getSupabaseConfig();
      const res = await fetch(`${url}/auth/v1/settings`, {
        headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
      });
      if (!res.ok) {
        return Response.json({ google: false }, { status: 200 });
      }
      const data = await res.json();
      return Response.json({
        google: Boolean(data?.external?.google),
      });
    } catch (e) {
      console.error("Providers check failed:", e);
      return Response.json({ google: false }, { status: 200 });
    }
  },
});
