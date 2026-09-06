import { createClient } from "@supabase/supabase-js";

// =====================================================================
// SUPABASE CONFIGURATION
// =====================================================================
const SUPABASE_URL = "https://gyxgzycjmrenggwofmpj.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_8lqWpjReTGbAMgESJW6Rpg_bOlbMqbL";

// Create and export the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
