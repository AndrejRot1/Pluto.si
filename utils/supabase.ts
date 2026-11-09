import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "./supabase-env.ts";

const { url, anonKey } = getSupabaseConfig();

export const supabase = createClient(url, anonKey);

export interface Profile {
  id: string;
  email: string;
  trial_ends_at: string;
  trial_helps_used: number;
  subscription_status: "trial" | "active" | "cancelled" | "expired";
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  created_at: string;
  updated_at: string;
}
