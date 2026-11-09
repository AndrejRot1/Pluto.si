import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdminConfig } from "./supabase-env.ts";

const { url, serviceKey } = getSupabaseAdminConfig();

export const supabaseAdmin = createClient(url, serviceKey);
