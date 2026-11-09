let supabaseUrl = Deno.env.get("SUPABASE_URL");
let supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
let supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  try {
    const envContent = await Deno.readTextFile(".env");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq);
      const value = trimmed.slice(eq + 1).trim();
      if (key === "SUPABASE_URL" && !supabaseUrl) supabaseUrl = value;
      if (key === "SUPABASE_ANON_KEY" && !supabaseAnonKey) {
        supabaseAnonKey = value;
      }
      if (key === "SUPABASE_SERVICE_ROLE_KEY" && !supabaseServiceKey) {
        supabaseServiceKey = value;
      }
    }
  } catch {
    // .env not found
  }
}

export function getSupabaseConfig() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Manjkata SUPABASE_URL in SUPABASE_ANON_KEY. Nastavi ju v .env datoteki.",
    );
  }
  return { url: supabaseUrl, anonKey: supabaseAnonKey };
}

export function getSupabaseAdminConfig() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Manjkata SUPABASE_URL in SUPABASE_SERVICE_ROLE_KEY. Nastavi ju v .env datoteki.",
    );
  }
  return { url: supabaseUrl, serviceKey: supabaseServiceKey };
}
