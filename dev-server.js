const http = require('http');
const fs = require('fs');
const path = require('path');
const {
  handleHealthRequest,
  handleChatRequest,
  handleSendConfirmationRequest,
  setCorsHeaders
} = require('./lib/smartqueue-api');

const PORT = parseInt(process.env.PORT || '8080', 10);

console.log('🔧 SmartQueue Local Dev Server starting...');
console.log('🔑 OpenRouter API Key configured:', process.env.OPENROUTER_API_KEY ? 'Yes' : 'No');
console.log('🔑 Google Gemini API Key configured:', process.env.GOOGLE_API_KEY ? 'Yes' : 'No');
console.log('📧 Apps Script URL configured:', process.env.APPS_SCRIPT_URL ? 'Yes' : 'No');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.txt': 'text/plain; charset=utf-8'
};

function serveStatic(req, res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        const notFoundPath = path.join(__dirname, '404.html');
        if (fs.existsSync(notFoundPath)) {
          res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
          return res.end(fs.readFileSync(notFoundPath));
        }
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('404 Not Found');
      }
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      return res.end('500 Internal Server Error');
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;

  // 1. Health & Config Status Endpoint
  if (pathname === '/api/health') {
    return handleHealthRequest(req, res);
  }

  // 2. Chat Endpoint with API Key Rotation
  if (pathname === '/api/chat') {
    return handleChatRequest(req, res);
  }

  // 3. Send Confirmation Email (patient + doctor Excel via Google Apps Script)
  if (pathname === '/api/send-confirmation') {
    return handleSendConfirmationRequest(req, res);
  }

  // 4. Static Files
  let safePath = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const filePath = path.join(__dirname, safePath);

  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  serveStatic(req, res, filePath);
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 SmartQueue Local Server running at: http://localhost:${PORT}`);
  console.log(`💬 Chat API available at:             http://localhost:${PORT}/api/chat`);
  console.log(`🩺 Health API available at:           http://localhost:${PORT}/api/health`);
  console.log(`🔄 Key Rotation: OpenRouter ➡️  Google Gemini API failover`);
  console.log(`======================================================\n`);
});

module.exports = server;
