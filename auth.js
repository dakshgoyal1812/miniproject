// ==============================================================================
// auth.js - Authentication & Session Management Logic
// ==============================================================================
// This file handles:
// 1. Sign In with Google OAuth
// 2. Sign Out
// 3. Auth Guard for protected pages (dashboard.html)
// 4. Redirect for already-authenticated users (login.html)
// 5. Real-time UI updates via onAuthStateChange
//
// Requires: supabaseClient.js must be loaded BEFORE this file!
// ==============================================================================

// Reference our initialized client
const client = window.supabaseClient;

/**
 * 1. Sign In with Google OAuth
 * Calls Supabase to initiate the Google OAuth flow.
 * The user will be redirected to Google's sign-in page, then back to your site.
 */
async function signInWithGoogle() {
  try {
    // Show loading state if button exists
    const googleBtn = document.getElementById('googleSignInBtn');
    if (googleBtn) {
      googleBtn.disabled = true;
      googleBtn.innerText = 'Connecting to Google...';
    }

    // Determine redirect URL: where Google sends the user back after login
    // window.location.origin is e.g. "http://localhost:8080" or "https://yoursite.com"
    const redirectToUrl = `${window.location.origin}/dashboard.html`;

    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectToUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });

    if (error) {
      console.error('Error signing in with Google:', error.message);
      showAuthError(error.message);
      if (googleBtn) {
        googleBtn.disabled = false;
        googleBtn.innerText = 'Sign in with Google';
      }
    }
  } catch (err) {
    console.error('Unexpected sign-in error:', err);
    showAuthError('Failed to initialize Google login. Please try again.');
  }
}

/**
 * 2. Sign Out Function
 * Terminates the active session and sends the user back to the login page.
 */
async function signOut() {
  try {
    const { error } = await client.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
      alert('Sign out error: ' + error.message);
      return;
    }
    // Redirect to login page upon successful logout
    window.location.href = 'login.html';
  } catch (err) {
    console.error('Unexpected sign out error:', err);
    window.location.href = 'login.html';
  }
}

/**
 * 3. Auth Guard for Protected Pages (e.g. dashboard.html)
 * Run this when a protected page loads.
 * If no valid session exists, immediately redirect to login.html.
 * If a session exists, returns the authenticated user object.
 */
async function requireAuth() {
  try {
    const { data: { session }, error } = await client.auth.getSession();

    if (error) {
      console.error('Session retrieval error:', error.message);
      window.location.href = 'login.html';
      return null;
    }

    if (!session || !session.user) {
      // No active session found -> bounce to login page
      console.warn('No active session found. Redirecting to login.html...');
      window.location.href = 'login.html';
      return null;
    }

    // Session is valid!
    console.log('User authenticated:', session.user.email);
    updateDashboardUI(session.user);
    return session.user;
  } catch (err) {
    console.error('Auth guard error:', err);
    window.location.href = 'login.html';
    return null;
  }
}

/**
 * 4. Redirect If Already Authenticated (for login.html)
 * If a user visits login.html while already logged in,
 * automatically redirect them forward to the dashboard.
 */
async function redirectIfAuthenticated() {
  try {
    const { data: { session } } = await client.auth.getSession();
    if (session && session.user) {
      console.log('Already signed in as:', session.user.email);
      window.location.href = 'dashboard.html';
    }
  } catch (err) {
    console.error('Error checking existing session:', err);
  }
}

/**
 * 5. Keep UI in sync with Realtime Auth State
 * Listens for SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, etc.
 */
client.auth.onAuthStateChange((event, session) => {
  console.log('Auth state change event:', event);

  if (event === 'SIGNED_IN' && session) {
    // If on dashboard, update user details
    updateDashboardUI(session.user);
  } else if (event === 'SIGNED_OUT') {
    // If on a protected page, redirect away
    if (window.location.pathname.includes('dashboard.html')) {
      window.location.href = 'login.html';
    }
  }
});

/**
 * Helper: Populate user information on dashboard.html
 */
function updateDashboardUI(user) {
  if (!user) return;

  // 1. Display User Name
  const nameEl = document.getElementById('userName');
  if (nameEl) {
    const fullName = user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0];
    nameEl.textContent = fullName;
  }

  // 2. Display User Email
  const emailEl = document.getElementById('userEmail');
  if (emailEl) {
    emailEl.textContent = user.email;
  }

  // 3. Display User Avatar (from Google profile)
  const avatarEl = document.getElementById('userAvatar');
  if (avatarEl && user.user_metadata?.avatar_url) {
    avatarEl.src = user.user_metadata.avatar_url;
    avatarEl.style.display = 'block';
  }
}

/**
 * Helper: Display error message on login.html
 */
function showAuthError(message) {
  const errorBox = document.getElementById('authErrorMessage');
  if (errorBox) {
    errorBox.textContent = message;
    errorBox.style.display = 'block';
  } else {
    alert(message);
  }
}
