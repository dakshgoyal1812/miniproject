// api/config.js - Public Supabase and Application Configuration
module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  res.statusCode = 200;
  res.end(JSON.stringify({
    success: true,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mtcjvblcwdntyqjaedzz.supabase.co',
    supabasePublishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_mOQWxXYa2T3XcA07g6orbw_ofxr_M88'
  }));
};
