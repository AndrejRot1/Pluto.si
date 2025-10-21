import { createClient } from "@supabase/supabase-js";

// Load environment variables
let supabaseUrl = Deno.env.get("SUPABASE_URL");
let supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

// Fallback to .env file if not in environment
if (!supabaseUrl || !supabaseAnonKey) {
  try {
    const envContent = await Deno.readTextFile(".env");
    const envLines = envContent.split('\n');
    for (const line of envLines) {
      if (line.startsWith('SUPABASE_URL=')) {
        supabaseUrl = line.split('=')[1].trim();
      }
      if (line.startsWith('SUPABASE_ANON_KEY=')) {
        supabaseAnonKey = line.split('=')[1].trim();
      }
    }
  } catch (error) {
    console.log('No .env file found');
  }
}

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_ANON_KEY in .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface Profile {
  id: string;
  email: string;
  trial_ends_at: string;
  subscription_status: 'trial' | 'active' | 'cancelled' | 'expired';
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  created_at: string;
  updated_at: string;
}

