import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabaseBrowser(): SupabaseClient {
  if (client) return client;
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as
    | string
    | undefined;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Manjkata VITE_SUPABASE_URL in VITE_SUPABASE_ANON_KEY v .env datoteki.",
    );
  }
  client = createClient(supabaseUrl, supabaseAnonKey);
  return client;
}

/** Lazy proxy so importing this module never throws at load time. */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const real = getSupabaseBrowser();
    const value = Reflect.get(real, prop, receiver);
    return typeof value === "function" ? value.bind(real) : value;
  },
});
