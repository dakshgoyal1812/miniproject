// ==============================================================================
// supabaseClient.js - Supabase Client Initialization (Plain Vanilla JS)
// ==============================================================================
// This file initializes the Supabase client using credentials from your project.
// Include this script AFTER loading the Supabase JS library via CDN:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
// ==============================================================================

// 1. Replace these placeholders with your actual Supabase project credentials:
// You can find them in your Supabase Dashboard -> Project Settings -> API
const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

// 2. Initialize the Supabase client
// When using the CDN script, the global 'supabase' library is attached to window.
// We call 'supabase.createClient' to create our custom client instance.
if (typeof supabase === 'undefined') {
  console.error("Supabase CDN script not loaded! Make sure to include the CDN script before supabaseClient.js.");
}

// Attach our initialized client to 'window.supabaseClient' so all other scripts (like auth.js) can access it
window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
