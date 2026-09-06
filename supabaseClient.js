// ==============================================================================
// supabaseClient.js - Supabase Client Initialization & Google OAuth
// ==============================================================================
// Uses the official Supabase JavaScript SDK (@supabase/supabase-js v2 via CDN)
// Publishable Key: sb_publishable_mOQWxXYa2T3XcA07g6orbw_ofxr_M88
// ==============================================================================

(function (window) {
  'use strict';

  // 1. Supabase Project Credentials
  // Reads from window.NEXT_PUBLIC_SUPABASE_* (configured via .env) or falls back to project defaults
  const DEFAULT_SUPABASE_URL = "https://mtcjvblcwdntyqjaedzz.supabase.co";
  const DEFAULT_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_mOQWxXYa2T3XcA07g6orbw_ofxr_M88";

  // Allow dynamic override from window, localStorage, or defaults
  function getSupabaseUrl() {
    try {
      const stored = localStorage.getItem('smartqueue_supabase_url');
      if (stored && stored.trim().startsWith('http')) {
        return stored.trim();
      }
    } catch (e) {}
    return window.NEXT_PUBLIC_SUPABASE_URL || window.SUPABASE_URL || DEFAULT_SUPABASE_URL;
  }

  function getSupabasePublishableKey() {
    return window.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || DEFAULT_SUPABASE_PUBLISHABLE_KEY;
  }

  function setSupabaseUrl(url) {
    if (url && url.trim().startsWith('http')) {
      localStorage.setItem('smartqueue_supabase_url', url.trim());
      window.location.reload();
    }
  }

  let clientInstance = null;

  function initClient() {
    if (typeof supabase === 'undefined') {
      console.warn('[SmartQueue Auth] Supabase SDK script not loaded yet. Waiting for CDN...');
      return null;
    }
    const currentUrl = getSupabaseUrl();
    const currentKey = getSupabasePublishableKey();
    try {
      clientInstance = supabase.createClient(currentUrl, currentKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storage: window.localStorage
        }
      });
      return clientInstance;
    } catch (err) {
      console.error('[SmartQueue Auth] Failed to initialize Supabase client:', err);
      return null;
    }
  }

  // Helper: Sign In with Google OAuth
  async function signInWithGoogle(redirectTo) {
    const client = clientInstance || initClient();
    if (!client) {
      throw new Error('Supabase client is not initialized. Please ensure the Supabase SDK is loaded.');
    }

    const targetRedirect = redirectTo || (window.location.origin + '/login.html');

    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: targetRedirect,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    });

    if (error) throw error;
    return data;
  }

  // Helper: Sign Out
  async function signOut() {
    const client = clientInstance || initClient();
    if (client) {
      try {
        await client.auth.signOut();
      } catch (e) {
        console.warn('[SmartQueue Auth] Sign out error:', e);
      }
    }
    try {
      localStorage.removeItem('smartqueue_user');
      localStorage.removeItem('smartqueue_remember_email');
    } catch (e) {}
  }

  // Helper: Get Current Session & User
  async function getSession() {
    const client = clientInstance || initClient();
    if (!client) return null;
    try {
      const { data: { session }, error } = await client.auth.getSession();
      if (error) {
        console.warn('[SmartQueue Auth] Session fetch error:', error);
        return null;
      }
      return session;
    } catch (err) {
      console.warn('[SmartQueue Auth] getSession error:', err);
      return null;
    }
  }

  // Initialize immediately if SDK is present
  if (typeof supabase !== 'undefined') {
    initClient();
  } else {
    window.addEventListener('DOMContentLoaded', () => {
      if (typeof supabase !== 'undefined') initClient();
    });
  }

  // Export API to window.smartQueueAuth
  window.smartQueueAuth = {
    get client() {
      return clientInstance || initClient();
    },
    initClient,
    getSupabaseUrl,
    getSupabasePublishableKey,
    setSupabaseUrl,
    DEFAULT_SUPABASE_URL,
    DEFAULT_SUPABASE_PUBLISHABLE_KEY,
    get SUPABASE_PUBLISHABLE_KEY() {
      return getSupabasePublishableKey();
    },
    signInWithGoogle,
    signOut,
    getSession
  };

  // Also bind to window.supabaseClient for compatibility
  Object.defineProperty(window, 'supabaseClient', {
    get: function () {
      return clientInstance || initClient();
    },
    configurable: true
  });

})(window);
